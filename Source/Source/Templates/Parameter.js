const _name = new WeakMap();
const _type = new WeakMap();
const _description = new WeakMap();

const _defaultValue = new WeakMap();
const _allowedValues = new WeakMap();

export class Parameter
{
    constructor(name, type, description) {
        _name.set(this, name);
        _type.set(this, type);
        _description.set(this, description);
        
        _defaultValue.set(this, "");
        _allowedValues.set(this, []);
    }
 
    get name() {
        return _name.get(this);
    }
    
    get type() {
        return _type.get(this);
    }
 
    get description() {
        return _description.get(this);
    }
    
    get defaultValue() {
        return _defaultValue.get(this);
    }
    
    get allowedValues() {
        return _allowedValues.get(this);
    }
    
    get descriptor() {
        var property = {
            type: "",
            metadata: {}
        };
        
        property.type = this.type;
        property.metadata.description = this.description;

        
        if( this.allowedValues && this.allowedValues.length > 0 ) {
            property.allowedValues = this.allowedValues;
            
            if( this.defaultValue && this.defaultValue != "" ) {
                property.defaultValue = this.defaultValue;
            }
        }
        
        
        return property;
    }
    
    mergeTo(template) {
        template[this.name] = this.descriptor;
    }
    
    get asValue() {
        return "[variables('this.name')]";
    }
}