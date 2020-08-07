const dotenv = require('dotenv');
const path = require('path');
const restify = require('restify');

const WsDialogflowAdapter = require('@wati.io/dialogflow-adapter-whatsapp');

const DialogflowBot = require('./bot');

// Import configuration.
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({path: ENV_FILE});

// Create HTTP server
const server = restify.createServer();
server.listen(process.env.PORT || 5000, () => {
    console.log(`listening to ${server.url}`);
});

const wsDialogflowAdapter = new WsDialogflowAdapter({
    endpoint: process.env.endpoint,
    password: process.env.password,
    projectId: process.env.projectId,
    sessionId: process.env.sessionId,
    languageCode: process.env.languageCode
});

// Create the main dialog.
const bot = new DialogflowBot();

// Listen for incoming request from Twilio
server.post('/api/whatsapp/messages', (req, res) => {
    console.log("getting message");
    wsDialogflowAdapter.processActivity(req, res).then(async (context) => {
        // Route to main dialog.
        await bot.run(context);
    });
});
