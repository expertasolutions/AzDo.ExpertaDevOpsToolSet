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
const msRestNodeAuth = require('@azure/ms-rest-nodeauth');

try {
    var acrSubscriptionEndpoint = tl.getInput("acrSubscriptionEndpoint", true);
    var acrSubcriptionId = tl.getEndpointDataParameter(acrSubscriptionEndpoint, "subscriptionId", false);
    var acrServicePrincipalId = tl.getEndpointAuthorizationParameter(acrSubscriptionEndpoint, "serviceprincipalid", false);
    var acrServicePrincipalKey = tl.getEndpointAuthorizationParameter(acrSubscriptionEndpoint, "serviceprincipalkey", false);
    var acrTenantId = tl.getEndpointAuthorizationParameter(acrSubscriptionEndpoint,"tenantid", false);

    var aksSubscriptionEndpoint = tl.getInput("aksSubscriptionEndpoint", true);
    var aksSubcriptionId = tl.getEndpointDataParameter(aksSubscriptionEndpoint, "subscriptionId", false);
    var aksServicePrincipalId = tl.getEndpointAuthorizationParameter(aksSubscriptionEndpoint, "serviceprincipalid", false);
    var aksServicePrincipalKey = tl.getEndpointAuthorizationParameter(aksSubscriptionEndpoint, "serviceprincipalkey", false);
    var aksTenantId = tl.getEndpointAuthorizationParameter(aksSubscriptionEndpoint,"tenantid", false);

    var registerMode = tl.getInput("registerMode", true);
    var acrResourceGroup = tl.getInput("acrResourceGroupName", true);
    var containerRegistry = tl.getInput("containerRegistry", true);
    var aksResourceGroup = tl.getInput("aksResourceGroupName", true);
    var aksCluster = tl.getInput("aksCluster", true);
    var acrUsername = tl.getInput("acrUsername", false);
    var acrPassword = tl.getInput("acrPassword", false);

    /* ACR Subscription Informations */
    console.log("ACR Azure Subscription Id: " + acrSubcriptionId);
    console.log("ACR ServicePrincipalId: " + acrServicePrincipalId);
    console.log("ACR ServicePrincipalKey: " + acrServicePrincipalKey);
    console.log("ACR Tenant Id: " + acrTenantId);
    /* End of ACR Subscription Informations */

    /* AKS Subscription Informations */
    console.log("AKS Azure Subscription Id: " + aksSubcriptionId);
    console.log("AKS ServicePrincipalId: " + aksServicePrincipalId);
    console.log("AKS ServicePrincipalKey: " + aksServicePrincipalKey);
    console.log("AKS Tenant Id: " + aksTenantId);
    /* End of AKS Subscription Informations */

    console.log("Register mode: " + registerMode);
    console.log("ACR Resource Group: '" + acrResourceGroup + "'");
    console.log("Container Registry: " + containerRegistry);
    console.log("AKS Resource Group: " + aksResourceGroup);
    console.log("AKS Cluster: " + aksCluster);
    console.log("ACR Username: " + acrUsername);
    console.log("ACR Password: " + acrPassword);

    // TODO: Implement codes here :P
    msRestNodeAuth.loginWithServicePrincipalSecretWithAuthResponse(
        aksServicePrincipalId, aksServicePrincipalKey, aksTenantId
    ).then(creds => {
        if(registerMode == "aksSecret") {
            throw new Error("AKS Secret access mode not implemented yet");
        } else {
            console.log("RBAC Access mode");
            console.log("Looking for Azure Kubernetes service cluster ...");
        }
    }).catch(err => {
        tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
    });
} catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
}