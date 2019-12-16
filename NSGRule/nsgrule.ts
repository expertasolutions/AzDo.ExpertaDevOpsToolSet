import * as tl from 'azure-pipelines-task-lib';
import * as msRestNodeAuth from '@azure/ms-rest-nodeauth';
import * as msNsg from '@azure/arm-network';

async function LoginToAzure(servicePrincipalId:string, servicePrincipalKey:string, tenantId:string) {
  return await msRestNodeAuth.loginWithServicePrincipalSecret(servicePrincipalId, servicePrincipalKey, tenantId );
};

async function run() {
  try {
    let azureSubscriptionEndpoint = tl.getInput("azureSubscriptionEndpoint", true) as string;
        
    let subcriptionId = tl.getEndpointDataParameter(azureSubscriptionEndpoint, "subscriptionId", false) as string;
    let servicePrincipalId = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint, "serviceprincipalid", false) as string;
    let servicePrincipalKey = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint, "serviceprincipalkey", false) as string;
    let tenantId = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint,"tenantid", false) as string;

    let resourceGroupName = tl.getInput("resourceGroupName", true) as string;
    let nsgName = tl.getInput("nsgName", true) as string;

    // NSG Source
    let nsgPriority = tl.getInput("nsgPriority" as string);
    let allowedSourceIPs = tl.getInput("allowedSourceIPs") as string;
    let allowedSourcePorts = tl.getInput("allowedSourcePorts") as string;

    // NSG Target
    
    console.log("Azure Subscription Id: " + subcriptionId);
    console.log("ServicePrincipalId: " + servicePrincipalId);
    console.log("ServicePrincipalKey: " + servicePrincipalKey);
    console.log("Tenant Id: " + tenantId);
    console.log("Resource Group: " + resourceGroupName);
    console.log("NsgName: " + nsgName);

    console.log("NsgPriority: " + nsgPriority);
    console.log("AllowedSourceIPs: " + allowedSourceIPs);
    console.log("AllowedSourcePorts: " + allowedSourcePorts);
    
    console.log("");

    const creds = await LoginToAzure(servicePrincipalId, servicePrincipalKey, tenantId);
    const nsgClient = new msNsg.NetworkManagementClient(creds, subcriptionId);

  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
  }
}

run();