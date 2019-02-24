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
  [string]$containerRegistry
, [Parameter(Mandatory=$true, Position=7)]
  [string]$actionType
, [Parameter(Mandatory=$true, Position=8)]
  [string]$pwdName
)

$loginResult = az login --service-principal -u $servicePrincipalId -p $servicePrincipalKey --tenant $tenantId
$setSubResult = az account set --subscription $subscriptionId

if($actionType -eq "show") {
  $result = az acr credential show -n $containerRegistry -g $resourceGroupName --subscription $subscriptionId
  write-host $result
} else {
  $info = az acr credential show -n $containerRegistry -g $resourceGroupName --subscription $subscriptionId | ConvertFrom-Json

  if($pwdName -eq "*"){
    $info.passwords | ForEach-Object {
      $renewResult = az acr credential renew -n $containerRegistry --password-name $_.name -g $resourceGroupName --subscription $subscriptionId
    }
  } else {
    $renewPwd = $info.passwords | Where-Object { $_.name -eq $pwdName }
    if($renewPwd.length -eq 0){
      ThrowError -ExceptionName "Error: Password named not found"
    } else {
      $renewResult = az acr credential renew -n $containerRegistry --password-name $pwdName -g $resourceGroupName --subscription $subscriptionId
    }
  }
  
  $result = az acr credential show -n $containerRegistry -g $resourceGroupName --subscription $subscriptionId
  write-host $result
}

$logoutResult = az account clear