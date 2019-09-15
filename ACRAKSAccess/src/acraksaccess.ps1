param(
  [Parameter(Mandatory=$true, Position=1)]
  [string]$acrSubscriptionId
, [Parameter(Mandatory=$true, Position=2)]
  [string]$acrServicePrincipalId
, [Parameter(Mandatory=$true, Position=3)]
  [string]$acrServicePrincipalKey
, [Parameter(Mandatory=$true, Position=4)]
  [string]$acrTenantId
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
, [Parameter(Mandatory=$true, Position=12)]
  [string]$aksSubscriptionId
)

$loginResult = az login --service-principal -u $acrServicePrincipalId -p $acrServicePrincipalKey --tenant $acrTenantId
$setSubResult = az account set --subscription $acrSubscriptionId

if($registerMode -eq "aksSecret"){
  write-host "AKS Secret mode"
  throw "Not implemented yet"
  $acrInfo = az acr show --name $containerRegistry -g $acrResourceGroup --subscription $acrSubscriptionId | ConvertFrom-Json
  if(-not $acrInfo.adminUserEnabled){
    throw "Container registry named '$containerRegistry' does not have adminUser configured"
  }
} else { # RBAC access mode
  write-host "RBAC Access mode"
  write-host "'$aksResourceGroup'"
  write-host $aksCluster
  write-host $aksSubscriptionId
  write-host ""
  write-host "Looking for Azure Kubernetes service cluster ..." -NoNewline
  $clientId = $(az aks show --resource-group $aksResourceGroup --name $aksCluster --subscription $aksSubscriptionId --query "servicePrincipalProfile.clientId" --output tsv)
  write-host " clientId '$clientId' found"
  write-host ""

  write-host "Looking for Azure container registry ..." -NoNewline
  $acrId = $(az acr show --name $containerRegistry --resource-group $acrResourceGroup --subscription $acrSubscriptionId --query "id" --output tsv)
  write-host " Found"

  #check if the roles already assigns
  $result = $(az role assignment list --all --subscription $acrSubscriptionId) | ConvertFrom-Json

  $roleExists = $result | Where-Object {$_.roleDefinitionName -eq "AcrPull" -and $_.id -like "$acrId*" -and $_.principalName -like "*$clientId"  }

  if($roleExists.length -eq 0){
    write-host "Role pending assignation..." -NoNewline
    $result = az role assignment create --assignee $clientId --role acrpull --scope $acrId
    write-host " Done"
  }
  else {
    write-host "Role already assigned"
  }
}

$logoutResult = az account clear