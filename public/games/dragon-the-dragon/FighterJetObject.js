import * as THREE from 'three';
import { PlaneObject } from './PlaneObject.js';
import { LEVEL_OBJECT_STATES } from './LevelObject.js';
import { loaderLoadAsyncWithRetry } from './fetchWithRetry.js';
import { CONFIG } from './config.js';

// Fighter jet AI states
const FJ_STATE = Object.freeze({
    PATROL:  'patrol',   // wandering; dragon not detected
    ATTACK:  'attack',   // pursuing dragon and attempting to shoot
});

const DEG_TO_RAD = Math.PI / 180;

const TMP_BULLET_STEP = new THREE.Vector3();
const TMP_BULLET_WORLD = new THREE.Vector3();

// Returns the signed shortest angular difference from `from` to `to` (radians).
function shortestAngleDelta(from, to) {
    let d = (to - from) % (Math.PI * 2);
    if (d >  Math.PI) d -= Math.PI * 2;
    if (d < -Math.PI) d += Math.PI * 2;
    return d;
}

/**
 * FighterJetObject — a flying attacker that reuses the PlaneObject/FlyingAIController
 * movement stack while adding an attack-mode state machine and a self-contained bullet
 * pool that mirrors the ground-turret (TankObject) projectile system.
 *
 * Movement differences from plane:
 *   - behavior: 'attack' — steers toward the dragon instead of fleeing it.
 *   - Does NOT intentionally crash into terrain; terrain avoidance stays active even
 *     when pursuing the dragon (the FlyingAIController handles this automatically).
 *   - Scales all speeds by attackSpeedMultiplier when pursuing; patrol uses base speeds.
 *
 * Bullet shooting (reuses turret logic):
 *   - Same THREE.Sprite pool, position/direction/life/damage structure as TankObject.
 *   - getActiveBulletsForCollision() / consumeBulletById() match the interface expected
 *     by LevelObjectManager's bullet–dragon collision loop, so no separate pipeline needed.
 *
 * Terrain avoidance during attack:
 *   - FlyingAIController._applyTerrainAvoidanceSteer() runs every frame regardless of
 *     behavior mode. Passing the dragon position as the attack target instead of a flee
 *     target means the plane steers toward the dragon but terrain pushes it off course
 *     before a collision — the natural "flying around obstacles" feel.
 *
 * Extending for future flying attackers:
 *   - Add a new behavior class that extends PlaneObject.
 *   - Call flyingAI.setAttackTarget(pos) each frame to steer toward any target.
 *   - Mix in the _weapon block from config and use _fireBullet() / _updateBullets().
 */
export class FighterJetObject extends PlaneObject {
    constructor(options) {
        super(options);

        // ── weapon config (mirrors TankObject.getTankCombatConfig) ──────────────
        const wc = this.config.weapon || {};
        this._weapon = {
            enabled:              wc.enabled !== false,
            fireRange:            Number.isFinite(wc.fireRange)            ? wc.fireRange            : 28,
            fireCooldown:         Number.isFinite(wc.fireCooldown)         ? wc.fireCooldown         : 0.4,
            bulletSpeed:          Number.isFinite(wc.bulletSpeed)          ? wc.bulletSpeed          : 18,
            bulletDamageToDragon: Number.isFinite(wc.bulletDamageToDragon) ? Math.max(0, wc.bulletDamageToDragon) : 5,
            bulletLifetime:       Number.isFinite(wc.bulletLifetime)       ? wc.bulletLifetime       : 3,
            bulletScale:          Number.isFinite(wc.bulletScale)          ? wc.bulletScale          : 0.4,
            bulletHitRadius:      Number.isFinite(wc.bulletHitRadius)      ? Math.max(0, wc.bulletHitRadius) : 0.4,
            bulletTexturePath:    wc.bulletTexturePath || './gfx/levels/bullet.webp',
            aimPrediction:        wc.aimPrediction !== false,
            aimPredictionStrength: Number.isFinite(wc.aimPredictionStrength) ? wc.aimPredictionStrength : 0.5,
            maxFireAngle:         Number.isFinite(wc.maxFireAngle)         ? wc.maxFireAngle         : 25,
        };

        // ── flyAI attack-mode ranges (read from config.flyAI) ──────────────────
        const fa = this.config.flyAI || {};
        this._detectRange = Number.isFinite(fa.dragonDetectRange) ? fa.dragonDetectRange : 40;
        this._attackRange = Number.isFinite(fa.dragonAttackRange) ? fa.dragonAttackRange : 28;
        this._loseRange   = Number.isFinite(fa.dragonLoseRange)   ? fa.dragonLoseRange   : 55;

        // ── state machine ────────────────────────────────────────────────────────
        this._fjState = FJ_STATE.PATROL;

        // ── bullet pool (same structure as TankObject) ───────────────────────────
        this._bulletTexture  = null;
        this._bulletMaterial = null;
        this._activeBullets  = [];
        this._freeBullets    = [];
        this._nextBulletId   = 1;
        this._fireCooldownTimer = 0;

        // Projectile root added to the scene so bullets live in world space.
        this._projectileRoot = new THREE.Group();
        this._projectileRoot.name = `fighterjet:${this.id}:projectiles`;
        this.scene?.add(this._projectileRoot);

        // Render order / depth matching existing projectile bands.
        this._projectileBandDepth       = null;
        this._projectileBandRenderOrder = 1200;

        // Cache last known dragon velocity for aim prediction.
        this._dragonPrevPos  = null;
        this._dragonVelocity = new THREE.Vector2();
    }

