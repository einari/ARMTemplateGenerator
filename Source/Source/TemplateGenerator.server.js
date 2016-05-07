import fs from "fs";
import path from "path";

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
            let fileName = getFileNameFor({id:request.query.id});
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
        let promise = new Promise((fulfill, reject) => {

            // https://github.com/Azure/azure-resource-manager-schemas
            // https://azure.microsoft.com/en-us/documentation/articles/resource-group-authoring-templates/

            let outputTemplate = {
                "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
                "contentVersion": "1.0.0.0",
                "parameters": {},
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
                    {
                        "apiVersion": "[variables('apiVersion')]",
                        "type": "Microsoft.Compute/virtualMachines",
                        "name": "[variables('vmName')]",
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
                                "computerName": "[variables('vmName')]",
                                "adminUsername": "[parameters('adminUsername')]",
                                "adminPassword": "[parameters('adminPassword')]"
                            },
                            "storageProfile": {
                                "imageReference": {
                                    "publisher": "[variables('imagePublisher')]",
                                    "offer": "[variables('imageOffer')]",
                                    "sku": "[parameters('ubuntuOSVersion')]",
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
                    }
                ],
                "outputs": {

                }
            };


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

        return promise;
    }
}