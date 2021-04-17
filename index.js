var fetch = require('node-fetch')
const Websocket = require('ws')
const TelegramBot = require('node-telegram-bot-api');


// Telegram Bot Options
const TOKEN = '1621727244:AAHXFdbNSRFvNS45g9Q1ZHNJ92kasH6ZVfw';
const options = {
    webHook: {
        port: process.env.PORT
    }
};

const url = 'https://yallah365.herokuapp.com:443';
const bot = new TelegramBot(TOKEN, options);
bot.setWebHook(`${url}/bot${TOKEN}`);


// To Get User Tokens & Websocket URL
async function request_cread() {
    return fetch('https://directline.botframework.com/v3/directline/conversations', {
        method: 'POST',
        body: '',
        headers: {
            'Authorization': 'Bearer YkMDNDm0M9U.KgEeH_9tHT2OGIAhL97gM9hyQQbQxPPFc2H2LDNzJoY',
            'Accept': 'application/json',
            'x-ms-bot-agen': 'DirectLine/3.0 (directlinejs)',
        }
    }).then(response => {
        return response.json()
    })
}


// Send User Data To API With conversationId
async function send_data_bot(conversationId, bearer, post_data) {
    return fetch(`https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities`, {
        method: 'POST',
        body: JSON.stringify(post_data),
        headers: {
            'Authorization': `Bearer ${bearer}`,
            'Accept': '	*/*',
            'x-ms-bot-agen': 'DirectLine/3.0 (directlinejs)',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json()
    })
}


// Bot Starter....


bot.on('message', function onMessage(msg) {


    if (msg.text.toLowerCase() == '/start') {
        bot.sendMessage(msg.chat.id, `Hello ${msg.from.username},\nWelcome To Yallah365 Bot.\n\nThis Bot Allows You To Get Your\nMicrosoft 365 Account Details.\n\nFor More Helps(/help).`)
    } else if (msg.text.toLowerCase() == '/help') {
        bot.sendMessage(msg.chat.id, `To get You Account Details,\nPlease write your CPR:Block\n\nExample:\n 012345678:1234`)
    } else {

    }


    if (msg.text.includes(':')) {
        var cpr = msg.text.split(':')[0]
        var mogam3 = msg.text.split(':')[1]

        var post_data_yes = { "type": "message", "text": "نعم", "from": { "id": "", "name": "" }, "locale": "en-US", "textFormat": "plain", "timestamp": "2021-04-17T21:25:22.393Z", "channelData": { "clientActivityId": "1618694705196.07060476049690834.0" }, "entities": [{ "type": "ClientCapabilities", "requiresBotState": true, "supportsTts": true, "supportsListening": true }] }
        var post_data_cpr = { "type": "message", "text": `${cpr}`, "from": { "id": "", "name": "" }, "locale": "en-US", "textFormat": "plain", "timestamp": "2021-04-17T21:25:22.393Z", "channelData": { "clientActivityId": "1618694705196.07060476049690834.0" }, "entities": [{ "type": "ClientCapabilities", "requiresBotState": true, "supportsTts": true, "supportsListening": true }] }
        var post_data_mgm3 = { "type": "message", "text": `${mogam3}`, "from": { "id": "", "name": "" }, "locale": "en-US", "textFormat": "plain", "timestamp": "2021-04-17T21:25:22.393Z", "channelData": { "clientActivityId": "1618694705196.07060476049690834.0" }, "entities": [{ "type": "ClientCapabilities", "requiresBotState": true, "supportsTts": true, "supportsListening": true }] }


        request_cread().then(res => {
            var user_token = res.token
            var websocket_url = res.streamUrl
            var conversationId = res.conversationId
            const ws = new Websocket(websocket_url);
            ws.on('message', function incoming(data) {
                if (data === '') {
                    console.log('Nothing....')
                } else {
                    var websocketdata = JSON.parse(data)
                    if (websocketdata.activities[0].text.includes('قد تم الحصول على بياناتك')) {
                        bot.sendMessage(msg.chat.id, websocketdata.activities[0].text)
                        ws.on('close', function close() {
                            console.log('disconnected');
                        });
                    }

                }

            });
            send_data_bot(conversationId, user_token, post_data_yes).then(data_res => {
                console.log(data_res)
                send_data_bot(conversationId, user_token, post_data_cpr).then(data_res => {

                    console.log(data_res)
                    send_data_bot(conversationId, user_token, post_data_mgm3).then(data_res => {
                        console.log(data_res)

                    })
                })
            })


        })

    }
})