# SFMC-Twilio
This repository serves as a working example of a *Custom Activity* within Salesforce Marketing Cloud's Journey Builder product.

A *custom activity* in Salesforce Marketing Journey Builder is a reusable component that allows you to automate complex tasks or integrate with external systems. Custom activities can be used to perform a variety of tasks, such as:

* Updating contact records in Salesforce CRM
* Sending email or SMS messages
* Triggering workflows in other Salesforce products
* Integrating with third-party marketing automation systems
* Custom activities are created using the Marketing Cloud APIs. Once a custom activity has been created, it can be added to any Journey Builder journey.

In it's current form, the example here forwards the received payload with light transformation to an Azure Service Bus. The payload is then intended to be processed by an external process for action.

# Setup
## Initial Setup: Azure
Using the Azure CLI, the following commands can be executed to create the necessary objects within your Azure environment. For clarity, the syntax `<****>` indicates a value that the user is to provide at the time of creation, for example: `<resourceGroup1>` indicates a resource group within Azure for the environment where this code is deployed.

* Login to Azure
```az login```

* Create a resource group
```az group create --location  westus2 --resource-group <resourceGroup1>```

* Create AppService
```az appservice plan create --resource-group <resourceGroup1> --name <appService1> --is-linux```

* Create WebApp
```az webapp create --name <webapp1> --plan <appService1> --resource-group <resourceGroup1> --runtime "NODE|16-lts"```

Within the Azure portal, navigate to your new web app resource that was defined. Download the *publish profile* so that the secret can be added to your forked GitHub repository. To add in GitHub, navigate to *Settings* > *Secrets and Variables* > *Actions* of the forked GitHub repository. Copy the contents of the downloaded publish profile and store the value as a Repository secret under the key name: `AZURE_WEBAPP_PUBLISH_PROFILE`.

Using the value provided for `<webapp1>`, modify the workflow action file `.github/workflows/azure-deploy.yml` in the forked repository. Set the value for `env.AZURE_WEBAPP_NAME` to the web app name value provided.

CI/CD is now enabled for your forked repository to your Azure environment.

With the web app deployed to Azure, retrieve the URL for it. Confirm it loads in your browser.

## Initial Setup: Salesforce Marketing Cloud
* Login to SFMC
* Navigate to *Setup* > *Platform Tools* > *Apps* > *Installed Packages*
* Add a new package
* Modify the access according to its use and current development status
* Add a component
  * Specify the component name
  * Set category to `Messages`
  * Set the Endpoint URL to the URL used to validate the web app in Azure

### JWT Signing
Follow instructions for step 1 and 2 located [here](https://zpugman.github.io/posts/securing-sfmc-with-jwt/).

Set the appropriate `JWT_****` environment variables below with their associated values.


## Environment Settings
The following environment settings are expected to be defined.

|Environment Variable |Required?  |Description   |
|:--------------------|:--------------------|:--------------------|
|APPINSIGHTS_INSTRUMENTATIONKEY|No|GUID Assigned to the application for Azure ApplicationInsights instrumentation.|
|AZURE_SEND_BUS|Yes|Connection string for the Azure Service Bus where payloads are posted.|
|AZURE_SEND_QUEUE|Yes|Name of the Azure Service Bus queue.|
|JWT_ENABLED|No|`true` indicates that JWT is in use and payloads received by the `/execute` endpoint will be encrypted by a shared SALT key|
|JWT_SECRET|No|Required if `JWT_ENABLED=true` <br>SALT value used for encrypting payloads by SFMC and decrypting payloads by this application|
|JWT_SECRET_APP|No|Required if `JWT_ENABLED=true` <br>SFMC provided signing secret value|
|SALT_EXTERNAL_KEY|No|Required if `JWT_ENABLED=true` <br>SFMC assigned external key value for the JWT SALT|

These values can be added within the Azure portal's web app resource. Environment values are added under the web app's *Settings* > *Configuration* section.