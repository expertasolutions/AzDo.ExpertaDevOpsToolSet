"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });

var tl = require('azure-pipelines-task-lib');
var fs = require('fs');

const msRestAzure = require('ms-rest-azure');
const KeyVault = require('azure-keyvault');

try {
    var azureSubscriptionEndpoint = tl.getInput("azureSubscriptionEndpoint", true);
    
    var subcriptionId = tl.getEndpointDataParameter(azureSubscriptionEndpoint, "subscriptionId", false);
    var servicePrincipalId = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint, "serviceprincipalid", false);
    var servicePrincipalKey = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint, "serviceprincipalkey", false);
    var tenantId = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint,"tenantid", false);

    var resourceGroupName = tl.getInput("resourceGroupName", true);
    var keyVault = tl.getInput("keyVaultName", true);
    var secretsFilePath = tl.getInput("secretsFilePath", true);
    
    console.log("Azure Subscription Id: " + subcriptionId);
    console.log("ServicePrincipalId: " + servicePrincipalId);
    console.log("ServicePrincipalKey: " + servicePrincipalKey);
    console.log("Tenant Id: " + tenantId);
    console.log("Resource Group: " + resourceGroupName);
    console.log("Key Vault: " + keyVault);
    console.log("Secret File Path: '" + secretsFilePath + "'");

    const url = 'https://' + keyVault + '.vault.azure.net';
    console.log(url);

    fs.access(secretsFilePath, fs.F_OK, (err) => {
        if(err){
            throw new Error('File not exists');
        } else {
            let client;
            msRestAzure.loginWithServicePrincipalSecret(
                servicePrincipalId, servicePrincipalKey, 
                tenantId, (err, creds) => {
                    if(err){
                        throw new Error('Auth error --> ' + err);
                    }

                    client = new KeyVault.KeyVaultClient(creds);
                    client.getSecrets(url).then(secrets => {
                        console.log('read secrets');
                        //console.dir(secrets, { depth: null, colors: true});
                        for(var i=0;i<secrets.length;i++){
                            var secret = secrets[i];
                            console.log(secret.id);
                        }
                    });

                    client.setSecret(url, "chantal", "cholette", s=> {
                        console.log("created");
                    });
                });
        }
    });
} catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
}