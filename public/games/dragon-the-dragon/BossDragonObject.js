import * as THREE from 'three';
import { VehicleObject } from './VehicleObject.js';
import { DragonFireBreath } from './DragonFireBreath.js';
import { CONFIG } from './config.js';

// Shared scratch objects — reused every frame to avoid allocations.
const _tmpVec3 = new THREE.Vector3();
const _tmpVec3B = new THREE.Vector3();
const _tmpVec3Zero = new THREE.Vector3();

// Boss fire attack states.
const BOSS_FIRE_STATE = Object.freeze({
    IDLE: 'idle',
    FLAME: 'flame',
    FLAME_COOLDOWN: 'flameCooldown',
    FIREBALL: 'fireball',
});

// Debug line color constants (used when debugRenderMatterPhysics is true).
const DEBUG_COLOR_FIREBALL_RANGE = 0xff4400;
const DEBUG_COLOR_FLAME_RANGE    = 0xff8800;
const DEBUG_COLOR_AIM_VECTOR     = 0x00ffff;

export class BossDragonObject extends VehicleObject {
    constructor(options) {
        super(options);

        // alwaysUpdate keeps fire ticking even when off-screen.
        this.alwaysUpdate = true;

        // DragonFireBreath instance — created after the GLB loads in load().
        this.dragonFire = null;

        // The player dragon — injected by LevelObjectManager or game code.
        this._playerDragon = null;

        // --- fire AI state ---
        this._bossFireState = BOSS_FIRE_STATE.IDLE;
        this._flameBurstTimer = 0;   // counts down while flame burst is active
        this._flameCooldownTimer = 0;// counts down between flame bursts
        this._fireballCooldownTimer = 0; // counts down between fireballs
        this._fireballMouthOpenTimer = 0; // briefly holds mouth open after firing

        // Hit registry: Set of fireball IDs already registered as having hit targets.
        this._fireballHitRegistry = new Map();

        // Debug visualization line segments.
        this._debugLines = null;

        // Merged boss fire config (resolved once so hot path reads a plain object).
        this._bossFireConfig = null;

        // Aim direction set by fire AI each frame, applied to flameDirection after dragonFire.update().
        this._fireAimDirX = 1;
        this._fireAimDirY = 0;

        // --- guard animation blend ---
        // Weights for the three guard loops (neutral / up / down).
        this._guardBlendWeights = { guard: 0, guardUp: 0, guardDown: 0 };
        // Current blend mode, same neutral→up/down state machine as the player hover blend.
        this._guardBlendMode = 'neutral';
        this._guardBlendPendingMode = null;
        // Whether the guard blend is currently active (player in range).
        this._guardBlendActive = false;
        // Current aim angle (degrees) fed to the blend each frame — stored so _stopGuardBlend
        // can smoothly exit rather than snap.
        this._guardAimAngleDeg = 0;
    }

    // -------------------------------------------------------------------------
    // Loading
    // -------------------------------------------------------------------------

    async load() {
        await super.load();
//        console.log('[BossDragon] available animations:', [...this.animationClips.keys()]);
        this._resolveBossFireConfig();
        this._setupBossFireBreath();
        this._setupDebugLines();
        return this;
    }

    // -------------------------------------------------------------------------
    // Config helpers
    // -------------------------------------------------------------------------

    _resolveBossFireConfig() {
        const src = CONFIG.LEVEL_OBJECT_TYPES?.bossdragon?.bossFire || {};
        this._bossFireConfig = {
            enabled:           src.enabled          !== false,
            fireballRange:     Number.isFinite(src.fireballRange)      ? src.fireballRange      : 30,
            flameRange:        Number.isFinite(src.flameRange)         ? src.flameRange         : 10,
            fireballCooldown:  Number.isFinite(src.fireballCooldown)   ? src.fireballCooldown   : 1.5,
            flameBurstDuration:Number.isFinite(src.flameBurstDuration) ? src.flameBurstDuration : 2.0,
            flameCooldown:     Number.isFinite(src.flameCooldown)      ? src.flameCooldown      : 1.0,
            maxAimAngleUp:     Number.isFinite(src.maxAimAngleUp)      ? src.maxAimAngleUp      : 45,
            maxAimAngleDown:   Number.isFinite(src.maxAimAngleDown)    ? src.maxAimAngleDown    : 35,
            fireballDamage:    Number.isFinite(src.fireballDamage)     ? src.fireballDamage     : 20,
            flameDamagePerSecond: Number.isFinite(src.flameDamagePerSecond) ? src.flameDamagePerSecond : 15,
            fireballSpeed:     Number.isFinite(src.fireballSpeed)        ? src.fireballSpeed        : 18,
            mouthOpenWhileFiring: src.mouthOpenWhileFiring !== false,
            debug:             src.debug === true,
        };
    }

