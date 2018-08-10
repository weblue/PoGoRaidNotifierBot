const main = require('../NotifierBotMain');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands');

commandFiles.forEach((ele) => {
    const command = require(`./${ele}`);
    commands.push(command);
});

module.exports = {
    name: 'help',
    description: 'Lists commands and their usages',
    usage: `${main.prefix}help`,
    execute(msg, args) {
        /** Ex. !help
         *     Explains usage of implemented commands
         *
         * Ex. !help
         *     Lists all commands and their usages
         */
        if (args.length === 0) {
            let replyString = 'This bot is to allow you to register interest in raid encounters and pings interested users.\nProvided by the Creators Collective, http://creatorscollective.club\nWant to suggest changes? Head on over to https://github.com/weblue/PoGoRaidNotifierBot/issues!\n\n';
            commands.forEach((command) => {
                if (command.name) {
                    replyString += `**${main.prefix}${command.name}**: ${command.description} \nUsage: ${command.usage}\n\n`;
                }
            });

            replyString += 'To report, simply add $$[pokemon name] to any raid report. For Alolan Pokemon, use the form "Alolan $$[pokemon name]."\n\n';
            replyString += 'Currently, there\'s an issue with registering new servers to existing users. If you aren\'t getting notifications from a server, just register again.';

            msg.author.send(replyString);
        } else if (args.length === 1) {
            msg.reply('hello');
        } else {
            // Send message to user on error
            throw new Error(`Usage: ${this.usage}`);
        }
    },
};
