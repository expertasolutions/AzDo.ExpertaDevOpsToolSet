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

    var azureAppInsightName = tl.getInput("azureAppInsightName", true);
    
    console.log("Azure Subscription Id: " + subcriptionId);
    console.log("ServicePrincipalId: " + servicePrincipalId);
    console.log("ServicePrincipalKey: " + servicePrincipalKey);
    console.log("Tenant Id: " + tenantId);
    console.log("AppInsight Name: " + azureAppInsightName)

    // TODO: Use npm module to interact with azure container registry
    var pwsh = new shell({ executionPolicy: 'Bypass', noProfile: true });

    pwsh.addCommand(__dirname  + "/appInsight.ps1 -subscriptionId '" + subcriptionId + "' "
        + "-servicePrincipalId '" + servicePrincipalId + "' -servicePrincipalKey '" + servicePrincipalKey + "' "
        + "-tenantId '" + tenantId + "' "
        + "-appInsightName '" + azureAppInsightName + "' "
    ).then(function() {
        return pwsh.invoke();
    }).then(function(output){
        console.log(output);

        let result = JSON.parse(output);
        tl.setVariable("instrumentationKey", result.properties.InstrumentationKey, true);       

        pwsh.dispose();
    }).catch(function(err){
        console.log(err);
        tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
        pwsh.dispose();
    });
    
} catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
}