    // -------------------------------------------------------------------------
    // Fire breath setup — mirrors Player.setupDragonFireBreath()
    // -------------------------------------------------------------------------

    _setupBossFireBreath() {
        if (!this.sceneObject) {
            return;
        }

        this.dragonFire?.dispose?.();
        this.dragonFire = null;

        const fallbackMouthOffset = { x: 2.1, y: 1.15, z: 1.65 };
        const mouthObject = this._findMouthObject();

        // Build combat sub-config from the boss fire config so hit radius etc. are tunable.
        const bfc = this._bossFireConfig;
        const combatConfig = {
            fireballHitRadius: Number.isFinite(CONFIG.DRAGON_FIRE_COMBAT?.fireballHitRadius)
                ? CONFIG.DRAGON_FIRE_COMBAT.fireballHitRadius : 0.9,
            fireballImpactParticleCount: Number.isFinite(CONFIG.DRAGON_FIRE_COMBAT?.fireballImpactParticleCount)
                ? CONFIG.DRAGON_FIRE_COMBAT.fireballImpactParticleCount : 8,
            fireballImpactDuration: Number.isFinite(CONFIG.DRAGON_FIRE_COMBAT?.fireballImpactDuration)
                ? CONFIG.DRAGON_FIRE_COMBAT.fireballImpactDuration : 0.25,
            fireballImpactScale: Number.isFinite(CONFIG.DRAGON_FIRE_COMBAT?.fireballImpactScale)
                ? CONFIG.DRAGON_FIRE_COMBAT.fireballImpactScale : 0.5,
            fireballImpactSpeedMin: Number.isFinite(CONFIG.DRAGON_FIRE_COMBAT?.fireballImpactSpeedMin)
                ? CONFIG.DRAGON_FIRE_COMBAT.fireballImpactSpeedMin : 4.5,
            fireballImpactSpeedMax: Number.isFinite(CONFIG.DRAGON_FIRE_COMBAT?.fireballImpactSpeedMax)
                ? CONFIG.DRAGON_FIRE_COMBAT.fireballImpactSpeedMax : 10.5,
            flameHitboxLength: Number.isFinite(CONFIG.DRAGON_FIRE_COMBAT?.flameHitboxLength)
                ? CONFIG.DRAGON_FIRE_COMBAT.flameHitboxLength : 9,
            flameHitboxWidth: Number.isFinite(CONFIG.DRAGON_FIRE_COMBAT?.flameHitboxWidth)
                ? CONFIG.DRAGON_FIRE_COMBAT.flameHitboxWidth : 2.4,
            flameHitboxForwardOffset: Number.isFinite(CONFIG.DRAGON_FIRE_COMBAT?.flameHitboxForwardOffset)
                ? CONFIG.DRAGON_FIRE_COMBAT.flameHitboxForwardOffset : 0.8,
        };

        const renderOrder = this.container?.renderOrder > 0
            ? this.container.renderOrder
            : (this.sceneObject?.renderOrder > 0 ? this.sceneObject.renderOrder : 500);

        this.dragonFire = new DragonFireBreath(
            this.scene,
            this.sceneObject,
            mouthObject || fallbackMouthOffset,
            './gfx/fire.webp',
            {
                renderOrder,
                mouthOffset: fallbackMouthOffset,
                combat: combatConfig,
                fireball: {
                    speed: bfc.fireballSpeed,
                    maxDistance: bfc.fireballRange,
                    fadeStartRatio: 0.85,
                },
                mouth: {
                    jawInvert: true,
                    headInvert: false,
                    continuousAngleDeg: 25,
                    burstAngleDeg: 20,
                    jawAngleMultiplier: 2.0,
                },
            },
            null // no LoadingManager — texture is already cached by the player
        );

        this.dragonFire.setFacingDirection(-this.getFacingDirection());

        this._fireRenderOrderApplied = false;

        // Log bone lookup result so we know if jaw/head bones were found.
        if (this._bossFireConfig?.debug) {
            console.log('[BossDragon] jawBone:', this.dragonFire.jawBone?.name ?? 'NOT FOUND',
                        '| headBone:', this.dragonFire.headBone?.name ?? 'NOT FOUND');
        }
    }

