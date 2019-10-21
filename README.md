## Available tasks:
- VersionExtractor
- ACRCredentials
- ACRAKSAccess
- AzureAppInsight
- FileContentToBase64
- ManageKeyVaultSecrets

# ManageKeyVaultSecrets
## Define your secrets file content
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

## Task Output variables
- VersionExtrator
	- versionMajor
	- versionMinor
	- versionPatch
	- fullVersion
- ACRCredentials
	- username
	- password
	- password2
- FileContentToBase64
	- base64Content