    // ── load ───────────────────────────────────────────────────────────────────

    async load() {
        await super.load();
        await this._loadBulletVisuals();
        return this;
    }

    async _loadBulletVisuals() {
        if (!this._weapon.bulletTexturePath) return;
        this._bulletTexture = await loaderLoadAsyncWithRetry(
            this.textureLoader,
            this._weapon.bulletTexturePath
        );
        this._bulletTexture.colorSpace = THREE.SRGBColorSpace;
        this._bulletMaterial = new THREE.SpriteMaterial({
            map:         this._bulletTexture,
            transparent: true,
            depthWrite:  false,
            toneMapped:  false
        });
    }

    // ── destroy ────────────────────────────────────────────────────────────────

    destroy() {
        if (this.isDestroyed) return;
        // Stop all in-flight bullets visually before the parent triggers the explosion.
        for (const b of this._activeBullets) b.sprite.visible = false;
        this._activeBullets.length = 0;
        super.destroy();
    }

    // ── update ────────────────────────────────────────────────────────────────

    update(delta, level, dragonTarget = null) {
        if (!this.loaded) return;

        this._updatePropeller(delta);
        this.updateHealthBarVisual?.();
        this.updateDestructionSequence?.(delta);

        if (this.markedForRemoval || this.isDestroyed) return;

        this.state        = LEVEL_OBJECT_STATES.IDLE;
        this.gravityEnabled = false;

        this._updateAttackStateMachine(delta, level, dragonTarget);
        this._updateBullets(delta);
    }

    // ── attack state machine ───────────────────────────────────────────────────
    // Patrol  →  detect (≤ detectRange)  →  Attack
    // Attack  →  dragon escapes (> loseRange)  →  Patrol
    // Hysteresis prevents rapid toggling at the boundary.

    _updateAttackStateMachine(delta, level, dragonTarget) {
        const dragonPos = this._getDragonPosition(dragonTarget);
        const pos       = this.container.position;

        let distToDragon = Infinity;
        if (dragonPos) {
            distToDragon = Math.hypot(dragonPos.x - pos.x, dragonPos.y - pos.y);
        }

        // ── state transitions ──
        if (this._fjState === FJ_STATE.PATROL) {
            if (dragonPos && distToDragon <= this._detectRange) {
                this._fjState = FJ_STATE.ATTACK;
                this.flyingAI.resetPatrolTarget();
                if (this.config.flyAI?.debugLogging) {
                    console.log('FighterJet AI', {
                        objectId: this.id,
                        event: 'enter attack',
                        distToDragon
                    });
                }
            }
        } else if (this._fjState === FJ_STATE.ATTACK) {
            if (!dragonPos || distToDragon > this._loseRange) {
                this._fjState = FJ_STATE.PATROL;
                this.flyingAI.resetPatrolTarget();
                if (this.config.flyAI?.debugLogging) {
                    console.log('FighterJet AI', {
                        objectId: this.id,
                        event: 'lost dragon / return to patrol',
                        distToDragon
                    });
                }
            }
        }

        // ── per-state logic ──
        if (this._fjState === FJ_STATE.ATTACK && dragonPos) {
            this._updateDragonVelocity(dragonPos, delta);
            const aimTarget = this._computeAimTarget(dragonPos, distToDragon);
            // Drive FlyingAIController to steer toward attack aim point at attack speed.
            this.flyingAI.setAttackTarget(aimTarget, true);
            this.flyingAI.update(delta, level, null); // pass null: no flee logic needed

            this._fireCooldownTimer = Math.max(0, this._fireCooldownTimer - delta);

            if (this._weapon.enabled) {
                this._tryFire(dragonPos, distToDragon, delta);
            }

            if (this.config.flyAI?.debugLogging) {
                const angleToDragon = this._getAngleToDragon(dragonPos);
                const canFire = distToDragon <= this._weapon.fireRange &&
                    Math.abs(angleToDragon) <= this._weapon.maxFireAngle * DEG_TO_RAD &&
                    this._fireCooldownTimer <= 0;
                console.log('FighterJet AI', {
                    objectId:       this.id,
                    state:          this._fjState,
                    distToDragon:   distToDragon.toFixed(2),
                    angleToDragon:  (angleToDragon * (180 / Math.PI)).toFixed(1) + '°',
                    canFire,
                    cooldown:       this._fireCooldownTimer.toFixed(2)
                });
            }
        } else {
            // Patrol: delegate fully to the base PlaneObject movement.
            this.flyingAI.update(delta, level, null);
        }
    }

