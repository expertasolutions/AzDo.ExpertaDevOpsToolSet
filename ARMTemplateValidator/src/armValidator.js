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

var tl = require('vsts-task-lib');
var shell = require('node-powershell');

try {
    
    var azureEndpointSubscription = tl.getInput("azureSubscriptionEndpoint", true);

    var subcriptionId = tl.getEndpointDataParameter(azureEndpointSubscription, "subscriptionId", false);

    var servicePrincipalId = tl.getEndpointAuthorizationParameter(azureEndpointSubscription, "serviceprincipalid", false);
    var servicePrincipalKey = tl.getEndpointAuthorizationParameter(azureEndpointSubscription, "serviceprincipalkey", false);
    var tenantId = tl.getEndpointAuthorizationParameter(azureEndpointSubscription,"tenantid", false);

    var resourceGroup = tl.getInput("resourceGroupName", true);
    var templateFile = tl.getInput("templateFile", true);
    var parameterFile = tl.getInput("parameterFile", true);

    console.log("Subscription Id:   " + subcriptionId);
    console.log("Resource Group:    " + resourceGroup);
    console.log("Template file:     " + templateFile);
    console.log("Parameter file:    " + parameterFile);

    var pwsh = new shell({
        executionPolicy: 'Bypass',
        noProfile: true
    });

    pwsh.addCommand(__dirname  + "/armValidator.ps1 -subscriptionId '" + subcriptionId + "' -resourceGroupName '" + resourceGroup + "'"
        + " -servicePrincipalId '" + servicePrincipalId + "' -servicePrincipalKey '" + servicePrincipalKey + "' -tenantId '" + tenantId + "'"
        + " -templateFile '" + templateFile + "' -parameterFile '" + parameterFile + "'"
    ).then(function(){
        return pwsh.invoke();
    })
    .then(function(output) {
        console.log(output);

        var regx = "(File Error): ([\\D\\d]*)";
        var result = output.match(regx);
        var errorMessage = result[2]

        if(errorMessage != "none")
            tl.setResult(tl.TaskResult.Failed, errorMessage);

        pwsh.dispose();
    }).catch(function(err){
        console.log(err);
        tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
        pwsh.dispose();
    });

} catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
}