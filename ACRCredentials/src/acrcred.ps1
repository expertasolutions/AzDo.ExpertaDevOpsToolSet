param(
  [Parameter(Mandatory=$true, Position=1)]
  [string]$subscriptionId
, [Parameter(Mandatory=$true, Position=2)]
  [string]$servicePrincipalId
, [Parameter(Mandatory=$true, Position=3)]
  [string]$servicePrincipalKey
, [Parameter(Mandatory=$true, Position=4)]
  [string]$resourceGroupName
, [Parameter(Mandatory=$true, Position=5)]
  [string]$containerRegistry
, [Parameter(Mandatory=$true, Position=6)]
  [string]$actionType
)

$loginResult = az login --service-principal -u $servicePrincipalId -p $servicePrincipalKey --tenant $tenantId
$setSubResult = az account set --subscription $subscriptionId

$result = az acr credential show -n $containerRegistry -g $resourceGroupName --subscription $subscriptionId

$logoutResult = az account clear