    // Finds the best mouth/jaw node in the loaded GLB — same scoring as Player.findDragonMouthObject().
    _findMouthObject() {
        if (!this.sceneObject) {
            return null;
        }

        const candidates = [];
        this.sceneObject.traverse((child) => {
            if (!child?.isObject3D) return;
            const n = (child.name || '').toLowerCase();
            if (!n) return;
            let score = 0;
            if (n.includes('mouth'))  score += 100;
            if (n.includes('jaw'))    score += 70;
            if (n.includes('snout'))  score += 58;
            if (n.includes('muzzle')) score += 55;
            if (n.includes('head'))   score += 30;
            if (n.includes('upper'))  score += 4;
            if (n.includes('end'))    score += 3;
            if (n.includes('ik'))     score -= 20;
            if (n.includes('target')) score -= 25;
            if (score > 0) candidates.push({ child, score });
        });

        if (!candidates.length) return null;
        candidates.sort((a, b) => b.score - a.score);
        return candidates[0].child;
    }

    // -------------------------------------------------------------------------
    // Player dragon reference
    // -------------------------------------------------------------------------

    setPlayerDragon(player) {
        this._playerDragon = player;
    }

    // -------------------------------------------------------------------------
    // Update — called each frame by LevelObjectManager
    // -------------------------------------------------------------------------

    update(delta, level, dragonTarget, allObjects) {
        this.dragonFire?.beforeAnimationUpdate?.();
        super.update(delta, level, dragonTarget, allObjects);

        // Accept dragonTarget as the player if not explicitly set.
        if (!this._playerDragon && dragonTarget) {
            this._playerDragon = dragonTarget;
        }

        if (!this.dragonFire || !delta || delta <= 0) {
            return;
        }

        const dt = Math.min(delta, 1 / 15);

        // Keep fire system facing direction in sync with the bossdragon.
        // The bossdragon GLB's native forward is -X when facingDirection=1, so we negate
        // before passing to DragonFireBreath which treats facingDirection=1 as +X forward.
        this.dragonFire.setFacingDirection(-this.getFacingDirection());

        if (this.timelineAnimationControlled || this.container?.visible === false) {
            // Under timeline control, or invisible: suppress all AI (fire attacks, guard pose).
            // Still tick fire visuals so the mouth/head bone stays driven by the animation.
            this._stopBossFire();
            this._guardBlendActive = false;
            // Clear the AI-written override so DragonFireBreath uses its own facing-based
            // direction logic (driven by setFacingDirection above), unless the timeline has
            // already set an explicit flameDirectionOverride via the fireAngle keyframe.
            if (!this._timelineFlameDirectionOverride) {
                this.dragonFire.flameDirectionOverride = null;
            }
            this.dragonFire.update(dt);
            this.dragonFire.anchorPosition.z = this.container?.position?.z ?? 0;
            this.dragonFire.updateMouth(dt);
            this._updateFireTimers(dt);
            return;
        }

        // Run the boss fire AI — stores raw aim dir but does not yet apply override.
        this._updateBossFireAI(dt);

        // Guard animation blend — lerps weights toward the raw aim angle.
        // Must run before we derive the smoothed fire direction below.
        this._updateGuardBlend(dt);

        // Derive fire direction from the blended animation angle so the fireball
        // trajectory matches where the head is actually pointing each frame.
        if (!this.dragonFire.flameDirectionOverride) {
            this.dragonFire.flameDirectionOverride = new THREE.Vector3();
        }
        this.dragonFire.flameDirectionOverride.set(
            this._fireAimDirX,
            this._getBlendedAimDirY(),
            0
        );

        // Tick fire system — _updateMouthPoseState advances mouthOpenCurrent toward target.
        this.dragonFire.update(dt);

        // Clamp anchor and all active fireball Z to the gameplay plane so sprites depth-sort correctly.
        const gameZ = this.container?.position?.z ?? 0;
        this.dragonFire.anchorPosition.z = gameZ;
        for (const fb of this.dragonFire.activeFireballs) {
            fb.position.z = gameZ;
            fb.coreSprite.position.z = gameZ;
            fb.glowSprite.position.z = gameZ;
            for (const frag of fb.fragments) {
                frag.sprite.position.z = gameZ;
            }
        }

        // Apply bone rotation after mixer AND after _updateMouthPoseState have both run.
        this.dragonFire.updateMouth(dt);

        // Advance cooldown timers.
        this._updateFireTimers(dt);

        // Debug vis.
        if (CONFIG.LEVEL_OBJECTS?.debugRenderMatterPhysics) {
            this._updateDebugLines();
        }
    }

    // -------------------------------------------------------------------------
    // Fire AI — runs every frame
    // -------------------------------------------------------------------------