    // ── dragon position / velocity ─────────────────────────────────────────────

    _getDragonPosition(dragonTarget) {
        if (!dragonTarget) return null;
        const hc = dragonTarget.getWorldCollisionCircle?.();
        if (hc && Number.isFinite(hc.centerX)) return { x: hc.centerX, y: hc.centerY };
        if (dragonTarget.getWorldPosition) {
            const tmp = new THREE.Vector3();
            dragonTarget.getWorldPosition(tmp);
            return { x: tmp.x, y: tmp.y };
        }
        return null;
    }

    _updateDragonVelocity(dragonPos, delta) {
        if (delta <= 0) return;
        if (this._dragonPrevPos) {
            this._dragonVelocity.set(
                (dragonPos.x - this._dragonPrevPos.x) / delta,
                (dragonPos.y - this._dragonPrevPos.y) / delta
            );
        }
        this._dragonPrevPos = { x: dragonPos.x, y: dragonPos.y };
    }

    // Optionally lead the aim slightly ahead of the dragon's current position.
    _computeAimTarget(dragonPos, distToDragon) {
        if (!this._weapon.aimPrediction || this._dragonVelocity.lengthSq() < 0.001) {
            return dragonPos;
        }
        // Rough time-of-flight estimate.
        const bulletSpeed = Math.max(1, this._weapon.bulletSpeed);
        const tof = distToDragon / bulletSpeed;
        const strength = this._weapon.aimPredictionStrength;
        return {
            x: dragonPos.x + this._dragonVelocity.x * tof * strength,
            y: dragonPos.y + this._dragonVelocity.y * tof * strength
        };
    }

    // ── firing ─────────────────────────────────────────────────────────────────

    _getAngleToDragon(dragonPos) {
        const pos = this.container.position;
        const dx  = dragonPos.x - pos.x;
        const dy  = dragonPos.y - pos.y;
        const toTarget = Math.atan2(dy, dx);
        return shortestAngleDelta(this.flyingAI._planeAngle, toTarget);
    }

    _tryFire(dragonPos, distToDragon, delta) {
        if (this._fireCooldownTimer > 0) return;
        if (distToDragon > this._weapon.fireRange) return;

        const angleToTarget = this._getAngleToDragon(dragonPos);
        if (Math.abs(angleToTarget) > this._weapon.maxFireAngle * DEG_TO_RAD) return;

        this._fireBullet();
        this._fireCooldownTimer = this._weapon.fireCooldown;
    }

    // Spawns a bullet at the front of the fighter jet in world space.
    // Direction matches the current flight angle — no rotating cannon required.
    // Mirrors TankObject.fireBullet() so LevelObjectManager's collision loop
    // needs no changes.
    _fireBullet() {
        const bullet = this._getBullet();
        if (!bullet) return;

        const pos   = this.container.position;
        const angle = this.flyingAI._planeAngle;

        // Muzzle offset: slightly ahead of the model centre.
        const muzzleOffset = 3;
        bullet.position.set(
            pos.x + Math.cos(angle) * muzzleOffset,
            pos.y + Math.sin(angle) * muzzleOffset,
            Number.isFinite(this._projectileBandDepth) ? this._projectileBandDepth : pos.z
        );

        bullet.direction.set(Math.cos(angle), Math.sin(angle), 0);

        if (bullet.sprite?.material) {
            bullet.sprite.material.rotation = angle;
        }

        bullet.id             = this._nextBulletId++;
        bullet.speed          = this._weapon.bulletSpeed;
        bullet.life           = this._weapon.bulletLifetime;
        bullet.radius         = this._weapon.bulletHitRadius;
        bullet.damageToDragon = this._weapon.bulletDamageToDragon;

        bullet.sprite.visible = true;
        bullet.sprite.position.copy(bullet.position);

        this._activeBullets.push(bullet);

        this.audioManager?.play?.('tankFire', {
            volume:  0.6,
            detune:  (Math.random() * 120) - 60,
            cooldown: 0.04
        });
    }

