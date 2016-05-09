import {InvalidProperty} from "./InvalidProperty";

const _invalidProperties = new WeakMap();

export class ResourceValidationResult
{
    constructor() {
        _invalidProperties.set(this,[]);
    }
    
    get invalidProperties() {
        return _invalidProperties.get(this);
    }
    
    get isValid() {
        if( this.invalidProperties.length > 0 ) {
            return false;
        }
    }
    
    get errorMessage() {
        let errorMessage = "";
        if( invalidProperties.length > 0 ) {
            invalidProperties.forEach(property => {
                errorMessage += property.message+"\n";
            });
        }
    }
}