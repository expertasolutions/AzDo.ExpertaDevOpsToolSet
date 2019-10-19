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
  [string]$keyVault
, [Parameter(Mandatory=$true, Position=7)]
  [string]$secretFilePath
)

$loginResult = az login --service-principal -u $servicePrincipalId -p $servicePrincipalKey --tenant $tenantId
$setSubResult = az account set --subscription $subscriptionId

$secrets = (Get-Content $secretFilePath | ConvertFrom-Json)
$secrets | ForEach-Object {
  $secret = $_
  Write-Host "Adding $($secret.secret) to KeyVault ..."
  az keyvault secret set --vault-name $keyVault --name $secret.secret --value $secret.value | Out-Null
}

$logoutResult = az account clear