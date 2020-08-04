const endpoint = "https://whatsapp-xxxxxx";
const password = "Basic xxxxxxxxx";
const to = "852xxxxx";
const userInput = "testing";
const projectId = 'xxxxxxxx';
const sessionId = '123456';
const languageCode = 'en';
process.env.GOOGLE_APPLICATION_CREDENTIALS = "C:\\Users\\xxxxxxxxx\\NewAgent-xxxxxxx.json";

const assert = require('assert');
const WsDialogflowAdapter = require('../src/index');

class MockRequest {
    constructor(body, headers) {
        this.data = body;
        this.headers = headers || {};
        this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    on(event, handler) {
        switch (event) {
            case 'data':
                handler(this.data);
                break;
            case 'end':
                handler();
                break;
        }
    }
}

class MockResponse {
    constructor() {
        this.ended = false;
        this.statusCode = undefined;
        this.body = undefined;
    }

    status(status) {
        this.statusCode = status;
    }

    send(body) {
        assert(!this.ended, `response.send() called after response.end().`);
        this.body = body;
    }

    end() {
        assert(!this.ended, `response.end() called twice.`);
        assert(this.statusCode !== undefined, `response.end() called before response.send().`);
        this.ended = true;
    }
}

function main_testing() {
    const req = new MockRequest('{"data":"testing","type":"string","from":"' + to + '"}');
    const res = new MockResponse();
    const wsDialogflowAdapter = new WsDialogflowAdapter({
        endpoint: endpoint,
        password: password,
        projectId: projectId,
        sessionId: sessionId,
        languageCode: languageCode
    });

    wsDialogflowAdapter.processActivity(req, res).then(async (context) => {
        console.log('getting message');
        console.log(context);
        wsDialogflowAdapter.getIntent(userInput).then(async (replyText)=>{
            await context.sendActivity(replyText);
        });
    });
}

main_testing();
