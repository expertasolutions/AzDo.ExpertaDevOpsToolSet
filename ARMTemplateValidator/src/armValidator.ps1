param(
  [Parameter(Mandatory=$true, Position=1)]
  [string]$subscriptionId
, [Parameter(Mandatory=$true, Position=2)]
  [string]$resourceGroupName
, [Parameter(Mandatory=$true, Position=3)]
  [string]$templateFile
, [Parameter(Mandatory=$true, Position=4)]
  [string]$parameterFile
)

write-host $subscriptionId
write-host $resourceGroupName
write-host $templateFile
write-host $parameterFile

$result = az group deployment validate -g $resourceGroupName --template-file $templateFile --parameters $parameterName --subscription $subscriptionId | ConvertFrom-Json

write-host $result