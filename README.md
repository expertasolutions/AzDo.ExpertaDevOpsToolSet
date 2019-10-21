# Available tasks:
- VersionExtractor
- ACRCredentials
- ACRAKSAccess
- AzureAppInsight
- FileContentToBase64
- ManageKeyVaultSecrets

## VersionExtractor
## Output variables
- versionMajor
- versionMinor
- versionPatch
- fullVersion

## ManageKeyVaultSecrets
![ManageKeyVaultSecrets](_screenShots/manageKeyVaultSecrets_v2-preview.png)
### Secrets file path (expected file format content)
```json
[
	{
		"secret": "my_first_secret",
		"value": "my_first_secret_value"
	},
	{
		"secret": "my_second_secret",
		"value": "my_second_secret_value"
	}
]
```
### Important:
*** Ensure that your subscription service principal have proper access policies rights on your Azure Key Vault ***

## Task Output variables
- ACRCredentials
	- username
	- password
	- password2
- FileContentToBase64
	- base64Content