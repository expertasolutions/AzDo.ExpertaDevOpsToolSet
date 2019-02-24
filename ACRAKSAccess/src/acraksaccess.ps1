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
  [string]$acrResourceGroup
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
  $acrInfo = az acr show --name $containerRegistry -g $acrResourceGroup --subscription $subscriptionId | ConvertFrom-Json
  if(-not $acrInfo.adminUserEnabled){
    throw "Container registry named '$containerRegistry' does not have adminUser configured"
  }
} else { # RBAC access mode
  write-host "RBAC Access mode"
  write-host "'$aksResourceGroup'"
  write-host $aksCluster
  write-host $subscriptionId
  az aks show --resource-group $aksResourceGroup --name $aksCluster --subscription $subscriptionId
  $clientId = $(az aks show --resource-group $aksResourceGroup --name $aksCluster --subscription $subscriptionId --query "servicePrincipalProfile.clientId" --output tsv)
  write-host $clientId

  #$acrId = $(az acr show --name $containerRegistry --resource-group $acrResourceGroup --subscription $subscriptionId --query "id" --output tsv)
  #write-host $acrId
  #az role assignment create --assignee $clientId --role acrpull --scope $acrId
}

$logoutResult = az account clear