
const _value = new WeakMap();

export class Value
{
    constructor() {
        _value.set(this, "");
    }
    
    get get() {
        return _value.get(this);
    }
    
    set set(value) {
        _value.set(this, value);
    }
}