const _source = new WeakMap();
const _property = new WeakMap();
const _error = new WeakMap();

export class InvalidProperty
{
    constructor(source, property, error) {
        _source.set(this, source);
        _property.set(this, property);
        _error.set(this, error);
    }
    
    get source() {
        return _source.get(this);
    }
    
    get property() {
        return _property.get(this);
    }
    
    get error() {
        return _error.get(this);
    }
    
    get message() {
        return `Property "${this.property.name}" in "${this.source.name}" (type: ${this.source.type}) is wrong. Error: ${this.error}`
    }
}