import * as THREE from 'three';

const PARTICLE_TYPE = {
    FLAME: 0,
    EMBER: 1,
    SMOKE: 2
};

const DEFAULT_CONFIG = {
    maxParticles: 260,
    maxSpawnPerFrame: 42,
    mouthOffset: { x: 1.7, y: 1.0, z: 1.55 },
    // Local-space offset from the jaw pivot used for particle spawn origin.
    // X = forward from jaw, Y = up from jaw, Z = sideways from jaw.
    jawSpawnOffset: { x: 0, y: 0, z: 0 },
    mirrorMouthOffsetX: true,
    spawnForwardOffset: 0.0,
    // Preferred flame spawn offset in front of the mouth (world forward direction).
    // `spawnForwardOffset` is kept for backward compatibility.
    flameSpawnForwardOffset: 0.00,
    // Extra forward spawn distance based on dragon forward speed (optional anti-clipping bias).
    flameSpawnSpeedBias: 0.00,
    // How much world-space dragon velocity is inherited by spawned flame particles.
    inheritDragonVelocityFactor: 1.2,
    longFlameSpeedMultiplier: 5,
    longFlameLifetimeMultiplier: 3,
    longFlameLength: 4,
    longFlameEmitRateMultiplier: 4,//100.45,
    normalFlameSpeed: 1,
    normalFlameLifetime: 1,
    normalFlameEmitRate: 1,
    normalFlameLength: 1.3,
    flameLengthRampUpSpeed: 8,
    flameLengthRampDownSpeed: 5,
    baseUpwardDrift: 1.2,
    maxDelta: 1 / 30,
    burst: {
        duration: 0.12,
        immediateFlameCount: 12,
        immediateEmberCount: 7,
        immediateSmokeCount: 3,
        flameRate: 92,
        emberRate: 34,
        smokeRate: 16,
        spread: 0.22,
        speedMul: 0.92,
        sizeMul: 1.08,
        glowMul: 1.2
    },
    continuous: {
        rampDuration: 0.22,
        flameRate: 192,
        emberRate: 72,
        smokeRate: 36,
        spread: 0.46,
        speedMul: 1.14,
        sizeMul: 1.2,
        glowMul: 1.08
    },
    flame: {
        lifeMin: 0.14,
        lifeMax: 0.34,
        speedMin: 9.5,
        speedMax: 20,
        spreadY: 0.32,
        spreadZ: 0.2,
        dragMin: 2.2,
        dragMax: 3.5,
        buoyancyMin: 0.9,
        buoyancyMax: 2.4,
        sizeMin: 0.46,
        sizeMax: 1.25,
        stretchX: .5,
        stretchY: 3,
        coreChance: 0.4,
        spinMin: -1.9,
        spinMax: 1.9
    },
    ember: {
        lifeMin: 0.38,
        lifeMax: 1.82,
        speedMin: 7.5,
        speedMax: 16.5,
        spreadY: 0.66,
        spreadZ: 0.35,
        dragMin: 1.1,
        dragMax: 2.1,
        buoyancyMin: 1.8,
        buoyancyMax: 4.4,
        sizeMin: 0.08,
        sizeMax: 0.2,
        stretchX: 1.08,
        stretchY: 1.08,
        spinMin: -2.8,
        spinMax: 2.8
    },
    smoke: {
        lifeMin: 0.45,
        lifeMax: 1.08,
        speedMin: 1.2,
        speedMax: 4.8,
        spreadY: 0.92,
        spreadZ: 0.55,
        dragMin: 0.7,
        dragMax: 1.5,
        buoyancyMin: 1.7,
        buoyancyMax: 3.6,
        sizeMin: 0.28,
        sizeMax: 0.95,
        stretchX: 1.3,
        stretchY: 1.3,
        spinMin: -0.9,
        spinMax: 0.9
    },
    light: {
        color: 0xff9836,
        intensity: 2.9,
        distance: 13,
        decay: 2.25,
        flicker: 0.34,
        smoothness: 14
    },
    fireball: {
        maxProjectiles: 8,
        speed: 36,
        maxDistance: 50,
        fadeStartRatio: 0.72,
        coreSize: 2,
        glowSize: 2,
        coreOpacity: 0.9,
        glowOpacity: 0.65,
        emberTrailRate: 102,
        // Extra sprites that make each projectile feel like a clustered fire mass.
        fragmentCount: 9,
        fragmentSize: 0.64,
        fragmentOpacity: 0.72,
        fragmentOrbitRadius: 1.20,
        fragmentOrbitSpeed: 7,
        fragmentDrag: 2.6,
        fragmentCenterPull: 5,
        fragmentSwirl: 10,
        fragmentMaxRadiusMultiplier: 1.5
    },
    combat: {
        fireballHitRadius: 0.9,
        fireballImpactParticleCount: 8,
        fireballImpactDuration: 0.25,
        fireballImpactScale: 0.5,
        fireballImpactSpeedMin: 4.5,
        fireballImpactSpeedMax: 10.5,
        flameHitboxLength: 9,
        flameHitboxWidth: 2.4,
        flameHitboxForwardOffset: 0.8,
        flameSurfaceEpsilon: 0.35,
        clipFlameToStaticPolygons: false,
        blockFireInsideStaticPolygons: false,
        debugRenderFlameTerrainCollision: false
    },
    mouth: {
        jawBoneName: 'jaw',
        headBoneName: 'head',
        // Backward-compatible jaw axis key: keep `axis` support, but prefer `jawAxis`.
        axis: 'x',
        jawAxis: 'x',
        // Head usually follows the same axis; set explicitly if your rig differs.
        headAxis: 'x',
        // Backward-compatible jaw invert key: keep `invert` support, but prefer `jawInvert`.
        // For jaw: default opens in the opposite direction of head.
        invert: false,
        // Keep null by default so legacy `invert` still controls jaw direction.
        jawInvert: null,
        // For head: default rotates "up" in positive axis direction.
        headInvert: false,
        // Kept for compatibility with older configs that only used a single angle.
        openAngle: 0.85,
        // Fire pose targets:
        // short press ~40deg (40/70 normalized), long press ~70deg (full open).
        burstAngleDeg: 40,
        continuousAngleDeg: 50,
        // Jaw can be exaggerated relative to head for clearer silhouette.
        jawAngleMultiplier: 1.8,
        idleOpen: 0.02,
        burstOpen: 40 / 50,
        continuousOpen: 1,
        openSpeed: 20,
        closeSpeed: 12,
        fireOscillationAmount: 0.06,
        fireOscillationSpeed: 10,
        idleOscillationAmount: 0.01,
        idleOscillationSpeed: 2.2
    }
};

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function clamp01(v) {
    return THREE.MathUtils.clamp(v, 0, 1);
}

function easeOutCubic(t) {
    const x = clamp01(t);
    return 1 - Math.pow(1 - x, 3);
}

function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

function deepMerge(base, overrides) {
    if (!overrides) {
        return { ...base };
    }

    const output = Array.isArray(base) ? [...base] : { ...base };

    for (const [key, value] of Object.entries(overrides)) {
        if (
            value &&
            typeof value === 'object' &&
            !Array.isArray(value) &&
            output[key] &&
            typeof output[key] === 'object' &&
            !Array.isArray(output[key])
        ) {
            output[key] = deepMerge(output[key], value);
        } else {
            output[key] = value;
        }
    }

    return output;
}

// ---------------------------------------------------------------------------
// Smoke ShaderMaterial factory — normal blending with per-instance opacity
// ---------------------------------------------------------------------------
function _buildSmokeShaderMaterial(flameTexture) {
    return new THREE.ShaderMaterial({
        uniforms: { map: { value: flameTexture } },
        vertexShader: `
            attribute float instanceOpacity;
            varying vec2 vUv;
            varying float vOpacity;
            void main() {
                vUv = uv;
                vOpacity = instanceOpacity;
                gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D map;
            varying vec2 vUv;
            varying float vOpacity;
            void main() {
                vec4 tex = texture2D(map, vUv);
                gl_FragColor = vec4(tex.rgb, tex.a * vOpacity);
                if (gl_FragColor.a < 0.005) discard;
            }
        `,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.NormalBlending,
        side: THREE.DoubleSide
    });
}

export class DragonFireBreath {
    constructor(scene, dragon, mouthObjectOrOffset, flameTextureUrl, configOverrides = {}, loadingManager = null) {
        this.scene = scene;
        this.dragon = dragon;
        this.flameTextureUrl = flameTextureUrl;
        this.renderOrder = configOverrides.renderOrder ?? 0;
        this.terrainProvider = configOverrides.terrainProvider || null;

        const mergedConfig = deepMerge(DEFAULT_CONFIG, configOverrides);
        this.config = mergedConfig;

        this.facingDirection = 1;
        this.state = 'idle';
        this.burstTimeLeft = 0;
        this.continuousTime = 0;

        this.flameAccumulator = 0;
        this.emberAccumulator = 0;
        this.smokeAccumulator = 0;
        this.lightFlickerTime = 0;
        this.flameLengthAlpha = 0;
        this.flameSpeedScale = 1;
        this.flameLifetimeScale = 1;
        this.flameEmitRateScale = 1;
        this.flameSpatialLengthScale = 1;

        this.mouthObject = null;
        this.mouthOffset = new THREE.Vector3(
            this.config.mouthOffset.x,
            this.config.mouthOffset.y,
            this.config.mouthOffset.z
        );
        this.jawSpawnOffset = new THREE.Vector3(
            this.config.jawSpawnOffset?.x ?? 0,
            this.config.jawSpawnOffset?.y ?? 0,
            this.config.jawSpawnOffset?.z ?? 0
        );
        this._assignMouthTarget(mouthObjectOrOffset, configOverrides);
        this.jawBone = this.findBoneByName(this.config.mouth.jawBoneName);
        this.headBone = this.findBoneByName(this.config.mouth.headBoneName);
        // Kept as an alias so existing code paths that reference `mouthBone` still work.
        this.mouthBone = this.jawBone;
        if (this.jawBone && !this.mouthObject) {
            this.mouthObject = this.jawBone;
        }

        this.mouthOpenCurrent = this.config.mouth.idleOpen;
        this.mouthOpenTarget = this.config.mouth.idleOpen;
        this.mouthOpenVisual = this.mouthOpenCurrent;
        this.mouthOpenVelocity = 0;
        this.openSpeed = this.config.mouth.openSpeed;
        this.closeSpeed = this.config.mouth.closeSpeed;
        this.fireOscillationAmount = this.config.mouth.fireOscillationAmount;
        this.fireOscillationSpeed = this.config.mouth.fireOscillationSpeed;
        // Backward-compatible aliases used elsewhere in the class.
        this.mouthOpenSpeed = this.openSpeed;
        this.mouthCloseSpeed = this.closeSpeed;
        this.mouthFireOscillationAmount = this.fireOscillationAmount;
        this.mouthFireOscillationSpeed = this.fireOscillationSpeed;
        this.mouthIdleOpen = this.config.mouth.idleOpen;
        const legacyOpenAngle = typeof this.config.mouth.openAngle === 'number'
            ? this.config.mouth.openAngle
            : null;
        const configuredContinuousAngle = typeof this.config.mouth.continuousAngleDeg === 'number'
            ? THREE.MathUtils.degToRad(this.config.mouth.continuousAngleDeg)
            : null;
        // Long-press pose is the reference "full open" angle for the normalized 0..1 driver.
        this.longPressAngle = configuredContinuousAngle ?? legacyOpenAngle ?? THREE.MathUtils.degToRad(70);
        const configuredBurstAngle = typeof this.config.mouth.burstAngleDeg === 'number'
            ? THREE.MathUtils.degToRad(this.config.mouth.burstAngleDeg)
            : null;
        const defaultBurstOpen = clamp01((configuredBurstAngle ?? THREE.MathUtils.degToRad(40)) / Math.max(this.longPressAngle, 0.0001));
        this.mouthBurstOpen = typeof this.config.mouth.burstOpen === 'number'
            ? clamp01(this.config.mouth.burstOpen)
            : defaultBurstOpen;
        this.mouthContinuousOpen = typeof this.config.mouth.continuousOpen === 'number'
            ? clamp01(this.config.mouth.continuousOpen)
            : 1;
        this.mouthIdleOscillationAmount = this.config.mouth.idleOscillationAmount;
        this.mouthIdleOscillationSpeed = this.config.mouth.idleOscillationSpeed;
        this.mouthOscillationTime = Math.random() * Math.PI * 2;
        this.jawAxis = ['x', 'y', 'z'].includes(this.config.mouth.jawAxis)
            ? this.config.mouth.jawAxis
            : (['x', 'y', 'z'].includes(this.config.mouth.axis) ? this.config.mouth.axis : 'x');
        this.headAxis = ['x', 'y', 'z'].includes(this.config.mouth.headAxis)
            ? this.config.mouth.headAxis
            : this.jawAxis;
        // Direction notes:
        // - Jaw keeps legacy direction semantics (`invert` used in older configs).
        // - Head defaults to the opposite jaw direction so they separate naturally.
        // - `headInvert` flips head direction from that default.
        // Use explicit `jawInvert` when provided, otherwise fall back to legacy `invert`.
        const jawInvert = this.config.mouth.jawInvert == null
            ? this.config.mouth.invert
            : this.config.mouth.jawInvert;
        this.jawAxisDirection = jawInvert ? -1 : 1;
        const defaultHeadDirection = -this.jawAxisDirection;
        this.headAxisDirection = this.config.mouth.headInvert
            ? -defaultHeadDirection
            : defaultHeadDirection;
        this.jawAngleMultiplier = Math.max(0, this.config.mouth.jawAngleMultiplier ?? 2);
        this.maxHeadAngle = this.longPressAngle;
        this.maxJawAngle = this.longPressAngle * this.jawAngleMultiplier;
        this.appliedJawOffset = 0;
        this.appliedHeadOffset = 0;

        this.anchorPosition = new THREE.Vector3();
        this.forwardDirection = new THREE.Vector3(1, 0, 0);
        this.isFlying = false;
        this.spawnPosition = new THREE.Vector3();
        this.tmpVecA = new THREE.Vector3();
        this.tmpVecB = new THREE.Vector3();
        this.tmpVecC = new THREE.Vector3();
        this.tmpQuatA = new THREE.Quaternion();
        this.tmpDragonVelocity = new THREE.Vector3();
        this.tmpFireballDirection = new THREE.Vector3();
        this.flameDirection = new THREE.Vector3(1, 0, 0);
        this.flameDirectionOverride = null; // Vector3 or null — bypasses velocity-based direction logic
        this.anchorPositionOverride = null; // {x, y} or null — world-space offset added to anchorPosition (e.g. from timeline keyframe)
        this.flameLateral = new THREE.Vector3(0, 1, 0);
        this.tmpDragonWorldPosition = new THREE.Vector3();
        this.dragonWorldVelocity = new THREE.Vector3();
        this.prevDragonWorldPosition = new THREE.Vector3();
        this.hasPrevDragonWorldPosition = false;
        this.activeTerrainImpactDebugMarkers = [];

        this.fireRoot = new THREE.Group();
        this.fireRoot.name = 'DragonFireBreath';
        this.scene.add(this.fireRoot);
        this.debugTerrainCollisionRoot = new THREE.Group();
        this.debugTerrainCollisionRoot.name = 'DragonFireTerrainDebug';
        this.fireRoot.add(this.debugTerrainCollisionRoot);

        this.textureLoader = new THREE.TextureLoader(loadingManager || undefined);
        this.flameTexture = this.textureLoader.load(this.flameTextureUrl);
        this.flameTexture.colorSpace = THREE.SRGBColorSpace;
        this.flameTexture.minFilter = THREE.LinearMipmapLinearFilter;
        this.flameTexture.magFilter = THREE.LinearFilter;
        this.flameTexture.generateMipmaps = true;

        this.pointLight = new THREE.PointLight(
            this.config.light.color,
            0,
            this.config.light.distance,
            this.config.light.decay
        );
        this.pointLight.visible = false;
        this.scene.add(this.pointLight);

        this.activeParticles = [];
        this.freeParticles = [];
        this._buildParticleSystem();

        this.activeFireballs = [];
        this.freeFireballs = [];
        this.nextFireballId = 1;
        this._fireballCollisionCache = [];
        this._buildFireballPool();

        this.activeImpactParticles = [];
        this.freeImpactParticles = [];
        this.tmpImpactNormal = new THREE.Vector3();
        this._buildFireballImpactPool();

        this.performanceProfile = {
            flameRateMultiplier: 1,
            emberRateMultiplier: 1,
            smokeRateMultiplier: 1,
            fireballTrailRateMultiplier: 1,
            fireballImpactParticleMultiplier: 1,
            pointLightEnabled: true
        };

        this.terrainChecksEnabled = true;
        this.fireOriginInsideBlockingTerrain = false;
        this.continuousFlameMaxDistance = Number.POSITIVE_INFINITY;
        this.continuousFlameBlockedByTerrain = false;
        this.continuousFlameHitboxMaxDistance = Number.POSITIVE_INFINITY;
        this.currentSpawnForwardDistance = 0;
    }

