import {ValueCanBeReferenced} from "./ValueCanBeReferenced";

const _name = new WeakMap();
const _value = new WeakMap();

export class Parameter extends ValueCanBeReferenced
{
    constructor(name, type, description) {
        super();
        
        _name.set(this, name);
        _value.set(this, type);
    }
 
    get name() {
        return _name.get(this);
    }
    
    get value() {
        return _type.get(this);
    }
 
    mergeTo(template) {
        template[this.name] = this.asValue;
    }
    
    get asValueReference() {
        return "[variables('this.name')]";
    }
}