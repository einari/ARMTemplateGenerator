import {Parameter} from "./Parameter";

import {StorageAccount} from "./StorageAccount";
import {NetworkInterface} from "./NetworkInterface";
import {VirtualMachine} from "./VirtualMachine";

const _parameters = new WeakMap();
const _arguments = new WeakMap();
const _resources = new WeakMap(); 

export class Template
{
    constructor() {
        _resources.set(this,[]);
        _parameters.set(this,[]);
    }
    
    get resources() {
        return _resources.get(this);
    }
    
    get parameters() {
        return _parameters.get(this);
    }
    
    generate() {
        let template = {
            "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
            "contentVersion": "1.0.0.0",
            "parameters": {},
            "variables": {},
            "resources": [],
            "outputs": {}     
        };
        
        this.parameters.forEach(parameter => {
            parameter.mergeTo(template.parameters);            
        });
        
        this.resources.forEach(resource => {
            let validationResult = resource.validate(); 
            
            if( !validationResult.isValid ) {
                console.log(validationResult.errorMessage)
                return;
            }
            
            template.resources.push(resource.descriptor);
        });
        
        return template;
    }
    
    addResource(resource) {
        this.resources.push(resource);
    }
    
    parameter(name, type, descriptor, continuationCallback) {
        var parameter = new Parameter(name, type, descriptor);
        this.parameters.push(parameter);
        if( continuationCallback ) continuationCallback(parameter);
        return this;
    }
    
    storageAccount() {
        var account = new StorageAccount();
        this.addResource(account);
        return this;
    }
    
    networkInterface() {
        var networkInterface = new NetworkInterface();
        this.addResource(resource);
        return this;
    }
    
    virtualMachine() {
        var virtualMachine = new VirtualMachine();
        this.addResource(virtualMachine);
        return this;
    }
}