    setRenderOrder(renderOrder) {
        this.renderOrder = renderOrder;
        this.fireRoot.renderOrder = renderOrder;

        if (this._meshAdditive) {
            this._meshAdditive.renderOrder = renderOrder;
        }
        if (this._meshNormal) {
            this._meshNormal.renderOrder = renderOrder;
        }
        if (this._meshImpact) {
            this._meshImpact.renderOrder = renderOrder;
        }

        for (const fireball of [...this.activeFireballs, ...this.freeFireballs]) {
            fireball.glowSprite.renderOrder = renderOrder;
            fireball.coreSprite.renderOrder = renderOrder;
            for (const fragment of fireball.fragments) {
                fragment.sprite.renderOrder = renderOrder;
            }
        }
    }

    startSmallBurst() {
        this.state = 'burst';
        this.burstTimeLeft = this.config.burst.duration;
        this.continuousTime = 0;
        this.mouthOpenTarget = this.mouthBurstOpen;

        this._emitImmediatePack(
            this.config.burst.immediateFlameCount,
            this.config.burst.immediateEmberCount,
            this.config.burst.immediateSmokeCount,
            this.config.burst
        );
    }

    startContinuousFire() {
        if (this.state === 'continuous') {
            return;
        }

        this.state = 'continuous';
        this.continuousTime = 0;
        this.mouthOpenTarget = this.mouthContinuousOpen;

        // A quick ignition pop helps the stream feel punchy before the ramp reaches full power.
        this._emitImmediatePack(4, 3, 1, this.config.burst);
    }

    stopFire() {
        this.state = 'idle';
        this.burstTimeLeft = 0;
        this.continuousTime = 0;
        this.mouthOpenTarget = this.mouthIdleOpen;
    }

    isContinuousFireActive() {
        return this.state === 'continuous';
    }

    setFacingDirection(dir) {
        this.facingDirection = dir >= 0 ? 1 : -1;
    }

    setAimDirectionOverride(direction) {
        if (!direction || typeof direction.x !== 'number' || typeof direction.y !== 'number') {
            this.flameDirectionOverride = null;
            return;
        }

        this.flameDirectionOverride = this.flameDirectionOverride || new THREE.Vector3();
        this.flameDirectionOverride.set(direction.x, direction.y, direction.z ?? 0);
        if (this.flameDirectionOverride.lengthSq() <= 0.0001) {
            this.flameDirectionOverride = null;
            return;
        }

        this.flameDirectionOverride.normalize();
    }

    setFlyingState(isFlying) {
        this.isFlying = !!isFlying;
    }

    setTerrainChecksEnabled(enabled) {
        this.terrainChecksEnabled = enabled !== false;
        if (!this.terrainChecksEnabled) {
            this.fireOriginInsideBlockingTerrain = false;
            this.continuousFlameMaxDistance = Number.POSITIVE_INFINITY;
            this.continuousFlameBlockedByTerrain = false;
            this.continuousFlameHitboxMaxDistance = Number.POSITIVE_INFINITY;
        }
    }

    setPerformanceProfile(profile = null) {
        this.performanceProfile = {
            flameRateMultiplier: Math.max(0, profile?.flameRateMultiplier ?? 1),
            emberRateMultiplier: Math.max(0, profile?.emberRateMultiplier ?? 1),
            smokeRateMultiplier: Math.max(0, profile?.smokeRateMultiplier ?? 1),
            fireballTrailRateMultiplier: Math.max(0, profile?.fireballTrailRateMultiplier ?? 1),
            fireballImpactParticleMultiplier: Math.max(0, profile?.fireballImpactParticleMultiplier ?? 1),
            pointLightEnabled: profile?.pointLightEnabled !== false
        };
    }

    update(delta) {
        if (!delta || delta <= 0) {
            return;
        }

        const dt = Math.min(delta, this.config.maxDelta);

        this._updateDragonWorldVelocity(dt);
        this._updateFlameLengthState(dt);
        this._refreshTerrainBlockingState();
        // _updateEmitterAnchor reads bone world quaternions — call updateAnchorPostMixer()
        // after animationMixer.update() so it uses the current frame's bone poses.
        this._emitParticles(dt);
        this._updateParticles(dt);
        this._updateFireballs(dt);
        this._updateFireballImpactParticles(dt);
        this._updateTerrainImpactDebugMarkers(dt);
        this._updateLight(dt);
        this._updateMouthPoseState(dt);
    }

    // Call this after animationMixer.update() and updateMouth() so flameDirection and
    // anchorPosition reflect the current frame's actual bone poses.
    updateAnchorPostMixer() {
        this._updateEmitterAnchor();
    }

    forEachDamagePoint(callback) {
        if (typeof callback !== 'function') {
            return;
        }

        for (const particle of this.activeParticles) {
            if (particle.type !== PARTICLE_TYPE.FLAME) {
                continue;
            }

            callback(particle.position.x, particle.position.y);
        }

        for (const fireball of this.activeFireballs) {
            callback(fireball.position.x, fireball.position.y);
            for (const fragment of fireball.fragments) {
                callback(fragment.sprite.position.x, fragment.sprite.position.y);
            }
        }
    }

    getActiveFireballsForCollision() {
        const src = this.activeFireballs;
        const cache = this._fireballCollisionCache;
        const radius = Math.max(
            0,
            Number.isFinite(this.config?.combat?.fireballHitRadius)
                ? this.config.combat.fireballHitRadius
                : 0.9
        );
        cache.length = src.length;
        for (let i = 0; i < src.length; i++) {
            const f = src[i];
            let c = cache[i];
            if (!c) {
                c = { id: 0, x: 0, y: 0, z: 0, spawnX: 0, spawnY: 0, radius: 0 };
                cache[i] = c;
            }
            c.id = f.id;
            c.x = f.position.x;
            c.y = f.position.y;
            c.z = f.position.z;
            c.spawnX = f.spawnPosition.x;
            c.spawnY = f.spawnPosition.y;
            c.radius = radius;
        }
        return cache;
    }

    consumeFireballById(id, options = {}) {
        if (!Number.isFinite(id)) {
            return false;
        }

        const fireballIndex = this.activeFireballs.findIndex((fireball) => fireball.id === id);
        if (fireballIndex < 0) {
            return false;
        }

        const fireball = this.activeFireballs[fireballIndex];
        if (options?.spawnImpactEffect !== false) {
            const impactPosition = options?.impactPosition || fireball.position;
            this.spawnFireballImpactEffect(impactPosition, options?.impactNormal);
        }

        this._deactivateFireballByIndex(fireballIndex);
        return true;
    }

    spawnFireballImpactEffect(position, normal = null, options = {}) {
        if (!position) {
            return;
        }

        const impactDuration = Math.max(
            options.duration ?? this.config?.combat?.fireballImpactDuration ?? 0.25,
            0.05
        );
        const impactScale = Math.max(
            options.scale ?? this.config?.combat?.fireballImpactScale ?? 0.5,
            0.05
        );
        const impactParticleCount = Math.max(
            1,
            Math.floor((options.particleCount ?? this.config?.combat?.fireballImpactParticleCount ?? 8) * (this.performanceProfile.fireballImpactParticleMultiplier ?? 1))
        );
        const impactSpeedMin = Math.max(this.config?.combat?.fireballImpactSpeedMin ?? 4.5, 0);
        const impactSpeedMax = Math.max(
            this.config?.combat?.fireballImpactSpeedMax ?? 10.5,
            impactSpeedMin + 0.001
        );
        const hasNormal = normal && Number.isFinite(normal.x) && Number.isFinite(normal.y);
        if (hasNormal) {
            this.tmpImpactNormal.set(normal.x, normal.y, 0);
            if (this.tmpImpactNormal.lengthSq() > 0.0001) {
                this.tmpImpactNormal.normalize();
            } else {
                this.tmpImpactNormal.set(0, 0, 0);
            }
        } else {
            this.tmpImpactNormal.set(0, 0, 0);
        }

        // Fireball impact burst is intentionally tiny and short-lived compared to vehicle
        // destruction explosions: this is a readable hit confirmation, not a level event.
        for (let particleIndex = 0; particleIndex < impactParticleCount; particleIndex += 1) {
            const impactParticle = this._getImpactParticle();
            if (!impactParticle) {
                break;
            }

            const angle = randomRange(0, Math.PI * 2);
            const speed = randomRange(impactSpeedMin, impactSpeedMax) * impactScale;
            const radialX = Math.cos(angle);
            const radialY = Math.sin(angle);
            impactParticle.age = 0;
            impactParticle.life = randomRange(impactDuration * 0.7, impactDuration * 1.2);
            impactParticle.position.set(
                position.x,
                position.y,
                Number.isFinite(position.z) ? position.z : 0
            );
            impactParticle.velocity.set(
                (radialX * speed) + (this.tmpImpactNormal.x * speed * 0.65),
                (radialY * speed) + (this.tmpImpactNormal.y * speed * 0.65) + (speed * randomRange(0.05, 0.2)),
                randomRange(-0.35, 0.35) * speed
            );
            impactParticle.drag = randomRange(3.4, 6.4);
            impactParticle.gravity = randomRange(6, 14);
            impactParticle.rotation = randomRange(-Math.PI, Math.PI);
            impactParticle.spin = randomRange(-9, 9);
            impactParticle.baseScale = randomRange(0.12, 0.28) * impactScale;
            impactParticle.endScale = impactParticle.baseScale * randomRange(1.7, 2.8);
            impactParticle.colorR = 1;
            impactParticle.colorG = randomRange(0.48, 0.9);
            impactParticle.colorB = randomRange(0.04, 0.26);

            // Write initial transform into the impact InstancedMesh
            this._writeImpactInstance(impactParticle, impactParticle.baseScale, 0.92);
        }
    }

