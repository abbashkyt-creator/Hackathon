class Gradient {

    keyframes;

    constructor(keyframes) {
        this.keyframes = keyframes;
    }

    evaluate(value) {
        value = clamp(value, 0, 1);
        var prevKeyframe = this.keyframes.where(x => x.value <= value).orderByDescending(x => x.value)[0];
        var nextKeyframe = this.keyframes.where(x => x.value >= value).orderBy(x => x.value)[0];
        var i = value.inverseLerp(prevKeyframe.value, nextKeyframe.value);
        if (prevKeyframe.value === nextKeyframe.value) i = 0.5;
        return i.lerpColour(prevKeyframe.colour, nextKeyframe.colour);
    }

}