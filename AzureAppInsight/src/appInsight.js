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
const msRestAzure = require('ms-rest-azure');
const resourceManagement = require('azure-arm-resource');

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
    console.log("");

    msRestAzure.loginWithServicePrincipalSecret(
        servicePrincipalId, servicePrincipalKey, 
        tenantId, (err, creds) => {
            if(err){
                throw new Error('Auth error --> ' + err);
            }

            var entityFound;
            const resClient = new resourceManagement.ResourceManagementClient(creds, subcriptionId);
            resClient.resources.list(function(err, result){
                if(err)
                  console.log(err);
                for(var i=0;i<result.length;i++){
                  const entity = result[i];
                  if(entity.name == azureAppInsightName) {
                    entityFound = entity;
                  }
                }
          
                if(entityFound === undefined) {
                  tl.setResult(tl.TaskResult.Failed, "Azure ApplicationInsight not found");
                }
                else {
                  resClient.resources.getById(entityFound.id, '2015-05-01')
                        .then(result => {
                          console.log("Azure ApplicationInsight " + azureAppInsightName + " has been found !");
                          tl.setVariable("instrumentationKey", result.properties.InstrumentationKey, false);     
                        });
                }
            });        
        });
} catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
}