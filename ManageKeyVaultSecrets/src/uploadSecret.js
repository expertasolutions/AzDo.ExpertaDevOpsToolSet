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

const msRestNodeAuth = require('@azure/ms-rest-nodeauth');
const SecretClient = require('@azure/keyvault-secrets').SecretClient;
const ApplicationTokenCredentials = require('@azure/ms-rest-nodeauth').ApplicationTokenCredentials;

try {

    tl.warning("Tasks is now deprecated...");

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

    fs.access(secretsFilePath, fs.F_OK, (err) => {
        if(err){
            throw new Error('File not exists');
        } else {
            let rawdata = fs.readFileSync(secretsFilePath);
            let secretsContent = JSON.parse(rawdata);
            msRestNodeAuth.loginWithServicePrincipalSecret(servicePrincipalId, servicePrincipalKey, tenantId)
            .then(creds => {
                const keyvaultCreds = new ApplicationTokenCredentials(creds.clientId, creds.domain, creds.secret, 'https://vault.azure.net');
                const client = new SecretClient(url, keyvaultCreds);
                for(var s=0;s<secretsContent.length;s++){
                    const secret = secretsContent[s].secret;
                    client.setSecret(secretsContent[s].secret, secretsContent[s].value)
                    .then(sb=> {
                        console.log(secret + " set in keyVault");
                    }).catch(err=> {
                        tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
                    });
                }
            }).catch(err => {
                tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
            });
        }
    });
} catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
}