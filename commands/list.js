const main = require('../NotifierBotMain');

module.exports = {
    name: 'register',
    description: 'Registers user interest in given Pokemon',
    usage: `${main.prefix}register {pokemon}`,
    execute(msg, args) {
        // TODO list out all pokemon that are currently subscribed to
        msg.author.send('Not yet implmented')
    }
};