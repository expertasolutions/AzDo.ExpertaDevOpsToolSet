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

let tl = require('azure-pipelines-task-lib');

const msRestNodeAuth = require('@azure/ms-rest-nodeauth');
const SecretClient = require('@azure/keyvault-secrets').SecretClient;
const ApplicationTokenCredentials = require('@azure/ms-rest-nodeauth').ApplicationTokenCredentials;

try {

    tl.warning("Tasks is now deprecated...");

    let azureSubscriptionEndpoint = tl.getInput("azureSubscriptionEndpoint", true);
    
    let subcriptionId = tl.getEndpointDataParameter(azureSubscriptionEndpoint, "subscriptionId", false);
    let servicePrincipalId = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint, "serviceprincipalid", false);
    let servicePrincipalKey = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint, "serviceprincipalkey", false);
    let tenantId = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint,"tenantid", false);

    let resourceGroupName = tl.getInput("resourceGroupName", true);
    let keyVault = tl.getInput("keyVaultName", true);
    let secretName = tl.getInput("secretName", true);
    let secretValue = tl.getInput("secretValue", true);
    
    console.log("Azure Subscription Id: " + subcriptionId);
    console.log("ServicePrincipalId: " + servicePrincipalId);
    console.log("ServicePrincipalKey: " + servicePrincipalKey);
    console.log("Tenant Id: " + tenantId);
    console.log("Resource Group: " + resourceGroupName);
    console.log("Key Vault: " + keyVault);
    console.log("SecretName: " + secretName);

    const url = 'https://' + keyVault + '.vault.azure.net';

    msRestNodeAuth.loginWithServicePrincipalSecret(servicePrincipalId, servicePrincipalKey, tenantId)
    .then(creds => {
        const keyvaultCreds = new ApplicationTokenCredentials(creds.clientId, creds.domain, creds.secret, 'https://vault.azure.net');
        const client = new SecretClient(url, keyvaultCreds);
        
        client.setSecret(secretName, secretValue)
        .then(sb=> {
            console.log(secretName + " set in keyVault");
        }).catch(err=> {
            tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
        });

    }).catch(err => {
        tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
    });

} catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
}