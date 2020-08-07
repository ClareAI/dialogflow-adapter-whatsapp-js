const WsDialogflowAdapter = require('@wati.io/dialogflow-adapter-whatsapp');

class DialogflowBot {
    constructor() {

    }

    run(context) {
        return new Promise(async (resolve, reject) => {
            switch (context.activity.type) {
                case 'text':
                    this.runText(context).then(async () => {
                        resolve(true);
                    });
                    break;
                default:
                    console.log('do nothing');
                    console.log(context.activity);
                    resolve(true);
            }
        });
    }

    runText(context) {
        return new Promise(async (resolve, reject) => {
            console.log('return message');
            console.log(context);
            const queries = context.activity.text.body;
            console.log(JSON.stringify(queries));

            const wsDialogflowAdapter = new WsDialogflowAdapter({
                endpoint: process.env.endpoint,
                password: process.env.password,
                projectId: process.env.projectId,
                sessionId: process.env.sessionId,
                languageCode: process.env.languageCode
            });

            await wsDialogflowAdapter.getIntent(queries).then(async (replyText) => {
                await context.sendActivity(replyText);
                resolve(true);
            });
        });
    }
}

module.exports = DialogflowBot;