    getContinuousFlameHitRect() {
        if (this.state !== 'continuous' || this.flameLengthAlpha <= 0.01) {
            return null;
        }

        // Continuous flame damage uses one tuned hitbox instead of per-particle tests.
        // This keeps gameplay stable and cheap while still tracking mouth position + aim.
        const baseLength = Math.max(this.config?.combat?.flameHitboxLength ?? 0, 0);
        const width = Math.max(this.config?.combat?.flameHitboxWidth ?? 0, 0);
        if (baseLength <= 0 || width <= 0) {
            return null;
        }

        const forwardOffset = Number.isFinite(this.config?.combat?.flameHitboxForwardOffset)
            ? this.config.combat.flameHitboxForwardOffset
            : 0;
        if (this.fireOriginInsideBlockingTerrain) {
            return null;
        }

        const sourceX = this.anchorPosition.x + (this.flameDirection.x * forwardOffset);
        const sourceY = this.anchorPosition.y + (this.flameDirection.y * forwardOffset);
        const desiredLength = Math.max(baseLength * Math.max(this.flameSpatialLengthScale, 0.05), 0.001);
        const length = this.continuousFlameBlockedByTerrain
            ? Math.min(desiredLength, this.continuousFlameHitboxMaxDistance)
            : desiredLength;
        if (length <= 0.001) {
            return null;
        }

        const halfLength = length * 0.5;
        const halfWidth = Math.max(width * 0.5, 0.001);
        const centerX = sourceX + (this.flameDirection.x * halfLength);
        const centerY = sourceY + (this.flameDirection.y * halfLength);

        return {
            centerX,
            centerY,
            halfWidth: halfLength,
            halfHeight: halfWidth,
            angle: Math.atan2(this.flameDirection.y, this.flameDirection.x),
            sourceX,
            sourceY
        };
    }

    setTerrainProvider(terrain) {
        this.terrainProvider = terrain || null;
    }

    _getTerrainProvider() {
        return this.terrainProvider || null;
    }

    _updateTerrainImpactDebugMarkers(dt) {
        for (let index = this.activeTerrainImpactDebugMarkers.length - 1; index >= 0; index -= 1) {
            const marker = this.activeTerrainImpactDebugMarkers[index];
            marker.life -= dt;
            if (marker.life > 0) {
                continue;
            }

            marker.object?.removeFromParent?.();
            marker.object?.geometry?.dispose?.();
            marker.object?.material?.dispose?.();
            this.activeTerrainImpactDebugMarkers.splice(index, 1);
        }
    }

    _spawnTerrainImpactDebugMarker(point) {
        if (!this.config?.combat?.debugRenderFlameTerrainCollision || !point) {
            return;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute([
            point.x - 0.18, point.y - 0.18, this.anchorPosition.z + 0.6,
            point.x + 0.18, point.y + 0.18, this.anchorPosition.z + 0.6,
            point.x - 0.18, point.y + 0.18, this.anchorPosition.z + 0.6,
            point.x + 0.18, point.y - 0.18, this.anchorPosition.z + 0.6
        ], 3));
        const material = new THREE.LineBasicMaterial({
            color: 0xff3355,
            depthTest: false,
            depthWrite: false,
            toneMapped: false
        });
        const line = new THREE.LineSegments(geometry, material);
        line.name = 'TerrainImpactDebugMarker';
        line.renderOrder = this.renderOrder + 5;
        this.debugTerrainCollisionRoot.add(line);
        this.activeTerrainImpactDebugMarkers.push({
            object: line,
            life: 0.35
        });
    }


    _updateDragonWorldVelocity(dt) {
        if (!this.dragon?.getWorldPosition || dt <= 0) {
            this.dragonWorldVelocity.set(0, 0, 0);
            return;
        }

        this.dragon.getWorldPosition(this.tmpDragonWorldPosition);
        if (!this.hasPrevDragonWorldPosition) {
            this.prevDragonWorldPosition.copy(this.tmpDragonWorldPosition);
            this.dragonWorldVelocity.set(0, 0, 0);
            this.hasPrevDragonWorldPosition = true;
            return;
        }

        this.dragonWorldVelocity
            .copy(this.tmpDragonWorldPosition)
            .sub(this.prevDragonWorldPosition)
            .multiplyScalar(1 / Math.max(dt, 0.0001));

        this.prevDragonWorldPosition.copy(this.tmpDragonWorldPosition);
    }

    _updateFlameLengthState(dt) {
        const targetAlpha = this.state === 'continuous' ? 1 : 0;
        const rampSpeed = targetAlpha > this.flameLengthAlpha
            ? this.config.flameLengthRampUpSpeed
            : this.config.flameLengthRampDownSpeed;
        const smoothing = 1 - Math.exp(-Math.max(rampSpeed, 0.0001) * dt);
        this.flameLengthAlpha = lerp(this.flameLengthAlpha, targetAlpha, smoothing);

        const normalSpeed = Math.max(this.config.normalFlameSpeed, 0.0001);
        const normalLifetime = Math.max(this.config.normalFlameLifetime, 0.0001);
        const normalEmitRate = Math.max(this.config.normalFlameEmitRate, 0.0001);
        const normalLength = Math.max(this.config.normalFlameLength, 0.0001);

        const blendedSpeed = lerp(
            normalSpeed,
            normalSpeed * this.config.longFlameSpeedMultiplier,
            this.flameLengthAlpha
        );
        const blendedLifetime = lerp(
            normalLifetime,
            normalLifetime * this.config.longFlameLifetimeMultiplier,
            this.flameLengthAlpha
        );
        const blendedEmitRate = lerp(
            normalEmitRate,
            normalEmitRate * this.config.longFlameEmitRateMultiplier,
            this.flameLengthAlpha
        );
        const blendedLength = lerp(
            normalLength,
            this.config.longFlameLength,
            this.flameLengthAlpha
        );

        this.flameSpeedScale = blendedSpeed / normalSpeed;
        this.flameLifetimeScale = blendedLifetime / normalLifetime;
        this.flameEmitRateScale = blendedEmitRate / normalEmitRate;
        this.flameSpatialLengthScale = blendedLength / normalLength;
    }

    spawnFireball(dragonVelocity) {
        // Fireballs should aim from a deterministic firing pose, not from the currently cached
        // mouth openness. Otherwise very quick taps inherit the relaxed idle head angle while
        // slightly longer taps drift upward as the mouth has more time to open.
        //
        // Use the same fully-open aiming pose as continuous flame so projectile direction matches
        // the compensated flame direction even though the burst animation itself can remain shorter.
        const postFireballMouthTarget = this.state === 'continuous'
            ? this.mouthContinuousOpen
            : (this.state === 'burst' ? this.mouthBurstOpen : this.mouthIdleOpen);
        this.beforeAnimationUpdate();
        const fireballAimOpen = Math.max(0, this.mouthContinuousOpen ?? this.mouthBurstOpen ?? this.mouthOpenVisual ?? 0);
        this.mouthOpenTarget = fireballAimOpen;
        this.mouthOpenCurrent = fireballAimOpen;
        this.mouthOpenVisual = fireballAimOpen;
        this.updateMouth(1 / 60);
        // updateMouth adjusts local bone rotations; refresh world matrices immediately so the
        // fireball aim reads the same mouth/head pose the flame uses after animation settles.
        this.dragon?.updateMatrixWorld?.(true);
        this._updateEmitterAnchor();
        this._refreshTerrainBlockingState();

        if (this.fireOriginInsideBlockingTerrain) {
            this.mouthOpenTarget = postFireballMouthTarget;
            return false;
        }

        const fireball = this._getFireball();
        if (!fireball) {
            this.mouthOpenTarget = postFireballMouthTarget;
            return false;
        }

        // Spawn from the same resolved emission point as the flame so projectile launch
        // matches the compensated flame angle and avoids reading as a lower head-only shot.
        fireball.position.copy(this.spawnPosition);

        // Velocity inheritance (world space):
        // finalVelocity = fireDirection * projectileSpeed + dragonVelocity
        // This keeps the projectile ahead of a fast-moving dragon so it does not collide visually.
        this.tmpDragonVelocity.set(0, 0, 0);
        if (dragonVelocity?.isVector3) {
            this.tmpDragonVelocity.copy(dragonVelocity);
        } else if (
            dragonVelocity &&
            typeof dragonVelocity.x === 'number' &&
            typeof dragonVelocity.y === 'number' &&
            typeof dragonVelocity.z === 'number'
        ) {
            this.tmpDragonVelocity.set(dragonVelocity.x, dragonVelocity.y, dragonVelocity.z);
        }

        // Fireball direction must match continuous flame direction exactly.
        // Reuse the last post-mixer resolved aim instead of sampling bones again here.
        // Tap input is processed before the current frame's animation update, so re-reading
        // the bones at this point can produce a stale/raw head pose that does not match the
        // compensated flame direction currently shown on screen.
        this.tmpFireballDirection.copy(this.flameDirection);
        if (this.tmpFireballDirection.lengthSq() <= 0.0001) {
            this._resolveFireballFacingDirection(this.tmpFireballDirection);
        } else {
            this.tmpFireballDirection.normalize();
        }
        fireball.direction.copy(this.tmpFireballDirection);

        fireball.velocity
            .copy(fireball.direction)
            .multiplyScalar(this.config.fireball.speed)
            .add(this.tmpDragonVelocity);

        fireball.id = this.nextFireballId;
        this.nextFireballId += 1;
        fireball.spawnPosition.copy(fireball.position);
        fireball.ignoreTerrainUntilExit = false;
        fireball.distanceTraveled = 0;
        fireball.maxDistance = this.config.fireball.maxDistance;
        fireball.fadeStartDistance = fireball.maxDistance * this.config.fireball.fadeStartRatio;
        fireball.age = 0;
        fireball.trailAccumulator = 0;
        fireball.flickerPhase = Math.random() * Math.PI * 2;

        fireball.coreSprite.visible = true;
        fireball.glowSprite.visible = true;
        fireball.coreSprite.position.copy(fireball.position);
        fireball.glowSprite.position.copy(fireball.position);
        fireball.coreMaterial.opacity = this.config.fireball.coreOpacity;
        fireball.glowMaterial.opacity = this.config.fireball.glowOpacity;
        fireball.coreMaterial.rotation = fireball.flickerPhase;
        fireball.glowMaterial.rotation = -fireball.flickerPhase * 0.4;

        for (const fragment of fireball.fragments) {
            const spawnRadius = randomRange(0, this.config.fireball.fragmentOrbitRadius * fragment.orbitRadiusMul);
            const spawnAngle = randomRange(0, Math.PI * 2);
            fragment.sprite.visible = true;
            fragment.sprite.position.copy(fireball.position);
            fragment.material.opacity = this.config.fireball.fragmentOpacity;
            fragment.material.rotation = randomRange(-Math.PI, Math.PI);
            fragment.material.color.setRGB(
                1,
                randomRange(0.42, 0.82),
                randomRange(0.04, 0.22)
            );
            fragment.localOffset.set(
                Math.cos(spawnAngle) * spawnRadius,
                Math.sin(spawnAngle) * spawnRadius * 0.65,
                randomRange(-0.14, 0.14)
            );
            fragment.localVelocity.set(
                randomRange(-1.4, 1.4),
                randomRange(-1.2, 1.2),
                randomRange(-0.6, 0.6)
            );
            const spawnPulse = 1 + Math.sin(fireball.age * fragment.pulseSpeed + fragment.pulsePhase) * 0.18;
            const spawnScale = fragment.baseScale * spawnPulse;
            fragment.sprite.scale.set(spawnScale, spawnScale, 1);
        }

        this.mouthOpenTarget = postFireballMouthTarget;
        return true;
    }

