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
  [string]$appInsightName
)

$loginResult = az login --service-principal -u $servicePrincipalId -p $servicePrincipalKey --tenant $tenantId
$setSubResult = az account set --subscription $subscriptionId

$result = az resource list --namespace microsoft.insights --resource-type components --subscription $subscriptionId | ConvertFrom-Json
$appInsight = $result | Where-Object { $_.name -eq "$appInsightName" }

$id = az resource show --id $appInsight.id --query properties.InstrumentationKey --o tsv --Subscription $subscriptionId
write-host "Instrmentation Key: $id"

$logoutResult = az account clear