    _updateBossFireAI(dt) {
        const bfc = this._bossFireConfig;
        if (!bfc?.enabled) {
            this._stopBossFire();
            return;
        }

        const player = this._playerDragon;
        if (!player || player.isDead?.() === true) {
            this._stopBossFire();
            this._guardBlendActive = false;
            return;
        }

        // ── CHEAP POSITION-TO-POSITION RANGE CHECK ───────────────────────────
        // This is intentionally just bossdragon.position vs playerDragon.position.
        // No bones, no hitboxes, no raycasts until this passes.
        const bossPos   = this.container.position;
        const playerPos = player.position;
        if (!bossPos || !playerPos) {
            this._stopBossFire();
            return;
        }

        const dx = playerPos.x - bossPos.x;
        const dy = playerPos.y - bossPos.y;
        const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);

        if (distanceToPlayer > bfc.fireballRange) {
            // Player is outside max range — skip ALL fire logic, exit guard pose.
            this._stopBossFire();
            this._guardBlendActive = false;
            if (bfc.debug) {
                console.log('[BossDragon] fire decision', {
                    distanceToPlayer: distanceToPlayer.toFixed(2),
                    inFireballRange: false,
                    inFlameRange: false,
                    inCone: false,
                    attackType: 'none',
                });
            }
            return;
        }

        // Player is in range — enter/maintain guard pose.
        this._guardBlendActive = true;

        // ── FACING / CONE CHECK (only runs after range check passes) ─────────
        // Compute aim vector from the mouth (now that range justifies bone access).
        const targetInfo = this._computeTargetInfo(player, bfc);

        // Feed aim angle to guard blend so the up/down tilt tracks the player.
        this._guardAimAngleDeg = targetInfo.aimAngleDeg ?? 0;

        if (!targetInfo.inCone) {
            this._stopBossFire();
            if (bfc.debug) {
                console.log('[BossDragon] fire decision', {
                    distanceToPlayer: distanceToPlayer.toFixed(2),
                    inFireballRange: true,
                    inFlameRange: distanceToPlayer <= bfc.flameRange,
                    inCone: false,
                    attackType: 'none',
                });
            }
            return;
        }

        // ── ATTACK SELECTION ─────────────────────────────────────────────────
        const inFlameRange    = distanceToPlayer <= bfc.flameRange;
        const attackType      = inFlameRange ? 'flame' : 'fireball';

        if (bfc.debug) {
            console.log('[BossDragon] fire decision', {
                distanceToPlayer: distanceToPlayer.toFixed(2),
                inFireballRange: true,
                inFlameRange,
                inCone: true,
                attackType,
                aimAngleDeg: (targetInfo.aimAngleDeg ?? 0).toFixed(1),
                bossFireState: this._bossFireState,
            });
        }

