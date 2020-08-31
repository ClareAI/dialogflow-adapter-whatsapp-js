# WATI.io Dialogflow WhatsApp Adapter

This Dialogflow WhatsApp adapter allows you to add an additional endpoint to your 
bot for connect to the Whatsapp channel and get the response from Dialogflow. 



## Prerequisites

- [Node.js](https://nodejs.org)

  ```bash
    node --version
  ```

- WhatsApp Business API for Developers
https://developers.facebook.com/docs/whatsapp/

Apply through WhatsApp Solution Partner e.g. [WATI.io](https://wati.io)

## Installation

- To run the package, run npm install with the full path to your package directory:
    ```
    npm install @wati.io/dialogflow-adapter-whatsapp
    ```
- get the Dialogflow token from google cloud (go the [Google Cloud Platform](https://console.cloud.google.com/flows/enableapi?apiid=dialogflow.googleapis.com) 
                                              to enable the Dialogflow API and downland the API token JSON file)

- save the token json file to root directory

- save the the path of the token file to env variable `GOOGLE_APPLICATION_CREDENTIALS` , 
we suggest you use [dotenv](https://www.npmjs.com/package/dotenv) and save it to the .env file
```
process.env.GOOGLE_APPLICATION_CREDENTIALS = "C:\Users\user\xxx\xxx\xxx\NewAgent-xxxxx.json"
```

## Usage

```
const WhatsAppAdapter = require('@wati.io/dialogflow-adapter-whatsapp');
```

- get the user request from whatsapp
```
const wsAdapter = new WhatsAppAdapter({
    endpoint: 'https://whatsapp-apixxxxxx',// whatsapp endpoint
    token: 'xxxxxxxxxxxx', //The token you get from /v1/users/login, it will be used by default
    password: 'Basic xxxxxxxxxxx', //Basic base64(username:password) , it will be use to get the token from /v1/users/login, if you let `token` empty
    projectId: projectId, // your Dialogflow projectId
    sessionId: sessionId, // session of this conversation, e.g. 123456
    languageCode: languageCode //e.g. en, https://cloud.google.com/dialogflow/docs/reference/language
});

// WhatsApp endpoint
server.post('/api/whatsapp/messages', (req, res) => {
    wsAdapter.processActivity(req, res).then(async (context) => {
        console.log("user say: " + context.activity.text.body)
        await context.sendActivity("echo: " + context.activity.text.body);
    });
});

// get the response of the Dialogflow
await wsAdapter.getIntent(queries).then(async (replyText) => {
     await context.sendActivity(replyText);
});
```

## Further reading
- [dotenv](https://www.npmjs.com/package/dotenv)
- [Dialogflow language support](https://cloud.google.com/dialogflow/docs/reference/language)
