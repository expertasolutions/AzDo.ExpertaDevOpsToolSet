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
const resourceManagement = require('@azure/arm-resources');
const auth = require('@azure/arm-authorization');
const graph = require('@azure/graph');

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
    msRestNodeAuth.loginWithServicePrincipalSecret (
        aksServicePrincipalId, aksServicePrincipalKey, aksTenantId
    ).then(aksCreds => {
        if(registerMode == "aksSecret") {
            throw new Error("AKS Secret access mode not implemented yet");
        } else {
            console.log("RBAC Access mode");
            console.log("Looking for Azure Kubernetes service cluster ...");
            
            const aksResourceClient = new resourceManagement.ResourceManagementClient(aksCreds, aksSubcriptionId);
            aksResourceClient.resources.list()
                .then(result => {
                    // Find the AKS Cluster Resource group
                    const aksClusterInstance = result.find(element => {
                        return element.name == aksCluster;
                    });

                    console.log("AksCluster instance information ...");
                    console.log(aksClusterInstance);

                    aksResourceClient.resources.getById(aksClusterInstance.id, '2019-10-01')
                    .then(aksInfoResult => {
                        const clientId = aksInfoResult.properties.servicePrincipalProfile.clientId;
                        console.log("AKS.ClientId: " + clientId);
                        var aksAppCreds = new msRestNodeAuth.ApplicationTokenCredentials(aksCreds.clientId, aksTenantId, aksCreds.secret, 'graph');
                        const aksGraphClient = new graph.GraphRbacManagementClient(aksAppCreds, aksTenantId, { baseUri: 'https://graph.windows.net' });
                        var aksFilterValue = "appId eq '" + clientId + "'";
                        var aksServiceFilter = {
                            filter: aksFilterValue
                        };
                        // Get the AKS Service Principal details
                        aksGraphClient.servicePrincipals.list(aksServiceFilter)
                            .then(aksSearch => {
                                const aksServicePrincipal = result.find(element => {
                                    console.log("element.appId: " + element);
                                    return element.appId == clientId;
                                });
                                console.log("AKS Service Principal: ");
                                console.log(aksServicePrincipal);

                                if(aksServicePrincipal == undefined)
                                {
                                    throw new Error("AKS Server Principal not found");
                                }

                                // Get the Azure Container Registry resource infos
                                msRestNodeAuth.loginWithServicePrincipalSecret(
                                    acrServicePrincipalId, acrServicePrincipalKey, acrTenantId
                                ).then(acrCreds => {
                                    
                                    const acrResourceClient = new resourceManagement.ResourceManagementClient(acrCreds, acrSubcriptionId);
                                    acrResourceClient.resources.list()
                                    .then(acrResult => {
                                        const acrInstance = acrResult.find(element => {
                                            return element.name == containerRegistry;
                                        });
                                        console.log("ACR Instance: ");
                                        console.log(acrInstance);
                                    })
                                    .catch(err => {
                                        tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
                                    })
                                    /*
                                    const acrAuthClient = new auth.AuthorizationManagementClient(acrCreds, acrSubcriptionId);
                                    const acrPullRoleName = "AcrPull";

                                    acrAuthClient.roleDefinitions.list("/")
                                        .then(roles => {
                                            var acrRole = roles.find(role => {
                                                return role.roleName == acrPullRoleName;
                                            });

                                            acrAuthClient.roleAssigments.listForResourceGroup(acrResourceGroup)
                                            .then(rs => {
                                                var roleAssignement = rs.find(elm => {
                                                    const rolId = "/subscriptions/" + acrSubcriptionId + acrRole.id;
                                                    return rolId === elm.roleDefinitionId;
                                                });

                                                console.log(roleAssignement);

                                            }).catch(err => {
                                                tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
                                            })

                                        }).catch(err => {
                                            tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
                                        });
                                    */

                                }).catch(err => {
                                    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
                                });
                            })
                            .catch(err => {
                                tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
                            });
                    })
                    .catch(err => {
                        tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
                    });
                })
                .catch(err => {
                    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
                });
        }
    }).catch(err => {
        tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
    });
} catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
}