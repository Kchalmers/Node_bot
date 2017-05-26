let restify = require('restify');
let builder = require('botbuilder');

let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

let connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

server.post('/api/messages', connector.listen());

let bot = new builder.UniversalBot(connector);

function sendProactiveMessage(address) {
    var msg = new builder.Message().address(address);
    msg.text('We are good to go.');
    msg.textLocale('en-US');
    bot.send(msg);
}

server.get('/api/CustomWebApi', (req, res, next) => {
        sendProactiveMessage(savedAddress);
        res.send('triggered');
        next();
    }
);

bot.dialog('/', function(session, args) {

    let savedAddress = session.message.address;

    var message = 'Hello! This is Kevin\'s bot.';
    session.send(message);

    message = 'You can also make me send a message by accessing: ';
    message += 'http://localhost:' + server.address().port + '/api/CustomWebApi';
    session.send(message);

    setTimeout(() => {
        sendProactiveMessage(savedAddress);
    }, 5000);
});