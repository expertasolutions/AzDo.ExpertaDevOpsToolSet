import * as tl from 'azure-pipelines-task-lib';
import * as msRestNodeAuth from '@azure/ms-rest-nodeauth';

async function LoginToAzure(servicePrincipalId:string, servicePrincipalKey:string, tenantId:string) {
  return await msRestNodeAuth.loginWithServicePrincipalSecret(servicePrincipalId, servicePrincipalKey, tenantId );
};

async function run() {

  let azureSubscriptionEndpoint = tl.getInput("azureSubscriptionEndpoint", true) as string;
      
  let subcriptionId = tl.getEndpointDataParameter(azureSubscriptionEndpoint, "subscriptionId", false) as string;
  let servicePrincipalId = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint, "serviceprincipalid", false) as string;
  let servicePrincipalKey = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint, "serviceprincipalkey", false) as string;
  let tenantId = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint,"tenantid", false) as string;

  let resourceGroupName = tl.getInput("resourceGroupName", true) as string;
  let nsgName = tl.getInput("nsgName", true) as string;
  
  console.log("Azure Subscription Id: " + subcriptionId);
  console.log("ServicePrincipalId: " + servicePrincipalId);
  console.log("ServicePrincipalKey: " + servicePrincipalKey);
  console.log("Tenant Id: " + tenantId);
  console.log("Resource Group: " + resourceGroupName);
  console.log("NsgName: " + nsgName);
  
  console.log("");

}

run();