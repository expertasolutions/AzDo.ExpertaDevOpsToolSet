param(
  [Parameter(Mandatory=$true, Position=1)]
  [string]$subscriptionId
, [Parameter(Mandatory=$true, Position=2)]
  [string]$templateFile
, [Parameter(Mandatory=$true, Position=3)]
  [string]$parameterFile
)

write-host $subscriptionId
write-host $templateFile
write-host $parameterFile