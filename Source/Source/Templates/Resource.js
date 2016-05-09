import {ResourceValidationResult} from "./ResourceValidationResult";

export class Resource
{
    constructor() {
        this.name = "";
        this.type = "";
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
}
