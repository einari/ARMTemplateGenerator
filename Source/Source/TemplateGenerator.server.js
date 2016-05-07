import fs from "fs";
import path from "path";
import request from "request";

const templatesFolder = "./temp_data";

let getFileNameFor = (template) => {
    let fileName = `${templatesFolder}/${template.id}.json`;
    return fileName;
};

let getEncodedUriFor = (template) => {
    let uri = encodeURIComponent(`http://armtemplategenerator.azurewebsites.net/templategenerator/get?id=${template.id}`);
    return uri;
};

let handleTemplate = (template) => {
    let promise = new Promise((fulfill, reject) => {
        console.log(`Handle ${JSON.stringify(template)}`);
        let templateGenerator = new TemplateGenerator();
        templateGenerator.generate(template).then((generatedTemplate) => {
            fulfill(generatedTemplate);
        });
    });
    return promise;
};



export class TemplateGenerator {
    static initialize(application) {

        application.get("/templategenerator/get", (request, response) => {
            let fileName = getFileNameFor({ id: request.query.id });
            let absolutePath = path.resolve(fileName);
            response.sendFile(absolutePath);
        });

        application.post("/templategenerator/generate", (request, response) => {
            let content = "";

            request.on("data", (data) => {
                content += data;
            });

            request.on("end", () => {
                let template = JSON.parse(content);
                handleTemplate(template).then(result => {
                    response.json(json);
                });
            });
        });

        application.post("/templategenerator/download", (request, response) => {
            console.log(`Download ${request.body.template}`);
            let template = JSON.parse(request.body.template);

            handleTemplate(template).then(generatedTemplate => {
                response.sendFile(generatedTemplate.absolutePath);
            });
        });

        application.post("/templategenerator/deploy", (request, response) => {
            console.log(`Deploy ${request.body.template}`);
            let template = JSON.parse(request.body.template);

            handleTemplate(template).then(generatedTemplate => {
                let uri = getEncodedUriFor(template);
                response.redirect(`https://portal.azure.com/#create/Microsoft.Template/uri/${uri}`);
            });
        });


        application.post("/templategenerator/visualize", (request, response) => {
            console.log(`Deploy ${request.body.template}`);
            let template = JSON.parse(request.body.template);

            handleTemplate(template).then(generatedTemplate => {
                let uri = getEncodedUriFor(template);
                response.redirect(`http://armviz.io/#/?load=${uri}`);
            });
        });
    }

