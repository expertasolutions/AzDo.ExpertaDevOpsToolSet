# Purpose & description
This is our current customs Azure DevOps tasks toolbox. Theses tasks has been specifially created for our needs and why not shared it for the entire community.
Eventually, we will publish each of these tasks separately.
If you have any comment/suggestion, please feel free to share it with us.

![MasterBuildStatus](https://dev.azure.com/experta/Community/_apis/build/status/expertasolutions.ExpertaDevOpsToolSet?branchName=master)

# Tasks include

## VersionExtractor
![VersionExtrator](_screenShots/VersionExtrator_v1.png)
#### Output variables
- versionMajor
- versionMinor
- versionPatch
- revisionNumber
- fullVersion
#### Important
*** Build name require to have v0.0.0 format ***

## ACRCredentials - Deprecated
![ACRCredentials](_screenShots/acrCredential_v1.png)
#### Action Type
- Show: Get the current credentials information
- Renew: Renew the current credentials information access
#### Output variables
- username
- password
- password2

## ACRAKSAccess - Deprecated
![ACRAKSAccess](_screenShots/ACRAKSAccess_v2.png)

## AzureAppInsight
![AppInsight](_screenShots/appInsight_v2.png)
#### Output variables
- instrumentationKey

## FileContentToBase64
![FileContentToBase64](_screenShots/FileContentToBase64_v2.png)
#### Output variables
- base64Content