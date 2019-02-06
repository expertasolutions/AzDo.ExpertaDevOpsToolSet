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
  [string]$resourceGroupName
, [Parameter(Mandatory=$true, Position=6)]
  [string]$templateFile
, [Parameter(Mandatory=$true, Position=7)]
  [string]$parameterFile
)

write-host $subscriptionId
write-host $resourceGroupName
write-host $templateFile
write-host $parameterFile

$loginResult = az login --service-principal -u $servicePrincipalId -p $servicePrincipalKey --tenant $tenantId
$setSubResult = az account set --subscription $subscriptionId

$result = az group deployment validate -g $resourceGroupName --template-file "$templateFile" --parameters "$parameterFile" --subscription $subscriptionId | ConvertFrom-Json

write-host $result

$logoutResult = az account clear