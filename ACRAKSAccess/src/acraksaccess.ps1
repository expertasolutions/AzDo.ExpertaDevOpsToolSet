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
  throw "Not implemented yet"
  $acrInfo = az acr show --name $containerRegistry -g $acrResourceGroup --subscription $subscriptionId | ConvertFrom-Json
  if(-not $acrInfo.adminUserEnabled){
    throw "Container registry named '$containerRegistry' does not have adminUser configured"
  }
} else { # RBAC access mode
  write-host "RBAC Access mode"
  write-host "'$aksResourceGroup'"
  write-host $aksCluster
  write-host $subscriptionId
  write-host ""
  write-host "Looking for Azure Kubernetes service cluster ..."
  $clientId = $(az aks show --resource-group $aksResourceGroup --name $aksCluster --subscription $subscriptionId --query "servicePrincipalProfile.clientId" --output tsv)
  write-host $clientId
  write-host ""
  write-host "Looking for Azure container registry"
  $acrId = $(az acr show --name $containerRegistry --resource-group $acrResourceGroup --subscription $subscriptionId --query "id" --output tsv)
  write-host $acrId

  #check if the roles already assigns
  $result = $(az role assignment list --all --subscription $subscriptionId) | ConvertFrom-Json
  write-host "result = $result"

  $myTest = $result | Where-Object { $_.roleDefinitionName -eq "AcrPull" }

  write-host $myTest.length

  $roleExists = $result | Where-Object {$_.roleDefinitionName -eq "AcrPull" -and $_.principalName -like "*$acrId" }
  $roleExists | ForEach-Object {
    write-host $_.principalName
  }
  write-host "roleExists: $roleExists"

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