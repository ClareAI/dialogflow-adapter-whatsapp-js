const axios = require('axios');
const dialogflow = require('@google-cloud/dialogflow');
const sessionClient = new dialogflow.SessionsClient();

class WsDialogflowAdapter {
    constructor(settings) {
        this.projectId = settings.projectId;
        this.sessionId = settings.sessionId;
        this.languageCode = settings.languageCode;
        this.endpoint = settings.endpoint;
        this.password = settings.password;
        this.token = settings.token;
    }

    async getIntent(queries) {
        return new Promise(async (resolve, reject) => {
            const projectId = this.projectId;
            const sessionId = this.sessionId;
            const languageCode = this.languageCode;
            await executeQueries(projectId, sessionId, queries, languageCode).then(async (replyText) => {
                resolve(replyText);
            });
        });
    }

    processActivity(req, res) {
        return new Promise(async (resolve, reject) => {
            const request = await parseRequest(req);
            let endpoint = this.endpoint;
            let password = this.password;
            let token = this.token;
            let to = request && request.from;
            let TurnContext = {
                endpoint: endpoint,
                password: password,
                token: token,
                to: to,
                type: "Message"
            };
            TurnContext.activity = request;
            TurnContext.sendActivity = this.sendActivities;
            res.send(200);
            resolve(TurnContext);
        });
    }

    sendActivities(context) {
        return new Promise(async (resolve, reject) => {
            let endpoint = this.endpoint;
            let password = this.password;
            let token = this.token;
            token = token || await getToken(endpoint, password);
            const instance = axios.create({
                baseURL: endpoint + "/v1/messages",
                timeout: 2000,
                headers: {'Authorization': "Bearer " + token, 'Content-Type': 'application/json'}
            });
            let params = {
                preview_url: false,
                recipient_type: "individual",
                to: this.to,
                type: "text",
                text: {body: context}
            };
            let result = await instance.post("", params);
            resolve(result);
        });

    }
}

async function detectIntent(
    projectId,
    sessionId,
    query,
    contexts,
    languageCode
) {
    // The path to identify the agent that owns the created intent.
    const sessionPath = sessionClient.projectAgentSessionPath(
        projectId,
        sessionId
    );

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode: languageCode
            }
        }
    };

    if (contexts && contexts.length > 0) {
        request.queryParams = {
            contexts: contexts
        };
    }

    const responses = await sessionClient.detectIntent(request);
    return responses[0];
}

async function executeQueries(projectId, sessionId, queries, languageCode) {
    // Keeping the context across queries let's us simulate an ongoing conversation with the bot
    return new Promise(async (resolve, reject) => {
        let context;
        let intentResponse;
        try {
            intentResponse = await detectIntent(
                projectId,
                sessionId,
                queries,
                context,
                languageCode
            );
            resolve(intentResponse.queryResult.fulfillmentText);
            // Use the context from this response for next queries
            context = intentResponse.queryResult.outputContexts;
        } catch (error) {
            console.log(error);
        }
    });
}

function parseRequest(req) {
    return new Promise((resolve, reject) => {
        if (req.body) {
            try {
                const activity = validateAndFixActivity(req.body);
                resolve(activity);
            } catch (err) {
                reject(err);
            }
        } else {
            let requestData = '';
            req.on('data', (chunk) => {
                requestData += chunk;
            });
            req.on('end', () => {
                try {
                    req.body = JSON.parse(requestData);
                    const activity = validateAndFixActivity(req.body);
                    resolve(activity);
                } catch (err) {
                    reject(err);
                }
            });
        }
    });
}

function validateAndFixActivity(activity) {
    if (activity.messages && activity.messages[0]) {
        activity = activity.messages[0]
    }
    return activity;
}

function getToken(endpoint, password) {
    return new Promise(async (resolve, reject) => {
        const instance = axios.create({
            baseURL: endpoint + "/v1/users/login",
            timeout: 2000,
            headers: {'Authorization': password}
        });
        let result = await instance.post();
        let token = result && result.data && result.data.users && result.data.users[0] && result.data.users[0].token;
        resolve(token);
    });
}

module.exports = WsDialogflowAdapter;
