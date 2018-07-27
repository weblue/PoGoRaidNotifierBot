const main = require('../NotifierBotMain');

module.exports = {
    name: 'unregister',
    description: 'Unregisters user interest in given Pokemon',
    usage: `${main.prefix}unregister {pokemon}`,
    execute(msg, args) {
        /* Ex. !unregister Machop
        *
        * - Check # of params and validate pokemon
        * - Register user to server's pokemon in DB
        */

        if (args.length !== 1) {
            msg.reply(`Usage: ${this.usage}`);
            return;
        }
        if (!main.pokemonExists(args[0])) {
            msg.reply('You must specify a valid Pokemon!');
            return;
        }

        console.info(`Unregistering user ${msg.author.username} to ${args[0]}`);

        main.getPokePaths(msg, args[0]).forEach((path) => {
            main.database.database().ref(`${path}/${msg.author.id}`).set(null);
        });

        msg.reply(`Unregistered ${args[0]} to your alerts`);
    }
};