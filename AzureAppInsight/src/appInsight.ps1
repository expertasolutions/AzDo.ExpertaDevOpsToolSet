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
  [string]$appInsigthName
)

$loginResult = az login --service-principal -u $servicePrincipalId -p $servicePrincipalKey --tenant $tenantId
$setSubResult = az account set --subscription $subscriptionId

$acrInfo = az acr show --name $containerRegistry -g $resourceGroupName --subscription $subscriptionId | ConvertFrom-Json
if(-not $acrInfo.adminUserEnabled){
  throw "Container registry named '$containerRegistry' does not have adminUser configured"
}



$logoutResult = az account clear