    _resolveFireballFacingDirection(outDirection) {
        // Fallback aim should come from the actual mouth/head world orientation so states that
        // do not provide an explicit override (notably hover) still fire in the visible dragon
        // direction. We keep this as a cheap single quaternion transform, not a per-particle cost.
        let hasWorldAim = false;

        if (this.mouthObject?.getWorldQuaternion) {
            outDirection.set(1, 0, 0);
            this.mouthObject.getWorldQuaternion(this.tmpQuatA);
            outDirection.applyQuaternion(this.tmpQuatA);
            outDirection.z = 0;
            hasWorldAim = outDirection.lengthSq() > 0.0001;
        }

        if (!hasWorldAim) {
            outDirection.set(this.facingDirection >= 0 ? 1 : -1, 0, 0);
        } else {
            outDirection.normalize();
        }

        // Apply the configured fire offset in world 2D after reading the mouth direction.
        // Positive offset should always mean "aim a bit higher" regardless of facing.
        const facingSign = outDirection.x >= 0 ? 1 : -1;
        const offset = (this.fireAngleOffsetRad ?? 0) * facingSign;
        if (offset !== 0) {
            const cos = Math.cos(offset);
            const sin = Math.sin(offset);
            const ox = outDirection.x * cos - outDirection.y * sin;
            const oy = outDirection.x * sin + outDirection.y * cos;
            outDirection.set(ox, oy, 0);
        }

        if (outDirection.lengthSq() <= 0.0001) {
            outDirection.set(this.facingDirection >= 0 ? 1 : -1, 0, 0);
        }
        outDirection.normalize();
    }

    findBoneByName(targetName) {
        if (!targetName || !this.dragon?.traverse) {
            return null;
        }

        let foundBone = null;
        this.dragon.traverse((child) => {
            if (foundBone || !child) {
                return;
            }

            if (child.isBone && child.name === targetName) {
                foundBone = child;
            }
        });

        return foundBone;
    }

    findMouthBone() {
        if (!this.dragon?.traverse) {
            return null;
        }

        return this.findBoneByName(this.config.mouth.jawBoneName);
    }

    _updateMouthPoseState(dt) {
        this.mouthOpenVelocity = this.mouthOpenTarget >= this.mouthOpenCurrent
            ? this.openSpeed
            : this.closeSpeed;

        const smoothing = 1 - Math.exp(-this.mouthOpenVelocity * dt);
        this.mouthOpenCurrent = lerp(this.mouthOpenCurrent, this.mouthOpenTarget, smoothing);
        this.mouthOscillationTime += dt;

        let proceduralOscillation = Math.sin(this.mouthOscillationTime * this.mouthIdleOscillationSpeed) *
            this.mouthIdleOscillationAmount;

        if (this.state === 'continuous') {
            const primary = Math.sin(this.mouthOscillationTime * this.fireOscillationSpeed);
            const secondary = Math.sin(this.mouthOscillationTime * (this.fireOscillationSpeed * 0.53) + 1.2);
            proceduralOscillation = (primary + secondary * 0.45) * this.fireOscillationAmount;
        }

        // Single normalized driver [0..1] used for both head-up and jaw-down overlays.
        this.mouthOpenVisual = clamp01(this.mouthOpenCurrent + proceduralOscillation);
    }

    updateMouth(delta) {
        if ((!this.jawBone && !this.headBone) || !delta || delta <= 0) {
            return;
        }

        // Call this AFTER animationMixer.update(delta) so this local jaw overlay wins every frame.
        const openness = this.mouthOpenVisual;

        if (this.headBone) {
            const headOffset = openness * this.maxHeadAngle * this.headAxisDirection;
            // Axis selection: switch `mouth.headAxis` between 'x', 'y', and 'z' to match your rig.
            // Direction fix: flip `mouth.headInvert` if the head moves the wrong way.
            this.headBone.rotation[this.headAxis] += headOffset;
            this.appliedHeadOffset = headOffset;
        }

        if (this.jawBone) {
            const jawOffset = openness * this.maxJawAngle * this.jawAxisDirection;
            // Axis selection: switch `mouth.jawAxis` between 'x', 'y', and 'z' to match your rig.
            // Direction fix: flip `mouth.jawInvert` (or legacy `mouth.invert`) if needed.
            this.jawBone.rotation[this.jawAxis] += jawOffset;
            this.appliedJawOffset = jawOffset;
        }
    }

    beforeAnimationUpdate() {
        if (this.headBone && this.appliedHeadOffset !== 0) {
            this.headBone.rotation[this.headAxis] -= this.appliedHeadOffset;
            this.appliedHeadOffset = 0;
        }

        if (this.jawBone && this.appliedJawOffset !== 0) {
            // Remove previous overlay before mixer updates so non-keyed clips do not accumulate.
            this.jawBone.rotation[this.jawAxis] -= this.appliedJawOffset;
            this.appliedJawOffset = 0;
        }
    }

    clearTransientEffects() {
        this.stopFire();

        for (const particle of this.activeParticles) {
            this._deactivateParticleByRef(particle);
        }
        this.activeParticles.length = 0;

        for (const fireball of this.activeFireballs) {
            this._deactivateFireballByRef(fireball);
        }
        this.activeFireballs.length = 0;

        for (const impactParticle of this.activeImpactParticles) {
            this._deactivateImpactParticleByRef(impactParticle);
        }
        this.activeImpactParticles.length = 0;

        // Mark all instance transforms as dirty so the zeroed-out slots take effect.
        if (this._meshAdditive) {
            this._meshAdditive.instanceMatrix.needsUpdate = true;
            if (this._meshAdditive.instanceColor) {
                this._meshAdditive.instanceColor.needsUpdate = true;
            }
        }
        if (this._meshNormal) {
            this._meshNormal.instanceMatrix.needsUpdate = true;
            if (this._meshNormal.instanceColor) {
                this._meshNormal.instanceColor.needsUpdate = true;
            }
            if (this._smokeOpacityAttr) {
                this._smokeOpacityAttr.needsUpdate = true;
            }
        }
        if (this._meshImpact) {
            this._meshImpact.instanceMatrix.needsUpdate = true;
            if (this._meshImpact.instanceColor) {
                this._meshImpact.instanceColor.needsUpdate = true;
            }
        }

        this.pointLight.visible = false;
        this.pointLight.intensity = 0;
    }

    dispose() {
        for (const particle of this.activeParticles) {
            this._deactivateParticleByRef(particle);
        }
        this.activeParticles.length = 0;
        this.freeParticles.length = 0;

        if (this._meshAdditive) {
            this._meshAdditive.geometry.dispose();
            this._meshAdditive.material.dispose();
            this.fireRoot.remove(this._meshAdditive);
            this._meshAdditive = null;
        }
        if (this._meshNormal) {
            this._meshNormal.geometry.dispose();
            this._meshNormal.material.dispose();
            this.fireRoot.remove(this._meshNormal);
            this._meshNormal = null;
        }

        for (const fireball of this.activeFireballs) {
            this._deactivateFireballByRef(fireball);
        }
        this.activeFireballs.length = 0;

        for (const fireball of this.freeFireballs) {
            fireball.coreMaterial.dispose();
            fireball.glowMaterial.dispose();
            this.fireRoot.remove(fireball.coreSprite);
            this.fireRoot.remove(fireball.glowSprite);
            for (const fragment of fireball.fragments) {
                fragment.material.dispose();
                this.fireRoot.remove(fragment.sprite);
            }
        }
        this.freeFireballs.length = 0;

        for (const impactParticle of this.activeImpactParticles) {
            this._deactivateImpactParticleByRef(impactParticle);
        }
        this.activeImpactParticles.length = 0;
        this.freeImpactParticles.length = 0;

        if (this._meshImpact) {
            this._meshImpact.geometry.dispose();
            this._meshImpact.material.dispose();
            this.fireRoot.remove(this._meshImpact);
            this._meshImpact = null;
        }

        this.scene.remove(this.fireRoot);
        this.scene.remove(this.pointLight);
        this.pointLight.dispose?.();
        this.flameTexture.dispose();
    }

    _assignMouthTarget(mouthObjectOrOffset, configOverrides) {
        if (mouthObjectOrOffset && mouthObjectOrOffset.isObject3D) {
            this.mouthObject = mouthObjectOrOffset;
            return;
        }

        const isVectorLike = mouthObjectOrOffset &&
            typeof mouthObjectOrOffset.x === 'number' &&
            typeof mouthObjectOrOffset.y === 'number' &&
            typeof mouthObjectOrOffset.z === 'number';

        if (isVectorLike) {
            this.mouthOffset.set(
                mouthObjectOrOffset.x,
                mouthObjectOrOffset.y,
                mouthObjectOrOffset.z
            );
            return;
        }

        if (configOverrides?.mouthObject?.isObject3D) {
            this.mouthObject = configOverrides.mouthObject;
            return;
        }

        const overrideOffset = configOverrides?.mouthOffset;
        const hasOverrideOffset = overrideOffset &&
            typeof overrideOffset.x === 'number' &&
            typeof overrideOffset.y === 'number' &&
            typeof overrideOffset.z === 'number';

        if (hasOverrideOffset) {
            this.mouthOffset.set(overrideOffset.x, overrideOffset.y, overrideOffset.z);
        }
    }

    // -----------------------------------------------------------------------
    // Particle system construction — InstancedMesh backend
    // -----------------------------------------------------------------------

    _buildParticleSystem() {
        const maxParticles = this.config.maxParticles;

        // Shared unit-plane geometry (1×1, faces +Z by default which is camera-facing in XY games)
        const planeGeo = new THREE.PlaneGeometry(1, 1);

        // --- Additive mesh (flame + ember) ---
        const additiveMat = new THREE.MeshBasicMaterial({
            map: this.flameTexture,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            vertexColors: false
        });
        this._meshAdditive = new THREE.InstancedMesh(planeGeo, additiveMat, maxParticles);
        this._meshAdditive.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this._meshAdditive.frustumCulled = false;
        this._meshAdditive.renderOrder = this.renderOrder;
        // Initialise all instance colors to black (invisible for additive)
        this._meshAdditive.setColorAt(0, new THREE.Color(0, 0, 0));
        for (let i = 0; i < maxParticles; i += 1) {
            this._meshAdditive.setColorAt(i, new THREE.Color(0, 0, 0));
        }
        if (this._meshAdditive.instanceColor) {
            this._meshAdditive.instanceColor.setUsage(THREE.DynamicDrawUsage);
        }
        this.fireRoot.add(this._meshAdditive);

        // --- Normal-blend mesh (smoke) with per-instance opacity ---
        // Smoke needs true alpha blending so we use a ShaderMaterial that reads
        // an `instanceOpacity` InstancedBufferAttribute.
        const smokeMat = _buildSmokeShaderMaterial(this.flameTexture);
        this._smokeOpacityAttr = new THREE.InstancedBufferAttribute(
            new Float32Array(maxParticles).fill(0),
            1
        );
        this._smokeOpacityAttr.setUsage(THREE.DynamicDrawUsage);

        // PlaneGeometry for the smoke mesh shares the same shape but needs its own
        // geometry instance so we can attach the instanceOpacity attribute to it.
        const smokeGeo = new THREE.PlaneGeometry(1, 1);
        smokeGeo.setAttribute('instanceOpacity', this._smokeOpacityAttr);

        this._meshNormal = new THREE.InstancedMesh(smokeGeo, smokeMat, maxParticles);
        this._meshNormal.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this._meshNormal.frustumCulled = false;
        this._meshNormal.renderOrder = this.renderOrder;
        this._meshNormal.setColorAt(0, new THREE.Color(0, 0, 0));
        for (let i = 0; i < maxParticles; i += 1) {
            this._meshNormal.setColorAt(i, new THREE.Color(0, 0, 0));
        }
        if (this._meshNormal.instanceColor) {
            this._meshNormal.instanceColor.setUsage(THREE.DynamicDrawUsage);
        }
        this.fireRoot.add(this._meshNormal);

        // Reusable helpers for matrix composition
        this._dummy = new THREE.Object3D();
        this._color = new THREE.Color();

        // Zero-scale matrix used to hide inactive particles
        this._zeroMatrix = new THREE.Matrix4().makeScale(0, 0, 0);

        // Pre-fill both meshes with zero-scale matrices so inactive slots are invisible
        for (let i = 0; i < maxParticles; i += 1) {
            this._meshAdditive.setMatrixAt(i, this._zeroMatrix);
            this._meshNormal.setMatrixAt(i, this._zeroMatrix);
        }
        this._meshAdditive.instanceMatrix.needsUpdate = true;
        this._meshNormal.instanceMatrix.needsUpdate = true;

        // Index free lists — separate pools for additive and normal meshes.
        // Each particle slot is pre-allocated; pool objects carry a meshType tag
        // so deactivation knows which mesh and which index to zero out.
        this._freeAdditiveIndices = [];
        this._freeNormalIndices = [];

        // Split the pool: first half additive (flame+ember), second half normal (smoke).
        // Ratio: smoke is ~15% of emit rate, so we give ~25% of slots to it with
        // the rest going to additive. Both pools share the same particle object array.
        const smokeSlots = Math.ceil(maxParticles * 0.28);
        const additiveSlots = maxParticles - smokeSlots;

        for (let i = 0; i < additiveSlots; i += 1) {
            this._freeAdditiveIndices.push(i);
        }
        for (let i = 0; i < smokeSlots; i += 1) {
            this._freeNormalIndices.push(i);
        }

        // Build particle pool objects — no sprite/material, only simulation data
        const totalSlots = maxParticles;
        for (let i = 0; i < totalSlots; i += 1) {
            this.freeParticles.push({
                type: PARTICLE_TYPE.FLAME,
                age: 0,
                life: 0.2,
                position: new THREE.Vector3(),
                velocity: new THREE.Vector3(),
                drag: 0,
                buoyancy: 0,
                sizeStartX: 0.2,
                sizeStartY: 0.2,
                sizeEndX: 0.8,
                sizeEndY: 0.8,
                alphaStart: 1,
                alphaEnd: 0,
                rotation: 0,
                spin: 0,
                core: false,
                flickerPhase: Math.random() * Math.PI * 2,
                colorR: 1,
                colorG: 1,
                colorB: 1,
                instanceIndex: -1,
                meshType: 'additive'   // 'additive' | 'normal'
            });
        }
    }

