import {ResourceValidationResult} from "./ResourceValidationResult";
import {Value} from "./Value";

const _name = new WeakMap();
const _location = new WeakMap();

export class Resource
{
    constructor() {
        _name.set(this, new Value());
        _location.set(this, new Value());
    }
    
    validate() {
        let result = new ResourceValidationResult();
        this._handleValidation(result);
        return result;
    }
    
    _handleValidation(validationResult) {
    } 
    
    get descriptor() {
        return {};
    }
    
    get name() {
        return _name.get(this);
    }
    
    get location() {
        return _location.get(this);
    }    
    
    withName(name) {
        this.name.set(name);
        return this;    
    }
    
    locatedAt(location) {
        this.location.set(location);
        return this;
    }
    
}
