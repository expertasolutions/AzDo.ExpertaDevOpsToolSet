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

$loginResult = az login --service-principal -u $servicePrincipalId -p $servicePrincipalKey --tenant $tenantId
$setSubResult = az account set --subscription $subscriptionId

$hasError = ""
try {
  $result = az group deployment validate -g $resourceGroupName --template-file "$templateFile" --parameters "$parameterFile" --subscription $subscriptionId | ConvertFrom-Json
  if($result.error.length -eq 0){
    write-host "File Error: none"
  } else {
    write-host "File Error: $($result.error)"
  }
} catch {
  $hasError = "File Error: $($_)"
}

$logoutResult = az account clear