    _buildFireballPool() {
        const fireballConfig = this.config.fireball;
        for (let i = 0; i < fireballConfig.maxProjectiles; i += 1) {
            const glowMaterial = new THREE.SpriteMaterial({
                map: this.flameTexture,
                color: 0xff7c2a,
                transparent: true,
                opacity: 0,
                depthTest: false,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });
            const coreMaterial = new THREE.SpriteMaterial({
                map: this.flameTexture,
                color: 0xfff2b5,
                transparent: true,
                opacity: 0,
                depthTest: false,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            const glowSprite = new THREE.Sprite(glowMaterial);
            const coreSprite = new THREE.Sprite(coreMaterial);
            glowSprite.visible = false;
            coreSprite.visible = false;
            glowSprite.frustumCulled = false;
            coreSprite.frustumCulled = false;
            glowSprite.renderOrder = this.renderOrder;
            coreSprite.renderOrder = this.renderOrder;
            glowSprite.scale.set(fireballConfig.glowSize, fireballConfig.glowSize, 1);
            coreSprite.scale.set(fireballConfig.coreSize, fireballConfig.coreSize, 1);
            this.fireRoot.add(glowSprite);
            this.fireRoot.add(coreSprite);

            const fragments = [];
            for (let fragmentIndex = 0; fragmentIndex < fireballConfig.fragmentCount; fragmentIndex += 1) {
                const fragmentMaterial = new THREE.SpriteMaterial({
                    map: this.flameTexture,
                    color: 0xffaf4c,
                    transparent: true,
                    opacity: 0,
                    depthTest: false,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending
                });
                const fragmentSprite = new THREE.Sprite(fragmentMaterial);
                fragmentSprite.visible = false;
                fragmentSprite.frustumCulled = false;
                fragmentSprite.renderOrder = this.renderOrder;
                fragmentSprite.scale.set(
                    fireballConfig.fragmentSize * randomRange(0.86, 1.2),
                    fireballConfig.fragmentSize * randomRange(0.86, 1.2),
                    1
                );
                this.fireRoot.add(fragmentSprite);

                fragments.push({
                    sprite: fragmentSprite,
                    material: fragmentMaterial,
                    baseScale: fireballConfig.fragmentSize * randomRange(0.84, 1.24),
                    phaseOffset: Math.random() * Math.PI * 2,
                    orbitSpeedMul: randomRange(0.72, 1.35),
                    orbitRadiusMul: randomRange(0.72, 1.25),
                    zJitter: randomRange(-0.12, 0.12),
                    localOffset: new THREE.Vector3(),
                    localVelocity: new THREE.Vector3(),
                    pulseSpeed: randomRange(3.6, 8.4),
                    pulsePhase: Math.random() * Math.PI * 2,
                    spinVelocity: randomRange(-6.8, 7.2),
                    swirlDirection: Math.random() < 0.5 ? -1 : 1,
                    turbulenceFreqA: randomRange(1.2, 2.7),
                    turbulenceFreqB: randomRange(0.9, 2.2),
                    turbulenceAmp: randomRange(0.75, 1.45),
                    forwardBias: randomRange(-1, 1),
                    depthBias: randomRange(-1, 1)
                });
            }

            this.freeFireballs.push({
                id: null,
                glowSprite,
                glowMaterial,
                coreSprite,
                coreMaterial,
                fragments,
                position: new THREE.Vector3(),
                spawnPosition: new THREE.Vector3(),
                velocity: new THREE.Vector3(),
                direction: new THREE.Vector3(1, 0, 0),
                distanceTraveled: 0,
                maxDistance: fireballConfig.maxDistance,
                fadeStartDistance: fireballConfig.maxDistance * fireballConfig.fadeStartRatio,
                age: 0,
                trailAccumulator: 0,
                flickerPhase: 0
            });
        }
    }

    _buildFireballImpactPool() {
        const impactCountPerBurst = Math.max(
            1,
            Math.floor(this.config?.combat?.fireballImpactParticleCount ?? 8)
        );
        const maxProjectiles = Math.max(this.config?.fireball?.maxProjectiles ?? 8, 1);
        const poolSize = Math.max(impactCountPerBurst * Math.min(maxProjectiles, 8), impactCountPerBurst * 2);

        // Impact InstancedMesh — additive blending, color premultiplied by opacity
        const impactGeo = new THREE.PlaneGeometry(1, 1);
        const impactMat = new THREE.MeshBasicMaterial({
            map: this.flameTexture,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            vertexColors: false
        });
        this._meshImpact = new THREE.InstancedMesh(impactGeo, impactMat, poolSize);
        this._meshImpact.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this._meshImpact.frustumCulled = false;
        this._meshImpact.renderOrder = this.renderOrder;
        this._meshImpact.setColorAt(0, new THREE.Color(0, 0, 0));
        for (let i = 0; i < poolSize; i += 1) {
            this._meshImpact.setColorAt(i, new THREE.Color(0, 0, 0));
            this._meshImpact.setMatrixAt(i, this._zeroMatrix);
        }
        if (this._meshImpact.instanceColor) {
            this._meshImpact.instanceColor.setUsage(THREE.DynamicDrawUsage);
        }
        this._meshImpact.instanceMatrix.needsUpdate = true;
        this.fireRoot.add(this._meshImpact);

        // Free index list for impact pool
        this._freeImpactIndices = [];
        for (let i = 0; i < poolSize; i += 1) {
            this._freeImpactIndices.push(i);
        }

        for (let poolIndex = 0; poolIndex < poolSize; poolIndex += 1) {
            this.freeImpactParticles.push({
                position: new THREE.Vector3(),
                velocity: new THREE.Vector3(),
                age: 0,
                life: 0.2,
                drag: 4,
                gravity: 10,
                rotation: 0,
                spin: 0,
                baseScale: 0.2,
                endScale: 0.5,
                colorR: 1,
                colorG: 0.6,
                colorB: 0.2,
                instanceIndex: -1
            });
        }
    }

    _updateEmitterAnchor() {
        if (this.mouthObject) {
            // Mouth world position is the authoritative origin for flame/fireball spawning.
            this.mouthObject.getWorldPosition(this.anchorPosition);

            // Apply configurable spawn offset in jaw local space so it always follows jaw orientation.
            if (this.jawSpawnOffset.lengthSq() > 0) {
                this.tmpVecA.copy(this.jawSpawnOffset);
                this.mouthObject.getWorldQuaternion(this.tmpQuatA);
                this.tmpVecA.applyQuaternion(this.tmpQuatA);
                this.anchorPosition.add(this.tmpVecA);
            }
        } else {
            this.tmpVecA.copy(this.mouthOffset);

            if (this.config.mirrorMouthOffsetX) {
                this.tmpVecA.x *= this.facingDirection;
            }

            this.anchorPosition.copy(this.tmpVecA);
            this.dragon.localToWorld(this.anchorPosition);
        }

        // Timeline-authored spawn offset: X is mirrored by facing so authors always think in
        // "positive = forward" regardless of which way the dragon faces.
        if (this.anchorPositionOverride) {
            const facingSign = this.facingDirection >= 0 ? 1 : -1;
            this.anchorPosition.x += this.anchorPositionOverride.x * facingSign;
            this.anchorPosition.y += this.anchorPositionOverride.y ?? 0;
        }

        this.forwardDirection.set(this.facingDirection, 0, 0);
        if (this.flameDirectionOverride) {
            this.flameDirection.copy(this.flameDirectionOverride).normalize();
        } else {
            // Always derive direction from the mouth bone world quaternion so flame and
            // fireballs follow the actual head orientation in world space.
            this._resolveFireballFacingDirection(this.flameDirection);
        }

        // 2D lateral axis used for directional spread around the travel vector.
        this.flameLateral.set(-this.flameDirection.y, this.flameDirection.x, 0);
        if (this.flameLateral.lengthSq() > 0.0001) {
            this.flameLateral.normalize();
        } else {
            this.flameLateral.set(0, 1, 0);
        }

        const configuredForwardOffset = this.config.flameSpawnForwardOffset ?? this.config.spawnForwardOffset ?? 0;
        const forwardSpeed = Math.max(0, this.dragonWorldVelocity.dot(this.flameDirection));
        const speedForwardBias = forwardSpeed * Math.max(this.config.flameSpawnSpeedBias ?? 0, 0);
        const lengthForwardBias = Math.max(this.flameSpatialLengthScale - 1, 0) * configuredForwardOffset * 0.25;
        // Spawn slightly in front of the mouth. The extra speed bias keeps flame origins ahead
        // of the head at high travel speeds, reducing visible self-overlap/clipping.
        const spawnForwardDistance = configuredForwardOffset + speedForwardBias + lengthForwardBias;
        this.currentSpawnForwardDistance = spawnForwardDistance;
        this.spawnPosition
            .copy(this.anchorPosition)
            .addScaledVector(this.flameDirection, spawnForwardDistance);
    }

    _emitParticles(dt) {
        if (this.state === 'idle') {
            return;
        }

        if (this.state === 'burst') {
            this.burstTimeLeft = Math.max(0, this.burstTimeLeft - dt);
            const remainingRatio = this.config.burst.duration > 0
                ? this.burstTimeLeft / this.config.burst.duration
                : 0;
            const strength = clamp01(Math.pow(remainingRatio, 0.65));

            this._spawnByRates(dt, this.config.burst, strength);

            if (this.burstTimeLeft <= 0) {
                this.state = 'idle';
                this.mouthOpenTarget = this.mouthIdleOpen;
            }
            return;
        }

        if (this.state === 'continuous') {
            if (
                this.fireOriginInsideBlockingTerrain ||
                (this.continuousFlameBlockedByTerrain && this.continuousFlameMaxDistance <= 0.001)
            ) {
                return;
            }
            this.continuousTime += dt;
            const rampRatio = this.config.continuous.rampDuration > 0
                ? this.continuousTime / this.config.continuous.rampDuration
                : 1;
            const rampStrength = easeOutCubic(rampRatio);

            this._spawnByRates(dt, this.config.continuous, rampStrength);
        }
    }

    _spawnByRates(dt, profile, strength) {
        const flameRate = profile.flameRate * lerp(0.38, 1, strength) * this.flameEmitRateScale * (this.performanceProfile.flameRateMultiplier ?? 1);
        const emberRate = profile.emberRate * lerp(0.28, 1, strength) * (this.performanceProfile.emberRateMultiplier ?? 1);
        const smokeRate = profile.smokeRate * lerp(0.2, 1, strength) * (this.performanceProfile.smokeRateMultiplier ?? 1);

        this.flameAccumulator += dt * flameRate;
        this.emberAccumulator += dt * emberRate;
        this.smokeAccumulator += dt * smokeRate;

        const flameCount = Math.min(this.config.maxSpawnPerFrame, Math.floor(this.flameAccumulator));
        const emberCount = Math.min(this.config.maxSpawnPerFrame, Math.floor(this.emberAccumulator));
        const smokeCount = Math.min(this.config.maxSpawnPerFrame, Math.floor(this.smokeAccumulator));

        this.flameAccumulator -= flameCount;
        this.emberAccumulator -= emberCount;
        this.smokeAccumulator -= smokeCount;

        for (let i = 0; i < flameCount; i += 1) {
            this._spawnFlameParticle(profile, strength);
        }
        for (let i = 0; i < emberCount; i += 1) {
            this._spawnEmberParticle(profile, strength);
        }
        for (let i = 0; i < smokeCount; i += 1) {
            this._spawnSmokeParticle(profile, strength);
        }
    }

    _emitImmediatePack(flameCount, emberCount, smokeCount, profile) {
        for (let i = 0; i < flameCount; i += 1) {
            this._spawnFlameParticle(profile, 1);
        }
        for (let i = 0; i < emberCount; i += 1) {
            this._spawnEmberParticle(profile, 1);
        }
        for (let i = 0; i < smokeCount; i += 1) {
            this._spawnSmokeParticle(profile, 0.95);
        }
    }

    _spawnFlameParticle(profile, strength) {
        const particle = this._getParticle('additive');
        if (!particle) {
            return;
        }

        const flameConfig = this.config.flame;
        const speedBase = randomRange(flameConfig.speedMin, flameConfig.speedMax) *
            profile.speedMul *
            this.flameSpeedScale;
        const spreadMul = profile.spread *
            lerp(0.82, 1.08, Math.random()) *
            lerp(1, 1.18, this.flameLengthAlpha);

        particle.type = PARTICLE_TYPE.FLAME;
        particle.age = 0;
        particle.life = randomRange(flameConfig.lifeMin, flameConfig.lifeMax) * this.flameLifetimeScale;
        particle.drag = randomRange(flameConfig.dragMin, flameConfig.dragMax);
        particle.buoyancy = randomRange(flameConfig.buoyancyMin, flameConfig.buoyancyMax) + this.config.baseUpwardDrift * 0.6;
        particle.rotation = randomRange(-Math.PI, Math.PI);
        particle.spin = randomRange(flameConfig.spinMin, flameConfig.spinMax);
        particle.core = Math.random() < flameConfig.coreChance;

        const baseSize = randomRange(flameConfig.sizeMin, flameConfig.sizeMax) *
            profile.sizeMul *
            lerp(1, 1.12, this.flameLengthAlpha);
        particle.sizeStartX = baseSize * flameConfig.stretchX * this.flameSpatialLengthScale;
        particle.sizeStartY = baseSize * flameConfig.stretchY;
        particle.sizeEndX = baseSize * randomRange(1.5, 2.1) * this.flameSpatialLengthScale;
        particle.sizeEndY = particle.sizeEndX * 0.72;
        particle.alphaStart = randomRange(0.72, 1) * profile.glowMul;
        particle.alphaEnd = 0;

        particle.position.copy(this.spawnPosition);
        particle.position.y += randomRange(-0.08, 0.08);
        particle.position.z += randomRange(-0.12, 0.12);
        particle.velocity.copy(this.flameDirection).multiplyScalar(speedBase);
        // Keep spread mostly perpendicular to the emission direction so the cone follows the dragon angle.
        particle.velocity.addScaledVector(
            this.flameLateral,
            randomRange(-flameConfig.spreadY, flameConfig.spreadY) * spreadMul * speedBase
        );
        particle.velocity.z += randomRange(-flameConfig.spreadZ, flameConfig.spreadZ) * spreadMul * speedBase;
        particle.velocity.y += this.config.baseUpwardDrift * 0.45;
        const inheritVelocityFactor = Math.max(this.config.inheritDragonVelocityFactor ?? 0, 0);
        // World-space dragon velocity inheritance:
        // flameVelocity = directionalFlameVelocity + dragonWorldVelocity * inheritFactor
        // This keeps spawned flame moving with the dragon so fast flight does not run into its own flame.
        particle.velocity.addScaledVector(this.dragonWorldVelocity, inheritVelocityFactor);
        particle.distanceTraveled = 0;
        if (!this._setParticleTerrainTravelLimit(particle)) {
            this._deactivateParticleByRef(particle);
            return;
        }

        particle.colorR = 1;
        particle.colorG = 0.8;
        particle.colorB = 0.35;

        // Write initial instance data
        this._writeAdditiveInstance(particle, particle.sizeStartX, particle.sizeStartY, particle.alphaStart);
    }

    _spawnEmberParticle(profile, strength) {
        const particle = this._getParticle('additive');
        if (!particle) {
            return;
        }

        const emberConfig = this.config.ember;
        const speedBase = randomRange(emberConfig.speedMin, emberConfig.speedMax) * profile.speedMul;
        const spreadMul = profile.spread * lerp(0.9, 1.25, Math.random());

        particle.type = PARTICLE_TYPE.EMBER;
        particle.age = 0;
        particle.life = randomRange(emberConfig.lifeMin, emberConfig.lifeMax);
        particle.drag = randomRange(emberConfig.dragMin, emberConfig.dragMax);
        particle.buoyancy = randomRange(emberConfig.buoyancyMin, emberConfig.buoyancyMax) + this.config.baseUpwardDrift;
        particle.rotation = randomRange(-Math.PI, Math.PI);
        particle.spin = randomRange(emberConfig.spinMin, emberConfig.spinMax);
        particle.core = false;

        const baseSize = randomRange(emberConfig.sizeMin, emberConfig.sizeMax) * lerp(0.95, 1.2, strength);
        particle.sizeStartX = baseSize * emberConfig.stretchX;
        particle.sizeStartY = baseSize * emberConfig.stretchY;
        particle.sizeEndX = baseSize * randomRange(0.22, 0.45);
        particle.sizeEndY = particle.sizeEndX;
        particle.alphaStart = randomRange(0.7, 1);
        particle.alphaEnd = 0;

        particle.position.copy(this.spawnPosition);
        particle.position.y += randomRange(-0.11, 0.14);
        particle.position.z += randomRange(-0.18, 0.18);
        particle.velocity.set(
            this.forwardDirection.x * speedBase,
            randomRange(-emberConfig.spreadY, emberConfig.spreadY) * spreadMul * speedBase + this.config.baseUpwardDrift * 1.4,
            randomRange(-emberConfig.spreadZ, emberConfig.spreadZ) * spreadMul * speedBase
        );
        particle.distanceTraveled = 0;
        if (!this._setParticleTerrainTravelLimit(particle)) {
            this._deactivateParticleByRef(particle);
            return;
        }

        particle.colorR = 1;
        particle.colorG = 0.64;
        particle.colorB = 0.22;

        this._writeAdditiveInstance(particle, particle.sizeStartX, particle.sizeStartY, particle.alphaStart);
    }

    _spawnSmokeParticle(profile, strength) {
        const particle = this._getParticle('normal');
        if (!particle) {
            return;
        }

        const smokeConfig = this.config.smoke;
        const speedBase = randomRange(smokeConfig.speedMin, smokeConfig.speedMax) * lerp(0.72, 1, profile.speedMul);
        const spreadMul = profile.spread * lerp(0.95, 1.3, Math.random());

        particle.type = PARTICLE_TYPE.SMOKE;
        particle.age = 0;
        particle.life = randomRange(smokeConfig.lifeMin, smokeConfig.lifeMax);
        particle.drag = randomRange(smokeConfig.dragMin, smokeConfig.dragMax);
        particle.buoyancy = randomRange(smokeConfig.buoyancyMin, smokeConfig.buoyancyMax);
        particle.rotation = randomRange(-Math.PI, Math.PI);
        particle.spin = randomRange(smokeConfig.spinMin, smokeConfig.spinMax);
        particle.core = false;

        const baseSize = randomRange(smokeConfig.sizeMin, smokeConfig.sizeMax) * lerp(0.9, 1.16, strength);
        particle.sizeStartX = baseSize * smokeConfig.stretchX;
        particle.sizeStartY = baseSize * smokeConfig.stretchY;
        particle.sizeEndX = baseSize * randomRange(1.45, 2.3);
        particle.sizeEndY = particle.sizeEndX;
        particle.alphaStart = randomRange(0.1, 0.22);
        particle.alphaEnd = 0;

        particle.position.copy(this.spawnPosition);
        particle.position.y += randomRange(-0.2, 0.2);
        particle.position.z += randomRange(-0.3, 0.3);
        particle.velocity.set(
            this.forwardDirection.x * speedBase,
            randomRange(-smokeConfig.spreadY, smokeConfig.spreadY) * spreadMul * speedBase + this.config.baseUpwardDrift * 0.8,
            randomRange(-smokeConfig.spreadZ, smokeConfig.spreadZ) * spreadMul * speedBase
        );
        particle.distanceTraveled = 0;
        if (!this._setParticleTerrainTravelLimit(particle)) {
            this._deactivateParticleByRef(particle);
            return;
        }

        particle.colorR = 0.26;
        particle.colorG = 0.26;
        particle.colorB = 0.28;

        this._writeSmokeInstance(particle, particle.sizeStartX, particle.sizeStartY, particle.alphaStart);
    }

    _getParticle(meshType) {
        const particle = this.freeParticles.pop();
        if (!particle) {
            return null;
        }

        // Claim a slot from the appropriate index free list
        const freeList = meshType === 'normal' ? this._freeNormalIndices : this._freeAdditiveIndices;
        if (freeList.length === 0) {
            // No slot available in this mesh — return particle back and bail
            this.freeParticles.push(particle);
            return null;
        }

        particle.instanceIndex = freeList.pop();
        particle.meshType = meshType;
        this.activeParticles.push(particle);
        return particle;
    }

    // Write position+scale+rotation into the additive InstancedMesh and bake opacity into color
    _writeAdditiveInstance(particle, sx, sy, opacity) {
        const idx = particle.instanceIndex;
        this._dummy.position.copy(particle.position);
        this._dummy.rotation.set(0, 0, particle.rotation);
        this._dummy.scale.set(sx, sy, 1);
        this._dummy.updateMatrix();
        this._meshAdditive.setMatrixAt(idx, this._dummy.matrix);
        // Premultiply opacity into color — works perfectly with additive blending
        this._color.setRGB(
            particle.colorR * opacity,
            particle.colorG * opacity,
            particle.colorB * opacity
        );
        this._meshAdditive.setColorAt(idx, this._color);
    }

    // Write into the normal-blend (smoke) InstancedMesh — color and separate opacity attribute
    _writeSmokeInstance(particle, sx, sy, opacity) {
        const idx = particle.instanceIndex;
        this._dummy.position.copy(particle.position);
        this._dummy.rotation.set(0, 0, particle.rotation);
        this._dummy.scale.set(sx, sy, 1);
        this._dummy.updateMatrix();
        this._meshNormal.setMatrixAt(idx, this._dummy.matrix);
        this._color.setRGB(particle.colorR, particle.colorG, particle.colorB);
        this._meshNormal.setColorAt(idx, this._color);
        this._smokeOpacityAttr.setX(idx, opacity);
    }

    // Write into the impact InstancedMesh (additive, premultiplied color)
    _writeImpactInstance(particle, scale, opacity) {
        const idx = particle.instanceIndex;
        this._dummy.position.copy(particle.position);
        this._dummy.rotation.set(0, 0, particle.rotation);
        this._dummy.scale.set(scale, scale, 1);
        this._dummy.updateMatrix();
        this._meshImpact.setMatrixAt(idx, this._dummy.matrix);
        this._color.setRGB(
            particle.colorR * opacity,
            particle.colorG * opacity,
            particle.colorB * opacity
        );
        this._meshImpact.setColorAt(idx, this._color);
    }

    _updateParticles(dt) {
        const dragMultiplier = Math.max(0, 1 - dt * 0.5);
        let additiveChanged = false;
        let normalChanged = false;

        for (let i = this.activeParticles.length - 1; i >= 0; i -= 1) {
            const particle = this.activeParticles[i];
            particle.age += dt;

            if (particle.age >= particle.life) {
                this._deactivateParticleByIndex(i);
                if (particle.meshType === 'normal') {
                    normalChanged = true;
                } else {
                    additiveChanged = true;
                }
                continue;
            }

            const t = clamp01(particle.age / particle.life);
            const frameDrag = Math.max(0, 1 - particle.drag * dt) * dragMultiplier;

            particle.velocity.multiplyScalar(frameDrag);
            particle.velocity.y += particle.buoyancy * dt;
            this.tmpVecA.copy(particle.velocity).multiplyScalar(dt);
            const stepDistance = Math.hypot(this.tmpVecA.x, this.tmpVecA.y);
            particle.position.add(this.tmpVecA);
            particle.distanceTraveled = (particle.distanceTraveled ?? 0) + stepDistance;
            particle.rotation += particle.spin * dt;

            if (this._shouldCullParticleAgainstTerrain(particle)) {
                this._deactivateParticleByIndex(i);
                if (particle.meshType === 'normal') {
                    normalChanged = true;
                } else {
                    additiveChanged = true;
                }
                continue;
            }

            if (particle.type === PARTICLE_TYPE.FLAME) {
                this._updateFlameVisual(particle, t);
                additiveChanged = true;
                continue;
            }

            if (particle.type === PARTICLE_TYPE.EMBER) {
                this._updateEmberVisual(particle, t);
                additiveChanged = true;
                continue;
            }

            this._updateSmokeVisual(particle, t);
            normalChanged = true;
        }

        if (additiveChanged) {
            this._meshAdditive.instanceMatrix.needsUpdate = true;
            if (this._meshAdditive.instanceColor) {
                this._meshAdditive.instanceColor.needsUpdate = true;
            }
        }
        if (normalChanged) {
            this._meshNormal.instanceMatrix.needsUpdate = true;
            if (this._meshNormal.instanceColor) {
                this._meshNormal.instanceColor.needsUpdate = true;
            }
            this._smokeOpacityAttr.needsUpdate = true;
        }
    }

    _getFireball() {
        const fireball = this.freeFireballs.pop();
        if (!fireball) {
            return null;
        }

        this.activeFireballs.push(fireball);
        return fireball;
    }

    _updateFireballs(dt) {
        const fireballConfig = this.config.fireball;
        const terrain = this._getTerrainProvider();
        const surfaceEpsilon = Math.max(this.config?.combat?.flameSurfaceEpsilon ?? 0.01, 0.0001);

        for (let i = this.activeFireballs.length - 1; i >= 0; i -= 1) {
            const fireball = this.activeFireballs[i];
            fireball.age += dt;

            this.tmpVecB.copy(fireball.velocity).multiplyScalar(dt);
            const previousPosition = fireball.position.clone();
            const stepDistance = this.tmpVecB.length();

            if (terrain && stepDistance > 0.0001) {
                const travelDirection = new THREE.Vector2(this.tmpVecB.x, this.tmpVecB.y).normalize();
                let remainingDistance = stepDistance;
                let currentStart = new THREE.Vector2(previousPosition.x, previousPosition.y);

                const spawnClearance = this.config.fireball?.spawnClearance ?? 1.5;
                const hasLeftSpawnZone = fireball.distanceTraveled >= spawnClearance;
                if (hasLeftSpawnZone) {
                    const terrainHit = this._getTerrainRayHit(
                        { x: currentStart.x, y: currentStart.y },
                        remainingDistance,
                        { x: travelDirection.x, y: travelDirection.y }
                    );
                    if (terrainHit) {
                        fireball.position.set(terrainHit.point.x, terrainHit.point.y, fireball.position.z);
                        fireball.distanceTraveled += terrainHit.distance;
                        this.spawnFireballImpactEffect(fireball.position, terrainHit.normal);
                        this._spawnTerrainImpactDebugMarker(terrainHit.point);
                        this._deactivateFireballByIndex(i);
                        continue;
                    }
                }

                fireball.position.x += travelDirection.x * remainingDistance;
                fireball.position.y += travelDirection.y * remainingDistance;
                fireball.distanceTraveled += remainingDistance;
            } else {
                fireball.position.add(this.tmpVecB);
                fireball.distanceTraveled += this.tmpVecB.length();
            }

            // Max distance handling:
            // remove the projectile once it reaches its configured travel range.
            if (fireball.distanceTraveled >= fireball.maxDistance) {
                this._deactivateFireballByIndex(i);
                continue;
            }

            const fadeSpan = Math.max(0.0001, fireball.maxDistance - fireball.fadeStartDistance);
            const fadeRatio = clamp01((fireball.distanceTraveled - fireball.fadeStartDistance) / fadeSpan);
            // Fade out behavior:
            // keep brightness for most of the flight, then fade near the end.
            const fadeAlpha = 1 - fadeRatio;
            const flicker = 0.9 + Math.sin((fireball.age * 28) + fireball.flickerPhase) * 0.1;

            // Keep the core subtle so the swarm reads as many particles instead of one sprite.
            fireball.coreMaterial.opacity = fireballConfig.coreOpacity * fadeAlpha * flicker * 0.48;
            fireball.glowMaterial.opacity = fireballConfig.glowOpacity * fadeAlpha * 0.52;
            fireball.coreSprite.position.copy(fireball.position);
            fireball.glowSprite.position.copy(fireball.position);
            fireball.coreMaterial.rotation += dt * (0.28 + Math.sin(fireball.age * 3.1) * 0.12);
            fireball.glowMaterial.rotation += dt * (-0.22 + Math.cos(fireball.age * 2.4) * 0.1);

            // Cluster fragments around the core so the projectile reads as multiple particles.
            this.tmpVecA.set(-fireball.direction.y, fireball.direction.x, 0);
            if (this.tmpVecA.lengthSq() > 0.0001) {
                this.tmpVecA.normalize();
            } else {
                this.tmpVecA.set(0, 1, 0);
            }
            this.tmpVecB.copy(fireball.direction);
            this.tmpVecC.set(0, 0, 1);

            for (const fragment of fireball.fragments) {
                const phase = fireball.age * fireballConfig.fragmentOrbitSpeed * fragment.orbitSpeedMul + fragment.phaseOffset;
                const swirlX = Math.cos(phase * fragment.turbulenceFreqA) *
                    fireballConfig.fragmentSwirl *
                    fragment.turbulenceAmp *
                    fragment.swirlDirection;
                const swirlY = Math.sin(phase * fragment.turbulenceFreqB) *
                    fireballConfig.fragmentSwirl *
                    fragment.turbulenceAmp;
                const swirlZ = Math.sin(phase * 1.7 + fragment.phaseOffset) *
                    fireballConfig.fragmentSwirl *
                    0.22;

                fragment.localVelocity.x += swirlX * dt * 0.14;
                fragment.localVelocity.y += swirlY * dt * 0.14;
                fragment.localVelocity.z += swirlZ * dt * 0.12;

                // Keep fragments clustered around the fireball center while still chaotic.
                fragment.localVelocity.addScaledVector(
                    fragment.localOffset,
                    -fireballConfig.fragmentCenterPull * dt
                );

                const drag = Math.max(0, 1 - fireballConfig.fragmentDrag * dt);
                fragment.localVelocity.multiplyScalar(drag);
                fragment.localOffset.addScaledVector(fragment.localVelocity, dt);

                const maxRadius = fireballConfig.fragmentOrbitRadius *
                    fireballConfig.fragmentMaxRadiusMultiplier *
                    fragment.orbitRadiusMul;
                const planarLen = Math.hypot(fragment.localOffset.x, fragment.localOffset.y);
                if (planarLen > maxRadius && planarLen > 0.0001) {
                    const scale = maxRadius / planarLen;
                    fragment.localOffset.x *= scale;
                    fragment.localOffset.y *= scale;
                }
                fragment.localOffset.z = THREE.MathUtils.clamp(
                    fragment.localOffset.z,
                    -maxRadius * 0.55,
                    maxRadius * 0.55
                );

                fragment.sprite.position.copy(fireball.position);
                fragment.sprite.position.addScaledVector(this.tmpVecA, fragment.localOffset.x);
                fragment.sprite.position.addScaledVector(
                    this.tmpVecB,
                    fragment.localOffset.y * 0.72 + fragment.forwardBias * Math.sin(phase * 0.8) * 0.08
                );
                fragment.sprite.position.addScaledVector(
                    this.tmpVecC,
                    fragment.localOffset.z + fragment.zJitter * 0.5 + fragment.depthBias * Math.cos(phase * 1.3) * 0.04
                );

                const fragmentFlicker = 0.82 + Math.sin((fireball.age * 31) + fragment.phaseOffset) * 0.18;
                fragment.material.opacity = fireballConfig.fragmentOpacity * fadeAlpha * fragmentFlicker;
                fragment.material.rotation += dt * fragment.spinVelocity;

                const pulse = 1 + Math.sin(fireball.age * fragment.pulseSpeed + fragment.pulsePhase) * 0.18;
                const scaledSize = fragment.baseScale * pulse;
                fragment.sprite.scale.set(scaledSize, scaledSize, 1);
            }

            // Optional subtle trailing embers.
            const effectiveTrailRate = fireballConfig.emberTrailRate * (this.performanceProfile.fireballTrailRateMultiplier ?? 1);
            if (effectiveTrailRate > 0) {
                fireball.trailAccumulator += dt * effectiveTrailRate;
                const emberCount = Math.min(2, Math.floor(fireball.trailAccumulator));
                fireball.trailAccumulator -= emberCount;

                for (let emberIndex = 0; emberIndex < emberCount; emberIndex += 1) {
                    this._spawnFireballTrailEmber(fireball);
                }
            }
        }
    }

    _spawnFireballTrailEmber(fireball) {
        const particle = this._getParticle('additive');
        if (!particle) {
            return;
        }

        particle.type = PARTICLE_TYPE.EMBER;
        particle.age = 0;
        particle.life = randomRange(0.12, 0.24);
        particle.drag = randomRange(2.8, 4.2);
        particle.buoyancy = randomRange(0.1, 0.6);
        particle.rotation = randomRange(-Math.PI, Math.PI);
        particle.spin = randomRange(-2.2, 2.2);
        particle.core = false;
        const baseSize = randomRange(0.07, 0.13);
        particle.sizeStartX = baseSize;
        particle.sizeStartY = baseSize;
        particle.sizeEndX = baseSize * randomRange(0.18, 0.45);
        particle.sizeEndY = particle.sizeEndX;
        particle.alphaStart = randomRange(0.5, 0.85);
        particle.alphaEnd = 0;

        particle.position.copy(fireball.position);
        particle.position.y += randomRange(-0.08, 0.08);
        particle.position.z += randomRange(-0.1, 0.1);

        particle.velocity.copy(fireball.direction)
            .multiplyScalar(-randomRange(2.8, 5.2))
            .addScaledVector(fireball.velocity, 0.15);
        particle.velocity.y += randomRange(-0.25, 0.25);
        particle.velocity.z += randomRange(-0.35, 0.35);

        particle.colorR = 1;
        particle.colorG = 0.6;
        particle.colorB = 0.2;

        this._writeAdditiveInstance(particle, particle.sizeStartX, particle.sizeStartY, particle.alphaStart);
    }

    _updateFlameVisual(particle, t) {
        const bloom = Math.sin(t * Math.PI);
        const lifeFade = Math.pow(1 - t, 1.24);
        const flicker = 0.84 + Math.sin((particle.age * 42) + particle.flickerPhase) * 0.16;

        const sizeX = lerp(particle.sizeStartX * 0.85, particle.sizeEndX, t) * (0.82 + bloom * 0.6);
        const sizeY = lerp(particle.sizeStartY * 0.9, particle.sizeEndY, t) * (0.66 + bloom * 0.38);
        const opacity = particle.alphaStart * lifeFade * flicker;

        if (particle.core) {
            // Core particles keep a hotter white/yellow center before cooling.
            const cool = clamp01(t * 1.25);
            particle.colorR = 1;
            particle.colorG = lerp(1, 0.38, cool);
            particle.colorB = lerp(0.86, 0.05, cool);
        } else {
            const warmPhase = clamp01(t / 0.6);
            const coolPhase = clamp01((t - 0.5) / 0.5);
            particle.colorR = lerp(1, 0.92, coolPhase);
            particle.colorG = lerp(0.66, 0.2, warmPhase);
            particle.colorB = lerp(0.14, 0.02, coolPhase);
        }

        this._writeAdditiveInstance(particle, sizeX, sizeY, opacity);
    }

    _updateEmberVisual(particle, t) {
        const lifeFade = Math.pow(1 - t, 1.6);
        const sparkle = 0.78 + Math.sin((particle.age * 54) + particle.flickerPhase) * 0.22;
        const size = lerp(particle.sizeStartX, particle.sizeEndX, t);
        const opacity = particle.alphaStart * lifeFade * sparkle;

        particle.colorR = lerp(1, 0.78, t);
        particle.colorG = lerp(0.72, 0.1, t);
        particle.colorB = lerp(0.2, 0.02, t);

        this._writeAdditiveInstance(particle, size, size, opacity);
    }

    _updateSmokeVisual(particle, t) {
        const alphaRise = t < 0.35 ? t / 0.35 : 1;
        const alphaFade = Math.pow(1 - t, 1.5);
        const alpha = particle.alphaStart * alphaRise * alphaFade;
        const size = lerp(particle.sizeStartX, particle.sizeEndX, t);
        const gray = lerp(0.28, 0.12, t);

        particle.colorR = gray;
        particle.colorG = gray;
        particle.colorB = gray + 0.015;

        this._writeSmokeInstance(particle, size, size, alpha);
    }

    _getImpactParticle() {
        const impactParticle = this.freeImpactParticles.pop();
        if (!impactParticle) {
            return null;
        }

        if (this._freeImpactIndices.length === 0) {
            this.freeImpactParticles.push(impactParticle);
            return null;
        }

        impactParticle.instanceIndex = this._freeImpactIndices.pop();
        this.activeImpactParticles.push(impactParticle);
        return impactParticle;
    }

    _updateFireballImpactParticles(dt) {
        let impactChanged = false;

        for (let impactIndex = this.activeImpactParticles.length - 1; impactIndex >= 0; impactIndex -= 1) {
            const impactParticle = this.activeImpactParticles[impactIndex];
            impactParticle.age += dt;

            if (impactParticle.age >= impactParticle.life) {
                this._deactivateImpactParticleByIndex(impactIndex);
                impactChanged = true;
                continue;
            }

            const progress = clamp01(impactParticle.age / Math.max(impactParticle.life, 0.0001));
            const frameDrag = Math.max(0, 1 - (impactParticle.drag * dt));
            impactParticle.velocity.multiplyScalar(frameDrag);
            impactParticle.velocity.y -= impactParticle.gravity * dt;
            impactParticle.position.addScaledVector(impactParticle.velocity, dt);
            impactParticle.rotation += impactParticle.spin * dt;

            const scale = lerp(impactParticle.baseScale, impactParticle.endScale, progress);

            // Impact particles stay bright at first and fade fast near the end.
            const fade = progress < 0.65
                ? 1
                : (1 - ((progress - 0.65) / 0.35));
            const opacity = 0.92 * Math.max(fade, 0);

            this._writeImpactInstance(impactParticle, scale, opacity);
            impactChanged = true;
        }

        if (impactChanged) {
            this._meshImpact.instanceMatrix.needsUpdate = true;
            if (this._meshImpact.instanceColor) {
                this._meshImpact.instanceColor.needsUpdate = true;
            }
        }
    }

    _updateLight(dt) {
        if (this.performanceProfile.pointLightEnabled === false) {
            this.pointLight.visible = false;
            this.pointLight.intensity = 0;
            return;
        }
        this.pointLight.position.copy(this.anchorPosition).addScaledVector(this.forwardDirection, 0.25);
        this.pointLight.visible = true;

        const hasActiveFire = this.state === 'burst' || this.state === 'continuous';
        const hasParticles = this.activeParticles.length > 0;
        const hasFireballs = this.activeFireballs.length > 0;
        const shouldBeLit = hasActiveFire || hasParticles || hasFireballs;

        if (!shouldBeLit) {
            this.pointLight.visible = false;
            this.pointLight.intensity = 0;
            return;
        }

        let targetIntensity = this.config.light.intensity * 0.36;
        if (this.state === 'burst') {
            const burstRatio = this.config.burst.duration > 0
                ? this.burstTimeLeft / this.config.burst.duration
                : 0;
            targetIntensity = this.config.light.intensity * lerp(1.4, 0.6, 1 - burstRatio);
        } else if (this.state === 'continuous') {
            const rampRatio = this.config.continuous.rampDuration > 0
                ? this.continuousTime / this.config.continuous.rampDuration
                : 1;
            const ramp = easeOutCubic(rampRatio);
            targetIntensity = this.config.light.intensity * lerp(0.35, 1.28, ramp);
        }

        this.lightFlickerTime += dt * 47;
        const flicker = 1 + Math.sin(this.lightFlickerTime) * this.config.light.flicker;
        const desired = Math.max(0, targetIntensity * flicker);
        const alpha = Math.min(1, this.config.light.smoothness * dt);

        this.pointLight.intensity = lerp(this.pointLight.intensity, desired, alpha);
    }

    _deactivateParticleByIndex(index) {
        const particle = this.activeParticles[index];
        this._deactivateParticleByRef(particle);

        const lastIndex = this.activeParticles.length - 1;
        if (index !== lastIndex) {
            this.activeParticles[index] = this.activeParticles[lastIndex];
        }
        this.activeParticles.pop();
    }

    _deactivateParticleByRef(particle) {
        const idx = particle.instanceIndex;
        if (idx >= 0) {
            // Zero out the instance transform to hide it
            const mesh = particle.meshType === 'normal' ? this._meshNormal : this._meshAdditive;
            if (mesh) {
                mesh.setMatrixAt(idx, this._zeroMatrix);
                // Zero out color (additive = invisible black, normal opacity attr also zeroed below)
                this._color.setRGB(0, 0, 0);
                mesh.setColorAt(idx, this._color);
            }
            if (particle.meshType === 'normal' && this._smokeOpacityAttr) {
                this._smokeOpacityAttr.setX(idx, 0);
            }
            // Return the slot index to the appropriate free list
            if (particle.meshType === 'normal') {
                this._freeNormalIndices.push(idx);
            } else {
                this._freeAdditiveIndices.push(idx);
            }
            particle.instanceIndex = -1;
        }
        this.freeParticles.push(particle);
    }

    _deactivateImpactParticleByIndex(index) {
        const impactParticle = this.activeImpactParticles[index];
        this._deactivateImpactParticleByRef(impactParticle);

        const lastIndex = this.activeImpactParticles.length - 1;
        if (index !== lastIndex) {
            this.activeImpactParticles[index] = this.activeImpactParticles[lastIndex];
        }
        this.activeImpactParticles.pop();
    }

    _deactivateImpactParticleByRef(impactParticle) {
        const idx = impactParticle.instanceIndex;
        if (idx >= 0) {
            if (this._meshImpact) {
                this._meshImpact.setMatrixAt(idx, this._zeroMatrix);
                this._color.setRGB(0, 0, 0);
                this._meshImpact.setColorAt(idx, this._color);
            }
            this._freeImpactIndices.push(idx);
            impactParticle.instanceIndex = -1;
        }
        this.freeImpactParticles.push(impactParticle);
    }

    _deactivateFireballByIndex(index) {
        const fireball = this.activeFireballs[index];
        this._deactivateFireballByRef(fireball);

        const lastIndex = this.activeFireballs.length - 1;
        if (index !== lastIndex) {
            this.activeFireballs[index] = this.activeFireballs[lastIndex];
        }
        this.activeFireballs.pop();
    }

    _deactivateFireballByRef(fireball) {
        fireball.id = null;
        fireball.ignoreTerrainUntilExit = false;
        fireball.coreSprite.visible = false;
        fireball.glowSprite.visible = false;
        fireball.coreMaterial.opacity = 0;
        fireball.glowMaterial.opacity = 0;
        for (const fragment of fireball.fragments) {
            fragment.sprite.visible = false;
            fragment.material.opacity = 0;
        }
        this.freeFireballs.push(fireball);
    }

    _refreshTerrainBlockingState() {
        this.fireOriginInsideBlockingTerrain = false;
        this.continuousFlameMaxDistance = Number.POSITIVE_INFINITY;
        this.continuousFlameBlockedByTerrain = false;
        this.continuousFlameHitboxMaxDistance = Number.POSITIVE_INFINITY;

        if (this.terrainChecksEnabled !== true) {
            return;
        }

        const terrain = this._getTerrainProvider();
        if (!terrain) {
            return;
        }

        const sourcePoint = { x: this.anchorPosition.x, y: this.anchorPosition.y };
        if (
            this.config?.combat?.blockFireInsideStaticPolygons === true &&
            this._isPointInsideFireBlockingTerrain(sourcePoint) === true
        ) {
            this.fireOriginInsideBlockingTerrain = true;
            this.continuousFlameMaxDistance = 0;
            this.continuousFlameHitboxMaxDistance = 0;
            return;
        }

        if (this.config?.combat?.clipFlameToStaticPolygons !== true) {
            return;
        }

        const flameHitboxForwardOffset = Number.isFinite(this.config?.combat?.flameHitboxForwardOffset)
            ? this.config.combat.flameHitboxForwardOffset
            : 0;
        const maxRange = Math.max(
            this.currentSpawnForwardDistance + Math.max(this.config.longFlameLength ?? 0, this.config.normalFlameLength ?? 0),
            flameHitboxForwardOffset + Math.max(this.config?.combat?.flameHitboxLength ?? 0, 0)
        );
        const terrainHit = this._getTerrainRayHit(sourcePoint, maxRange);
        if (!terrainHit) {
            return;
        }

        const surfaceEpsilon = Math.max(this.config?.combat?.flameSurfaceEpsilon ?? 0.01, 0.0001);
        this.continuousFlameBlockedByTerrain = true;
        this.continuousFlameMaxDistance = Math.max(
            0,
            terrainHit.distance - this.currentSpawnForwardDistance - surfaceEpsilon
        );
        this.continuousFlameHitboxMaxDistance = Math.max(
            0,
            terrainHit.distance - flameHitboxForwardOffset - surfaceEpsilon
        );
    }

    _getTerrainRayHit(start, maxDistance, directionOverride = null) {
        if (this.terrainChecksEnabled !== true) {
            return null;
        }

        const terrain = this._getTerrainProvider();
        if (!terrain || !start || !Number.isFinite(start.x) || !Number.isFinite(start.y)) {
            return null;
        }

        const direction = directionOverride && Number.isFinite(directionOverride.x) && Number.isFinite(directionOverride.y)
            ? directionOverride
            : { x: this.flameDirection.x, y: this.flameDirection.y };

        const rayOptions = {
            includeBottomEdges: false,
            // Skip only the authored fly-through polygons. All other polygons keep their
            // normal fire/flame blocking behavior.
            edgeFilter: (edge) => edge?.regionType !== 'fly_through'
        };

        return terrain.findNearestRayTerrainHit?.(
            start,
            direction,
            Math.max(0, maxDistance || 0),
            rayOptions
        );
    }

    _isPointInsideFireBlockingTerrain(point) {
        if (this.terrainChecksEnabled !== true) {
            return false;
        }

        const terrain = this._getTerrainProvider();
        if (!terrain || !point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) {
            return false;
        }

        // Fire/flame suppression ignores only authored fly-through polygons.
        // Everything else should keep using the full polygon test.
        if (terrain.isPointInsideBlockingCollisionPolygon?.(point, { excludeTypes: ['fly_through'] }) === true) {
            return true;
        }

        if (terrain.getCollisionPolygonRegionContainingPoint?.(point, { excludeTypes: ['fly_through'] })) {
            return true;
        }

        return false;
    }

    _getSpawnedFlameTravelLimit() {
        if (this.config?.combat?.clipFlameToStaticPolygons !== true) {
            return Number.POSITIVE_INFINITY;
        }
        if (!this.continuousFlameBlockedByTerrain || !Number.isFinite(this.continuousFlameMaxDistance)) {
            return Number.POSITIVE_INFINITY;
        }
        return Math.max(0, this.continuousFlameMaxDistance);
    }

    _setParticleTerrainTravelLimit(particle) {
        if (!particle) {
            return false;
        }

        particle.maxTravelDistance = Number.POSITIVE_INFINITY;
        if (this.config?.combat?.clipFlameToStaticPolygons !== true) {
            return true;
        }

        const velocityLenSq = (particle.velocity?.x ?? 0) * (particle.velocity?.x ?? 0) +
            (particle.velocity?.y ?? 0) * (particle.velocity?.y ?? 0);
        if (velocityLenSq <= 0.0001) {
            return true;
        }

        const direction = {
            x: particle.velocity.x / Math.sqrt(velocityLenSq),
            y: particle.velocity.y / Math.sqrt(velocityLenSq)
        };
        const maxRange = this._getSpawnedFlameTravelLimit();
        if (!Number.isFinite(maxRange)) {
            return true;
        }

        const terrainHit = this._getTerrainRayHit(
            { x: particle.position.x, y: particle.position.y },
            maxRange,
            direction
        );
        if (!terrainHit) {
            particle.maxTravelDistance = Number.POSITIVE_INFINITY;
            return true;
        }

        const surfaceEpsilon = Math.max(this.config?.combat?.flameSurfaceEpsilon ?? 0.01, 0.0001);
        particle.maxTravelDistance = Math.max(0, terrainHit.distance - surfaceEpsilon);
        return particle.maxTravelDistance > 0.001;
    }

    _shouldCullParticleAgainstTerrain(particle) {
        if (!particle || this.config?.combat?.clipFlameToStaticPolygons !== true) {
            return false;
        }

        if (this._isPointInsideFireBlockingTerrain({ x: particle.position.x, y: particle.position.y }) === true) {
            return true;
        }

        if (
            particle.type !== PARTICLE_TYPE.FLAME &&
            particle.type !== PARTICLE_TYPE.EMBER &&
            particle.type !== PARTICLE_TYPE.SMOKE
        ) {
            return false;
        }

        if (!Number.isFinite(particle.maxTravelDistance)) {
            return false;
        }
        return (particle.distanceTraveled ?? 0) >= particle.maxTravelDistance;
    }
}
