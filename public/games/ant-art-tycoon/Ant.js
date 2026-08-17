class Ant extends Phaser.GameObjects.Image {

    states = {
        idle: 1,
        headingToPaint: 2,
        headingToPicture: 3,
        turningTowardsPicture: 4,
        turningTowardsPaint: 5
    };

    colours = [
        new Color(0, 0, 0),
        new Color(178, 0, 0),
        new Color(178, 0, 178),
        new Color(0, 0, 255),
        new Color(0, 255, 0),
        new Color(255, 234, 4),
        new Color(128, 128, 128),
        new Color(0, 255, 255),
        new Color(255, 178, 0)
    ];

    target;
    level = 0;
    state;
    houseOffset;
    done = true;
    antId;
    moving = true;

    constructor(scene, level, id) {
        let texture = level === 0 ? "ant" : "ant-white";
        let x = scene.houseLocation.x;
        let y = scene.houseLocation.y;
        super(scene, x, y, texture);
        if (level > 0) {
            this.tint = getColour(this.colours[level]);
        }
        this.state = this.states.idle;
        this.scale = 0.7;
        this.level = level;
        this.antId = id;
        this.houseOffset = randomInCircle(50);// new Vector2(randomRange(-50, 50), randomRange(-50, 50));
        this.x += this.houseOffset.x;
        this.y += this.houseOffset.y;
        this.setDepth(1);
    }

    reset() {
        this.headingToFirstPaint = true;
        this.state = this.states.idle;
        this.done = false;
        this.moving = false;
    }


    getSpeed(delta) {
        return delta / 45 * this.scene.antSpeed * (1 + this.level) * saveData.saveProfile.antSpeedMultipliers[this.level];
    }

    updateWorking(time, delta) {
        var speed = this.getSpeed(delta);
        var paints = this.scene.paints;


        this.i += delta / 1000;

        speed *= saveData.saveProfile.antSpeedMultipliers[this.level];
        if (this.headingToFirstPaint) speed *= saveData.saveProfile.studio.commuteSpeed;
        if (saveData.saveProfile.speedBoostTimeLeft > 0) {
            speed *= 2;
            //if (this.antId < 10) print("DOUBLE SPEED - " + saveData.saveProfile.speedBoostTimeLeft);
        }

        if (this.done) {
            return;
        }

        if (this.state === this.states.idle) {
            if (this.scene.currentPixels.count(x => x.available) === 0) {
                this.done = true;
            } else {
                var pixel = this.scene.currentPixels.where(x => x.available).random();
                pixel.available = false;
                this.target = pixel;
                this.state = this.states.turningTowardsPaint;
            }
        }

        if (this.state === this.states.turningTowardsPaint) {
            var paint = this.scene.paints.find(x => x.colour.rgba === this.target.colour.rgba);

            if (paint === undefined) {
                this.state = this.states.idle;
                return;
            }

            var targetAngle = Math.atan2(paint.y - this.y, paint.x - this.x);
            if (this.rotation.deltaAngleRad(targetAngle).abs() > 15 * (delta / 1000) * this.scene.antSpeed) {
                this.rotation += this.rotation.deltaAngleRad(targetAngle).sign() * 15 * (delta / 1000) * this.scene.antSpeed;
            } else {
                this.rotation = targetAngle;
                this.state = this.states.headingToPaint;
            }
        }

        if (this.state === this.states.headingToPaint) {
            saveData.saveProfile.antDistanceWalked += speed;
            var paint = this.scene.paints.find(x => x.colour.rgba === this.target.colour.rgba);

            if (paint === undefined) {
                this.state = this.states.idle;
                return;
            }

            var distance = new Vector2(paint.x - this.x, paint.y - this.y);

            this.setAntRotation(distance, this.antId, time);
            if (distance.magnitude() > speed) {
                var movement = distance.setLength(speed);
                this.x += movement.x;
                this.y += movement.y;
            } else {
                this.x = paint.x;
                this.y = paint.y;
                this.state = this.states.turningTowardsPicture;
                this.headingToFirstPaint = false;
            }
        }

        if (this.state === this.states.turningTowardsPicture) {
            var targetPos = this.scene.pixelToWorldPoint(this.target.x, this.target.y);
            var targetAngle = Math.atan2(targetPos.y - this.y, targetPos.x - this.x);
            if (this.rotation.deltaAngleRad(targetAngle).abs() > 15 * (delta / 1000) * this.scene.antSpeed) {
                this.rotation += this.rotation.deltaAngleRad(targetAngle).sign() * 15 * (delta / 1000) * this.scene.antSpeed;
            } else {
                this.rotation = targetAngle;
                this.state = this.states.headingToPicture;
            }
        }

        if (this.state === this.states.headingToPicture) {
            saveData.saveProfile.antDistanceWalked += speed;
            var targetPosition = this.scene.pixelToWorldPoint(this.target.x, this.target.y);
            var distance = new Vector2(targetPosition.x - this.x, targetPosition.y - this.y);
            this.setAntRotation(distance, this.antId, time);
            if (distance.magnitude() > speed) {
                var movement = distance.setLength(speed);
                this.x += movement.x;
                this.y += movement.y;
            } else {
                this.target.painted = true;
                this.x = targetPosition.x;
                this.y = targetPosition.y;
                this.state = this.states.idle;
                this.scene.paint(this.target, this.scene.canvas, this.scene.pictureSize);
                //instance.statCollector.AddPixel();
            }
        }
    }

    updateFinished(time, delta) {
        var speed = this.getSpeed(delta);
        speed *= saveData.saveProfile.studio.commuteSpeed;
        if (saveData.saveProfile.speedBoostTimeLeft > 0) {
            speed *= 2;
            //if (this.antId < 10) print("DOUBLE SPEED - " + saveData.saveProfile.speedBoostTimeLeft);
        }
        var targetPosition = new Vector2(this.scene.houseLocation.x + this.houseOffset.x, this.scene.houseLocation.y + this.houseOffset.y);
        var distance = new Vector2(targetPosition.x - this.x, targetPosition.y - this.y);

        this.setAntRotation(distance, this.antId, time);
        if (distance.magnitude() > speed) {
            var movement = distance.setLength(speed);
            this.x += movement.x;
            this.y += movement.y;
            this.moving = true;
        } else {
            this.moving = false;
            this.headingToFirstPaint = true;
        }
    }


    setAntRotation(distance, seed, time) {
        var extra = 0.2 * Math.sin(time / 30 + seed * 1000);
        this.rotation = (extra + Math.atan2(distance.y, distance.x));
    }

}