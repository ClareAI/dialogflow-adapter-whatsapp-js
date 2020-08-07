# sample chatbot of (ClareAI Dialogflow WhatsApp Adapter)

This is a chatbot that using the `ClareAI Dialogflow WhatsApp Adapter` library, it can connect to Dialogflow with the Whatsapp channel.


## Prerequisites

- [Node.js](https://nodejs.org)

  ```bash
    node --version
  ```
  
- go the [Google Cloud Platform](https://console.cloud.google.com/flows/enableapi?apiid=dialogflow.googleapis.com) 
to enable the Dialogflow API and downland the API token JSON file

- fill in the following message
  ```
  projectId=xxxxx //your Dialogflow projectId
  sessionId=123456 // session of this conversation, e.g. 123456
  languageCode=en //e.g. en, https://cloud.google.com/dialogflow/docs/reference/language
  endpoint=https://xxxxxxxxxx // whatsapp endpoint
  password=Basic xxxxxxxx //Basic base64(username:password)
  GOOGLE_APPLICATION_CREDENTIALS=C:\Users\user\xxxx\xx.json // the path of your Dialogflow API token 
  ```

## Installation

- To run the package, run the following command:
    ```
    npm install
    ```
## Usage
    ```
    npm run start
    ```


## Further reading
- [Google Cloud Platform](https://console.cloud.google.com/flows/enableapi?apiid=dialogflow.googleapis.com) 