        if (inFlameRange) {
            this._runFlameAttack(dt, targetInfo, bfc);
        } else {
            this._runFireballAttack(dt, targetInfo, bfc);
        }
    }

    // ── Compute aim vector from mouth to player, check facing + angle cone ──

    _computeTargetInfo(player, bfc) {
        // Boss world position (container = physics anchor).
        const bossPos = this.container.position;

        // Use mouth/fire anchor from DragonFireBreath if available.
        // This is only reached AFTER the cheap range check passes.
        let originX = bossPos.x;
        let originY = bossPos.y;
        if (this.dragonFire?.anchorPosition) {
            // Trigger an anchor update so the position is current.
            // _updateEmitterAnchor is called inside dragonFire.update() anyway, but
            // we need it here before update() to aim correctly on this frame.
            this.dragonFire._updateEmitterAnchor?.();
            originX = this.dragonFire.anchorPosition.x;
            originY = this.dragonFire.anchorPosition.y;
        }

        const playerX = player.position.x;
        const playerY = player.position.y;

        const aimDx = playerX - originX;
        const aimDy = playerY - originY;
        const aimLen = Math.sqrt(aimDx * aimDx + aimDy * aimDy);

        if (aimLen < 0.001) {
            return { inCone: false, aimDirX: 1, aimDirY: 0, aimAngleDeg: 0 };
        }

        const aimNX = aimDx / aimLen;
        const aimNY = aimDy / aimLen;

        // Angle from horizontal in degrees (positive = up).
        const aimAngleDeg = Math.atan2(aimDy, Math.abs(aimDx)) * (180 / Math.PI);

        // ── Facing check ──
        // getFacingYawOffset returns Math.PI when currentFacingDirection < 0, meaning the model
        // is rotated 180°. The bossdragon GLB's native forward (facingDirection = 1, no yaw flip)
        // points in the -X direction, so the effective world-space forward is:
        //   facingDirection =  1 → world forward = -X
        //   facingDirection = -1 → world forward = +X  (model rotated 180°)
        // Negate to convert from model-native to world-X sign.
        const facing = this.getFacingDirection() >= 0 ? -1 : 1;
        if (aimDx * facing <= 0) {
            // Player is behind or directly beside the bossdragon — no fire.
            return { inCone: false, aimDirX: aimNX, aimDirY: aimNY, aimAngleDeg };
        }

        // ── Angle limit check ──
        if (aimAngleDeg > bfc.maxAimAngleUp) {
            // Target is too far above.
            return { inCone: false, aimDirX: aimNX, aimDirY: aimNY, aimAngleDeg };
        }
        if (aimAngleDeg < -bfc.maxAimAngleDown) {
            // Target is too far below.
            return { inCone: false, aimDirX: aimNX, aimDirY: aimNY, aimAngleDeg };
        }

        return { inCone: true, aimDirX: aimNX, aimDirY: aimNY, aimAngleDeg };
    }

    // ── Flame attack ─────────────────────────────────────────────────────────

    _runFlameAttack(dt, targetInfo, bfc) {
        // Switch away from fireball state cleanly.
        if (this._bossFireState === BOSS_FIRE_STATE.FIREBALL) {
            this._bossFireState = BOSS_FIRE_STATE.IDLE;
        }

        // Respect flame cooldown between bursts.
        if (this._bossFireState === BOSS_FIRE_STATE.FLAME_COOLDOWN) {
            return; // Cooldown ticks in _updateFireTimers.
        }

        if (this._bossFireState === BOSS_FIRE_STATE.IDLE) {
            // Start a new flame burst.
            this._bossFireState = BOSS_FIRE_STATE.FLAME;
            this._flameBurstTimer = bfc.flameBurstDuration;
            this.dragonFire.startContinuousFire();
            this.audioManager?.play?.('flameStart', { volume: 0.8 });
            this.audioManager?.startLoop?.('flameLoop', { volume: 0.55 });
        }

        // Flame is active — steer direction toward the player.
        if (this._bossFireState === BOSS_FIRE_STATE.FLAME) {
            this._fireAimDirX = targetInfo.aimDirX;
            this._fireAimDirY = targetInfo.aimDirY;

            if (bfc.mouthOpenWhileFiring) {
                this.dragonFire.mouthOpenTarget = this.dragonFire.mouthContinuousOpen;
            }

            this._flameBurstTimer -= dt;
            if (this._flameBurstTimer <= 0) {
                // Burst ended — go to cooldown.
                this.dragonFire.stopFire();
                this.audioManager?.stopLoop?.('flameLoop');
                this.audioManager?.play?.('flameEnd', { volume: 0.7 });
                this._bossFireState = BOSS_FIRE_STATE.FLAME_COOLDOWN;
                this._flameCooldownTimer = bfc.flameCooldown;
            }
        }
    }

    // ── Fireball attack ───────────────────────────────────────────────────────

    _runFireballAttack(dt, targetInfo, bfc) {
        // Switch away from flame state cleanly.
        if (this._bossFireState === BOSS_FIRE_STATE.FLAME ||
            this._bossFireState === BOSS_FIRE_STATE.FLAME_COOLDOWN) {
            this.dragonFire.stopFire();
            this.audioManager?.stopLoop?.('flameLoop');
            this._bossFireState = BOSS_FIRE_STATE.IDLE;
            this._flameBurstTimer = 0;
            this._flameCooldownTimer = 0;
        }

        this._bossFireState = BOSS_FIRE_STATE.FIREBALL;

        if (this._fireballCooldownTimer > 0) {
            // During cooldown, only close the mouth once the brief open timer has expired.
            if (bfc.mouthOpenWhileFiring && this._fireballMouthOpenTimer <= 0) {
                this.dragonFire.mouthOpenTarget = this.dragonFire.mouthIdleOpen;
            }
            return;
        }

        this._fireAimDirX = targetInfo.aimDirX;
        this._fireAimDirY = targetInfo.aimDirY;

        if (bfc.mouthOpenWhileFiring) {
            this.dragonFire.mouthOpenTarget = this.dragonFire.mouthBurstOpen;
            this._fireballMouthOpenTimer = 0.85;
        }
        this.dragonFire._updateEmitterAnchor?.();

        // No actual velocity inheritance — pass zero so the fireball speed is pure aim direction.
        this.dragonFire.spawnFireball(_tmpVec3Zero);

        this._fireballCooldownTimer = bfc.fireballCooldown;
    }

    // ── Stop all boss fire ────────────────────────────────────────────────────

    _stopBossFire() {
        if (this._bossFireState !== BOSS_FIRE_STATE.IDLE &&
            this._bossFireState !== BOSS_FIRE_STATE.FLAME_COOLDOWN) {
            this.dragonFire?.stopFire?.();
        }
        this._bossFireState = BOSS_FIRE_STATE.IDLE;
        this._flameBurstTimer = 0;
    }

    // ── Advance cooldown timers ───────────────────────────────────────────────

    _updateFireTimers(dt) {
        if (this._fireballCooldownTimer > 0) {
            this._fireballCooldownTimer = Math.max(0, this._fireballCooldownTimer - dt);
        }

        if (this._fireballMouthOpenTimer > 0) {
            this._fireballMouthOpenTimer = Math.max(0, this._fireballMouthOpenTimer - dt);
            if (this._fireballMouthOpenTimer <= 0 && this._bossFireState !== BOSS_FIRE_STATE.FLAME) {
                this.dragonFire.mouthOpenTarget = this.dragonFire.mouthIdleOpen;
            }
        }

        if (this._bossFireState === BOSS_FIRE_STATE.FLAME_COOLDOWN) {
            this._flameCooldownTimer = Math.max(0, this._flameCooldownTimer - dt);
            if (this._flameCooldownTimer <= 0) {
                this._bossFireState = BOSS_FIRE_STATE.IDLE;
            }
        }
    }

    // -------------------------------------------------------------------------
    // Guard animation blend
    // -------------------------------------------------------------------------

    // Returns the Y component of the fire direction derived from the current blended
    // animation weights, so the fireball trajectory matches where the head is pointing.
    _getBlendedAimDirY() {
        const bfc = this._bossFireConfig;
        const upWeight   = this._guardBlendWeights.guardUp;
        const downWeight = this._guardBlendWeights.guardDown;
        const maxUp      = Math.max(bfc?.maxAimAngleUp   ?? 45, 0.1);
        const maxDown    = Math.max(bfc?.maxAimAngleDown ?? 35, 0.1);
        const blendedAngleDeg = upWeight * maxUp - downWeight * maxDown;
        const blendedAngleRad = blendedAngleDeg * (Math.PI / 180);
        return Math.sin(blendedAngleRad);
    }

    _updateGuardBlend(dt) {
        const bfc = this._bossFireConfig;
        const blendSpeed = Number.isFinite(bfc?.guardBlendSpeed) ? bfc.guardBlendSpeed : 4;

        const guardAction     = this.animationClipActions.get('guard-loop')
                             ?? this.animationClipActionsNormalized?.get('guard-loop')
                             ?? null;
        const guardUpAction   = this.animationClipActions.get('guard_up-loop')
                             ?? this.animationClipActionsNormalized?.get('guard_up-loop')
                             ?? null;
        const guardDownAction = this.animationClipActions.get('guard_down-loop')
                             ?? this.animationClipActionsNormalized?.get('guard_down-loop')
                             ?? null;

        if (!guardAction) {
            if (bfc?.debug) {
                this._guardDebugTick = ((this._guardDebugTick ?? 0) + 1) % 60;
                if (this._guardDebugTick === 0) {
                    console.log('[BossDragon] guard-loop not found. Available clips:', [...this.animationClipActions.keys()]);
                }
            }
            return;
        }

        if (bfc?.debug) {
            this._guardDebugTick = ((this._guardDebugTick ?? 0) + 1) % 60;
            if (this._guardDebugTick === 0) {
                const playingActions = [...this.animationClipActions.entries()]
                    .filter(([, action]) => action.isRunning() && action.getEffectiveWeight() > 0.001)
                    .map(([name, action]) => `${name}(w=${action.getEffectiveWeight().toFixed(2)})`);
                console.log(`[BossDragon] animations | aim=${this._guardAimAngleDeg.toFixed(1)}° mode=${this._guardBlendMode} | playing: ${playingActions.join(', ') || 'none'}`);
            }
        }

        if (!this._guardBlendActive) {
            // Fade out — stop and zero weights when guard loop weight reaches zero.
            const alpha = Math.min(1, blendSpeed * dt);
            this._guardBlendWeights.guard     = THREE.MathUtils.lerp(this._guardBlendWeights.guard,     0, alpha);
            this._guardBlendWeights.guardUp   = THREE.MathUtils.lerp(this._guardBlendWeights.guardUp,   0, alpha);
            this._guardBlendWeights.guardDown = THREE.MathUtils.lerp(this._guardBlendWeights.guardDown, 0, alpha);

            guardAction.setEffectiveWeight(this._guardBlendWeights.guard);
            if (guardUpAction)   guardUpAction.setEffectiveWeight(this._guardBlendWeights.guardUp);
            if (guardDownAction) guardDownAction.setEffectiveWeight(this._guardBlendWeights.guardDown);

            if (this._guardBlendWeights.guard < 0.01) {
                guardAction.stop();
                guardUpAction?.stop();
                guardDownAction?.stop();
                this._guardBlendMode = 'neutral';
                this._guardBlendPendingMode = null;
            }
            return;
        }

        // Ensure all guard animations are running.
        if (!guardAction.isRunning()) {
            // Stop every other action so the default idle (gander, etc.) doesn't fight the blend.
            for (const [, action] of this.animationClipActions) {
                if (action !== guardAction && action !== guardUpAction && action !== guardDownAction) {
                    action.stop();
                }
            }
            guardAction.enabled = true;
            guardAction.reset();
            guardAction.setLoop(THREE.LoopRepeat, Infinity);
            guardAction.clampWhenFinished = false;
            guardAction.setEffectiveTimeScale(1);
            guardAction.play();
        }
        if (guardUpAction && !guardUpAction.isRunning()) {
            guardUpAction.enabled = true;
            guardUpAction.reset();
            guardUpAction.setLoop(THREE.LoopRepeat, Infinity);
            guardUpAction.clampWhenFinished = false;
            guardUpAction.setEffectiveTimeScale(1);
            guardUpAction.time = guardAction.time;
            guardUpAction.play();
        }
        if (guardDownAction && !guardDownAction.isRunning()) {
            guardDownAction.enabled = true;
            guardDownAction.reset();
            guardDownAction.setLoop(THREE.LoopRepeat, Infinity);
            guardDownAction.clampWhenFinished = false;
            guardDownAction.setEffectiveTimeScale(1);
            guardDownAction.time = guardAction.time;
            guardDownAction.play();
        }

        // Sync up/down to guard-loop time.
        if (guardUpAction?.isRunning())   guardUpAction.time   = guardAction.time;
        if (guardDownAction?.isRunning()) guardDownAction.time = guardAction.time;

        // Determine desired blend mode from aim angle.
        const aimAngle = this._guardAimAngleDeg;
        // Mode switching uses a small dead zone to avoid flickering right at 0°.
        // Blend strength is a continuous linear map from 0° → full directional, independent of dead zone.
        const modeSwitchDeadZone = 3;
        const desiredMode = aimAngle >= modeSwitchDeadZone ? 'up'
                          : aimAngle <= -modeSwitchDeadZone ? 'down'
                          : 'neutral';

        // Same neutral pass-through state machine as the player hover blend.
        if (desiredMode === 'neutral') {
            this._guardBlendMode = 'neutral';
            this._guardBlendPendingMode = null;
        } else if (this._guardBlendMode === 'neutral') {
            this._guardBlendMode = desiredMode;
            this._guardBlendPendingMode = null;
        } else if (this._guardBlendMode !== desiredMode) {
            this._guardBlendMode = 'neutral';
            this._guardBlendPendingMode = desiredMode;
        }

        const switchThreshold = 0.12;
        if (
            this._guardBlendMode === 'neutral' &&
            this._guardBlendPendingMode &&
            this._guardBlendWeights.guardUp   <= switchThreshold &&
            this._guardBlendWeights.guardDown <= switchThreshold
        ) {
            this._guardBlendMode = this._guardBlendPendingMode;
            this._guardBlendPendingMode = null;
        }

        // Blend strength: continuous 0→1 mapped over the full aim range.
        // At 0° aim the directional animation has zero weight; at maxAimAngleUp/Down it's full.
        const maxAngle = this._guardBlendMode === 'up'
            ? Math.max(bfc?.maxAimAngleUp   ?? 45, 0.1)
            : Math.max(bfc?.maxAimAngleDown ?? 35, 0.1);
        const directionalStrength = THREE.MathUtils.clamp(Math.abs(aimAngle) / maxAngle, 0, 1);

        let targetGuard     = 1;
        let targetGuardUp   = 0;
        let targetGuardDown = 0;
        if (this._guardBlendMode === 'up') {
            targetGuardUp = directionalStrength;
            targetGuard   = 1 - targetGuardUp;
        } else if (this._guardBlendMode === 'down') {
            targetGuardDown = directionalStrength;
            targetGuard     = 1 - targetGuardDown;
        }

        const alpha = Math.min(1, blendSpeed * dt);
        this._guardBlendWeights.guard     = THREE.MathUtils.lerp(this._guardBlendWeights.guard,     targetGuard,     alpha);
        this._guardBlendWeights.guardUp   = THREE.MathUtils.lerp(this._guardBlendWeights.guardUp,   targetGuardUp,   alpha);
        this._guardBlendWeights.guardDown = THREE.MathUtils.lerp(this._guardBlendWeights.guardDown, targetGuardDown, alpha);

        guardAction.setEffectiveWeight(this._guardBlendWeights.guard);
        if (guardUpAction)   guardUpAction.setEffectiveWeight(this._guardBlendWeights.guardUp);
        if (guardDownAction) guardDownAction.setEffectiveWeight(this._guardBlendWeights.guardDown);
    }

    // -------------------------------------------------------------------------
    // Damage interface — mirrors Player fire interface so LevelObjectManager
    // can call applyBossFireDamage(bossdragonObject, player, delta).
    // -------------------------------------------------------------------------

    getBossFireballDamage() {
        return Math.max(0, this._bossFireConfig?.fireballDamage ?? 20);
    }

    getBossFlameDamagePerSecond() {
        return Math.max(0, this._bossFireConfig?.flameDamagePerSecond ?? 15);
    }

    shouldBossDespawnFireballOnHit() {
        return CONFIG.DRAGON_FIRE_COMBAT?.despawnFireballOnHit !== false;
    }

    getBossActiveFireballsForDamage() {
        return this.dragonFire?.getActiveFireballsForCollision?.() || [];
    }

    consumeBossFireballById(id, options = {}) {
        return this.dragonFire?.consumeFireballById?.(id, options) === true;
    }

    getBossContinuousFlameDamageRect() {
        return this.dragonFire?.getContinuousFlameHitRect?.() || null;
    }

    // -------------------------------------------------------------------------
    // Dispose
    // -------------------------------------------------------------------------

    dispose() {
        this.dragonFire?.dispose?.();
        this.dragonFire = null;
        this._disposeDebugLines();
        super.dispose?.();
    }

    // -------------------------------------------------------------------------
    // Debug visualization
    // -------------------------------------------------------------------------

    _setupDebugLines() {
        if (!CONFIG.LEVEL_OBJECTS?.debugRenderMatterPhysics) {
            return;
        }

        const makeCircle = (radius, segments, color, z) => {
            const pts = [];
            for (let i = 0; i <= segments; i++) {
                const a = (i / segments) * Math.PI * 2;
                pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, z));
            }
            const geo = new THREE.BufferGeometry().setFromPoints(pts);
            const mat = new THREE.LineBasicMaterial({ color, depthTest: false, depthWrite: false, transparent: true, opacity: 0.6, toneMapped: false });
            const line = new THREE.Line(geo, mat);
            line.renderOrder = 9998;
            line.frustumCulled = false;
            return line;
        };

        const bfc = this._bossFireConfig;
        const z = (this.container?.position?.z ?? 0) + 0.5;

        this._debugLines = {
            fireballCircle: makeCircle(bfc?.fireballRange ?? 30, 64, DEBUG_COLOR_FIREBALL_RANGE, z),
            flameCircle:    makeCircle(bfc?.flameRange    ?? 10, 32, DEBUG_COLOR_FLAME_RANGE, z),
            aimLine: (() => {
                const geo = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0, 0, z),
                    new THREE.Vector3(1, 0, z),
                ]);
                const mat = new THREE.LineBasicMaterial({ color: DEBUG_COLOR_AIM_VECTOR, depthTest: false, depthWrite: false, transparent: true, toneMapped: false });
                const line = new THREE.Line(geo, mat);
                line.renderOrder = 9999;
                line.frustumCulled = false;
                return line;
            })(),
        };

        this.scene.add(this._debugLines.fireballCircle);
        this.scene.add(this._debugLines.flameCircle);
        this.scene.add(this._debugLines.aimLine);
    }

    _updateDebugLines() {
        if (!this._debugLines) return;
        const pos = this.container.position;
        const z = pos.z + 0.5;

        this._debugLines.fireballCircle.position.set(pos.x, pos.y, z);
        this._debugLines.flameCircle.position.set(pos.x, pos.y, z);

        // Aim line: draw from boss pos toward player (if in range).
        const player = this._playerDragon;
        if (player) {
            const dx = player.position.x - pos.x;
            const dy = player.position.y - pos.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len > 0.001) {
                const pts = [
                    new THREE.Vector3(pos.x, pos.y, z),
                    new THREE.Vector3(pos.x + dx, pos.y + dy, z),
                ];
                this._debugLines.aimLine.geometry.dispose();
                this._debugLines.aimLine.geometry = new THREE.BufferGeometry().setFromPoints(pts);
            }
        }
    }

    _disposeDebugLines() {
        if (!this._debugLines) return;
        for (const line of Object.values(this._debugLines)) {
            line.geometry?.dispose?.();
            line.material?.dispose?.();
            line.removeFromParent?.();
        }
        this._debugLines = null;
    }
}
