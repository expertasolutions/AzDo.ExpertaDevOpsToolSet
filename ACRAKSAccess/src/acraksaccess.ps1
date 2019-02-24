param(
  [Parameter(Mandatory=$true, Position=1)]
  [string]$subscriptionId
, [Parameter(Mandatory=$true, Position=2)]
  [string]$servicePrincipalId
, [Parameter(Mandatory=$true, Position=3)]
  [string]$servicePrincipalKey
, [Parameter(Mandatory=$true, Position=4)]
  [string]$tenantId
, [Parameter(Mandatory=$true, Position=5)]
  [string]$registerMode
, [Parameter(Mandatory=$true, Position=6)]
  [string]$acrResourceGroupName
, [Parameter(Mandatory=$true, Position=7)]
  [string]$containerRegistry
, [Parameter(Mandatory=$true, Position=8)]
  [string]$aksResourceGroup
, [Parameter(Mandatory=$true, Position=9)]
  [string]$aksCluster
, [Parameter(Mandatory=$true, Position=10)]
  [string]$acrUsername
, [Parameter(Mandatory=$true, Position=11)]
  [string]$acrPwd
)

$loginResult = az login --service-principal -u $servicePrincipalId -p $servicePrincipalKey --tenant $tenantId
$setSubResult = az account set --subscription $subscriptionId

if($registerMode -eq "aksSecret"){
  write-host "AKS Secret mode"
  $acrInfo = az acr show --name $containerRegistry -g $resourceGroupName --subscription $subscriptionId | ConvertFrom-Json
  if(-not $acrInfo.adminUserEnabled){
    throw "Container registry named '$containerRegistry' does not have adminUser configured"
  }
} else { # RBAC access mode
  write-host "RBAC Access mode"
  
  $clientId = $(az aks show -g $aksResourceGroup --name $aksCluster --query "servicePrincipalProfile.clientId" --output tsv --subscription $subscriptionId)
  write-host $clientId

  $acrId = $(az acr show --name $containerRegistry -g $acrResourceGroupName --query "id" --output tsv --subscription $subscriptionId)
  az role assignment create --assignee $clientId --role acrpull --scope $acrId
}

$logoutResult = az account clear