    generate(template) {
        console.log(`Generate for ${template.id}`)
        let promise = new Promise((fulfill, reject) => {

            // https://github.com/Azure/azure-resource-manager-schemas
            // https://azure.microsoft.com/en-us/documentation/articles/resource-group-authoring-templates/
            // https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-windows-multiple-vms/
            // https://azure.microsoft.com/en-us/documentation/articles/resource-group-create-multiple/
            // https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Compute.json
            // https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-cli-deploy-templates/
            // https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-cli-deploy-templates/#deploy-a-multi-vm-application-that-uses-a-virtual-network-and-an-external-load-balancer
            // https://github.com/Azure/azure-quickstart-templates/blob/master/memcached-multi-vm-ubuntu/azuredeploy.json


            let outputTemplate = {
                "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
                "contentVersion": "1.0.0.0",
                "parameters": {
                    "adminUsername": {
                        "type": "string",
                        "metadata": {
                            "description": "User name for the Virtual Machine."
                        }
                    },
                    "adminPassword": {
                        "type": "securestring",
                        "metadata": {
                            "description": "Password for the Virtual Machine."
                        }
                    },
                    "dnsLabelPrefix": {
                        "type": "string",
                        "metadata": {
                            "description": "Unique DNS Name for the Public IP used to access the Virtual Machine."
                        }
                    },
                    /*
                    "ubuntuOSVersion": {
                        "type": "string",
                        "defaultValue": "14.04.2-LTS",
                        "allowedValues": [
                            "12.04.5-LTS",
                            "14.04.2-LTS",
                            "15.10"
                        ],
                        "metadata": {
                            "description": "The Ubuntu version for the VM. This will pick a fully patched image of this given Ubuntu version. Allowed values: 12.04.5-LTS, 14.04.2-LTS, 15.10."
                        }
                    }*/
                },
                "variables": {
                    "storageAccountName": "[concat(uniquestring(resourceGroup().id), 'salinuxvm')]",
                    "dataDisk1VhdName": "datadisk1",
                    "imagePublisher": "Canonical",
                    "imageOffer": "UbuntuServer",
                    "OSDiskName": "osdiskforlinuxsimple",
                    "nicName": "myVMNic",
                    "addressPrefix": "10.0.0.0/16",
                    "subnetName": "Subnet",
                    "subnetPrefix": "10.0.0.0/24",
                    "storageAccountType": "Standard_LRS",
                    "publicIPAddressName": "myPublicIP",
                    "publicIPAddressType": "Dynamic",
                    "vmStorageAccountContainerName": "vhds",
                    "vmName": "MyUbuntuVM",
                    "vmSize": "Standard_D1",
                    "virtualNetworkName": "MyVNET",
                    "vnetID": "[resourceId('Microsoft.Network/virtualNetworks',variables('virtualNetworkName'))]",
                    "subnetRef": "[concat(variables('vnetID'),'/subnets/',variables('subnetName'))]",
                    "apiVersion": "2015-06-15"
                },

                "resources": [
                    {
                        "type": "Microsoft.Storage/storageAccounts",
                        "name": "[variables('storageAccountName')]",
                        "apiVersion": "[variables('apiVersion')]",
                        "location": "[resourceGroup().location]",
                        "properties": {
                            "accountType": "[variables('storageAccountType')]"
                        }
                    },
                    {
                        "apiVersion": "[variables('apiVersion')]",
                        "type": "Microsoft.Network/publicIPAddresses",
                        "name": "[variables('publicIPAddressName')]",
                        "location": "[resourceGroup().location]",
                        "properties": {
                            "publicIPAllocationMethod": "[variables('publicIPAddressType')]",
                            "dnsSettings": {
                                "domainNameLabel": "[parameters('dnsLabelPrefix')]"
                            }
                        }
                    },
                    {
                        "apiVersion": "[variables('apiVersion')]",
                        "type": "Microsoft.Network/virtualNetworks",
                        "name": "[variables('virtualNetworkName')]",
                        "location": "[resourceGroup().location]",
                        "properties": {
                            "addressSpace": {
                                "addressPrefixes": [
                                    "[variables('addressPrefix')]"
                                ]
                            },
                            "subnets": [
                                {
                                    "name": "[variables('subnetName')]",
                                    "properties": {
                                        "addressPrefix": "[variables('subnetPrefix')]"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "apiVersion": "[variables('apiVersion')]",
                        "type": "Microsoft.Network/networkInterfaces",
                        "name": "[variables('nicName')]",
                        "location": "[resourceGroup().location]",
                        "dependsOn": [
                            "[concat('Microsoft.Network/publicIPAddresses/', variables('publicIPAddressName'))]",
                            "[concat('Microsoft.Network/virtualNetworks/', variables('virtualNetworkName'))]"
                        ],
                        "properties": {
                            "ipConfigurations": [
                                {
                                    "name": "ipconfig1",
                                    "properties": {
                                        "privateIPAllocationMethod": "Dynamic",
                                        "publicIPAddress": {
                                            "id": "[resourceId('Microsoft.Network/publicIPAddresses',variables('publicIPAddressName'))]"
                                        },
                                        "subnet": {
                                            "id": "[variables('subnetRef')]"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                ],
                "outputs": {
                }
            };
            
            console.log("Handle resources");

            var resourcesAdded = new Promise((resourcesAddedFulfill, resourceAddedReject) => {
                console.log(`Total resources are ${resourceCount}`);
                
                let resourceCount = template.content.length;
                if( resourceCount == 0 ) {
                    resourcesAddedFulfill();
                    return;
                }
                
                
                
                template.content.forEach((resource, resourceIndex) => {
                    console.log("Resource");
                    
                    if( resource.artifacts.length == 0 ) resourceCount--;
                    if( resourceCount <= 0 ) {
                        console.log("  No resources");
                        resourcesAddedFulfill();
                        return;
                    }
                    
                    resource.artifacts.forEach(artifact => {
                        console.log("Artifact : " + artifact.name);
                        if (artifact.name == "createuidefinition") {
                            console.log(`Get UI Definition from ${artifact.uri}`);
                            request(artifact.uri, (error, response, body) => {
                                console.log(`Result from getting UI Definition ${response.statusCode}`)
                                if (!error && response.statusCode == 200) {
                                    var uidefinition = JSON.parse(body);
                                    console.log(uidefinition);
                                    let name = `${uidefinition.parameters.imageReference.offer}_resource${resourceIndex}`;
                                    
                                    console.log(`Resource name is '${name}'`);

                                    outputTemplate.resources.push({
                                        "apiVersion": "[variables('apiVersion')]",
                                        "type": "Microsoft.Compute/virtualMachines",
                                        "name": name,
                                        "location": "[resourceGroup().location]",
                                        "dependsOn": [
                                            "[concat('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]",
                                            "[concat('Microsoft.Network/networkInterfaces/', variables('nicName'))]"
                                        ],
                                        "properties": {
                                            "hardwareProfile": {
                                                "vmSize": "[variables('vmSize')]"
                                            },
                                            "osProfile": {
                                                "computerName": name,
                                                "adminUsername": "[parameters('adminUsername')]",
                                                "adminPassword": "[parameters('adminPassword')]"
                                            },
                                            "storageProfile": {
                                                "imageReference": {
                                                    "publisher": uidefinition.parameters.imageReference.publisher,
                                                    "offer": uidefinition.parameters.imageReference.offer,
                                                    "sku": uidefinition.parameters.imageReference.sku,
                                                    "version": "latest"
                                                },
                                                "osDisk": {
                                                    "name": "osdisk",
                                                    "vhd": {
                                                        "uri": "[concat('http://',variables('storageAccountName'),'.blob.core.windows.net/',variables('vmStorageAccountContainerName'),'/',variables('OSDiskName'),'.vhd')]"
                                                    },
                                                    "caching": "ReadWrite",
                                                    "createOption": "FromImage"
                                                },
                                                "dataDisks": [
                                                    {
                                                        "name": "datadisk1",
                                                        "diskSizeGB": "100",
                                                        "lun": 0,
                                                        "vhd": {
                                                            "uri": "[concat('http://',variables('storageAccountName'),'.blob.core.windows.net/',variables('vmStorageAccountContainerName'),'/',variables('dataDisk1VhdName'),'.vhd')]"
                                                        },
                                                        "createOption": "Empty"
                                                    }
                                                ]
                                            },
                                            "networkProfile": {
                                                "networkInterfaces": [
                                                    {
                                                        "id": "[resourceId('Microsoft.Network/networkInterfaces',variables('nicName'))]"
                                                    }
                                                ]
                                            },
                                            "diagnosticsProfile": {
                                                "bootDiagnostics": {
                                                    "enabled": "true",
                                                    "storageUri": "[concat('http://',variables('storageAccountName'),'.blob.core.windows.net')]"
                                                }
                                            }
                                        }
                                    });
                                }
                                
                                resourceCount--;
                                console.log(`Resources added, ${resourceCount} left`);
                                
                                if( resourceCount == 0 ) resourcesAddedFulfill();
                            });
                        }
                    });
                });
            });

            resourcesAdded.then(() => {
                if (!fs.existsSync(templatesFolder)) {
                    fs.mkdirSync(templatesFolder);
                }

                let fileName = getFileNameFor(template);
                let absolutePath = path.resolve(fileName);

                console.log(`Writing ${fileName}`);

                let json = JSON.stringify(outputTemplate);

                let result = {
                    fileName: fileName,
                    absolutePath: absolutePath,
                    json: json
                };


                fs.writeFile(fileName, json, () => {
                    console.log("DONE");
                    fulfill(result)
                });
            });
        });

        return promise;
    }
}