    _getBullet() {
        const bullet = this._freeBullets.pop();
        if (bullet) return bullet;
        if (!this._bulletMaterial) return null;

        const sprite = new THREE.Sprite(this._bulletMaterial.clone());
        sprite.visible = false;
        sprite.renderOrder = this._projectileBandRenderOrder;
        sprite.center.set(1, 0.5);

        const scale = Math.max(0.001, this._weapon.bulletScale);
        const image = this._bulletTexture?.image;
        const aspect = (image && Number.isFinite(image.width) && image.height > 0)
            ? image.width / image.height
            : 1;
        sprite.scale.set(scale * aspect, scale, 1);
        this._projectileRoot.add(sprite);

        return {
            id:            -1,
            sprite,
            position:      new THREE.Vector3(),
            direction:     new THREE.Vector3(1, 0, 0),
            speed:         this._weapon.bulletSpeed,
            life:          this._weapon.bulletLifetime,
            radius:        this._weapon.bulletHitRadius,
            damageToDragon: this._weapon.bulletDamageToDragon
        };
    }

    _updateBullets(delta) {
        if (!this._activeBullets.length) return;

        const rawBulletMinY = CONFIG?.LEVEL_OBJECTS?.bulletMinY;
        const bulletMinY    = (rawBulletMinY == null) ? null : Number(rawBulletMinY);
        const hasBulletMinY = Number.isFinite(bulletMinY);

        for (let i = this._activeBullets.length - 1; i >= 0; i--) {
            const bullet = this._activeBullets[i];
            bullet.life -= delta;
            if (bullet.life <= 0) {
                bullet.sprite.visible = false;
                this._activeBullets.splice(i, 1);
                this._freeBullets.push(bullet);
                continue;
            }

            TMP_BULLET_STEP.copy(bullet.direction).multiplyScalar(bullet.speed * delta);
            bullet.position.add(TMP_BULLET_STEP);
            if (Number.isFinite(this._projectileBandDepth)) {
                bullet.position.z = this._projectileBandDepth;
            }
            bullet.sprite.position.copy(bullet.position);

            if (hasBulletMinY) {
                bullet.sprite.getWorldPosition(TMP_BULLET_WORLD);
                if (TMP_BULLET_WORLD.y <= bulletMinY) {
                    bullet.sprite.visible = false;
                    this._activeBullets.splice(i, 1);
                    this._freeBullets.push(bullet);
                }
            }
        }
    }

    // ── LevelObjectManager interface (mirrors TankObject) ────────────────────
    // LevelObjectManager calls these on every object each frame to handle
    // bullet-vs-dragon collision. No changes to the manager are required.

    getActiveBulletsForCollision() {
        return this._activeBullets
            .filter((b) => b?.sprite?.visible)
            .map((b) => ({
                id:         b.id,
                x:          b.position.x,
                y:          b.position.y,
                z:          b.position.z,
                directionX: b.direction.x,
                directionY: b.direction.y,
                radius:     b.radius,
                damageToDragon: b.damageToDragon
            }));
    }

    consumeBulletById(id) {
        if (!Number.isFinite(id)) return false;
        const index = this._activeBullets.findIndex((b) => b.id === id);
        if (index < 0) return false;
        const bullet = this._activeBullets[index];
        bullet.sprite.visible = false;
        this._activeBullets.splice(index, 1);
        this._freeBullets.push(bullet);
        return true;
    }

    // Allows LevelObjectManager to assign a render-band depth/order (same API as TankObject).
    setProjectileRenderBand(band) {
        this._projectileBandDepth       = Number.isFinite(band?.depth) ? band.depth : null;
        this._projectileBandRenderOrder = Number.isFinite(band?.renderOrder) ? band.renderOrder : 1200;
        this._projectileRoot.renderOrder = this._projectileBandRenderOrder;
        for (const b of [...this._activeBullets, ...this._freeBullets]) {
            b.sprite.renderOrder = this._projectileBandRenderOrder;
            if (Number.isFinite(this._projectileBandDepth)) {
                b.position.z       = this._projectileBandDepth;
                b.sprite.position.z = this._projectileBandDepth;
            }
        }
    }
}
