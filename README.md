https://blog.jongallant.com/2017/11/azure-rest-apis-postman/

AZURE PORTAL
1. Create the Azure SP Account
  - `az login`
  - `azure account set --subscription "36ff2f05-661e-481f-8359-3e166b639029"`
  - `az ad sp create-for-rbac -n "test-az-functions"`

2. Create the postman request:
  - get AAD: https://login.microsoftonline.com/{{tenantId}}/oauth2/token
  - get resource groups: https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups?api-version=2017-05-10

3. Set the clientId, tenantId, clientSecret, and resource ("https://management.azure.com") in AAD reqeust

4. Get the access_token from AAD request

5. Get resource groups using access_token as bearer token

AZURE DEVOPS
1. Create Personal Access Token - https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page

2. List Pipelines using https://dev.azure.com/{{adoOrg}}/{{adoProj}}/_apis/pipelines?api-version=6.1-preview.1 and personal access token in the header under basic auth

