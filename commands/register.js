const main = require('../NotifierBotMain');

module.exports = {
    name: 'register',
    description: 'Registers user interest in given Pokemon',
    usage: `${main.prefix}register {pokemon}`,
    execute(msg, args) {
        /* Ex. !register Machop
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

        console.info(`Registering user ${msg.author.username} to ${args[0]}`);

        main.getPokePaths(msg, args[0]).forEach((path) => {
            main.database.database().ref(`${path}/${msg.author.id}`).set(true);
        });

        msg.reply(`Registered ${main.properName(args[0])} to your alerts`);
    }
};