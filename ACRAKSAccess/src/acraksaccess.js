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
var shell = require('node-powershell');

try {
    var azureSubscriptionEndpoint = tl.getInput("azureSubscriptionEndpoint", true);
    
    var subcriptionId = tl.getEndpointDataParameter(azureSubscriptionEndpoint, "subscriptionId", false);
    var servicePrincipalId = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint, "serviceprincipalid", false);
    var servicePrincipalKey = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint, "serviceprincipalkey", false);
    var tenantId = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint,"tenantid", false);

    var registerMode = tl.getInput("registerMode", true);
    var acrResourceGroup = tl.getInput("acrResourceGroupName", true);
    var containerRegistry = tl.getInput("containerRegistry", true);
    var aksResourceGroup = tl.getInput("aksResourceGroupName", true);
    var aksCluster = tl.getInput("aksCluster", true);
    var acrUsername = tl.getInput("acrUsername", true);
    var acrPassword = tl.getInput("acrPassword", true);

    console.log("Azure Subscription Id: " + subcriptionId);
    console.log("ServicePrincipalId: " + servicePrincipalId);
    console.log("ServicePrincipalKey: " + servicePrincipalKey);
    console.log("Tenant Id: " + tenantId);
    console.log("Register mode: " + registerMode);
    console.log("ACR Resource Group: " + acrResourceGroup);
    console.log("Container Registry: " + containerRegistry);
    console.log("AKS Resource Group: " + aksResourceGroup);
    console.log("AKS Cluster: " + aksCluster);
    console.log("ACR Username: " + acrUsername);
    console.log("ACR Password: " + acrPassword);

    // TODO: Use npm module to interact with azure container registry
    var pwsh = new shell({ executionPolicy: 'Bypass', noProfile: true });

    pwsh.addCommand(__dirname  + "/acrcred.ps1 -subscriptionId '" + subcriptionId + "' "
        + "-servicePrincipalId '" + servicePrincipalId + "' -servicePrincipalKey '" + servicePrincipalKey + "' "
        + "-tenantId '" + tenantId + "' "
        + "-registerMode '" + registerMode + "' "
        + "-resourceGroupName '" + acrResourceGroupName + "' "
        + "-containerRegistry '" + containerRegistry + "' "
        + "-aksResourceGroup '" + aksResourceGroup + " '"
        + "-aksCluster '" + aksCluster + "' "
        + "-acrUsername '" + acrUsername + "' "
        + "-acrPwd '" + acrPassword + "' "
        ).then(function() {
        return pwsh.invoke();
    }).then(function(output){
        console.log(output);
        pwsh.dispose();
    }).catch(function(err){
        console.log(err);
        tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
        pwsh.dispose();
    });
    
} catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
}