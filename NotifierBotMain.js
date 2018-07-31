// Imports
const Discord = require('discord.js');
const firebase = require('firebase');
const fs = require('fs');
const pokemon = require('pokemon');

const prefix = '$$';

//P0
//TODO firebasetoken, discordtoken, dbpass as args/variables

//P1
//TODO add when joining mutual server

const database = firebase.initializeApp({
    apiKey: dbtoken,
    authDomain: 'raidnotifier-80bb5.firebaseapp.com',
    databaseURL: 'https://raidnotifier-80bb5.firebaseio.com/'
});

const client = new Discord.Client({autoReconnect: true});

const errorMessages =
    [
        'Please stop; you\'re killing me. ',
        'Error with your input! ',
        'What are you doing? ',
    ];

function randomErrorMessage() {
    const index = Math.floor(Math.random() * errorMessages.length);
    return errorMessages[index];
}

client.on('ready', () => {
    database.auth().signInWithEmailAndPassword(dbuser, dbpass).catch(((error) => {
        console.log(error.message);
    }));
    console.log(`logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', (guildMember) => {
    // pokemon.all().forEach()
    // TODO Check for mutuals and import current subscriptions
    // TODO figure out if this adds too much stress to the server
    // getServerPath(guildMember)
});


client.on('message', (msg) => {
    if (!msg.content.includes(prefix) || msg.author.bot) {
        return;
    }

    //If the message is a PM
    if (msg.channel.type === 'dm' && msg.content.startsWith(prefix)) {
        console.info(`Processing command "${msg.content}" from ${msg.author.username}`);

        const args = msg.content.slice(prefix.length).split(/ +/);
        const cmd = args.shift().toLowerCase();

        if (!client.commands.has(cmd)) {
            msg.reply(`${randomErrorMessage()} That's not a command!`)
        } else {
            try {
                client.commands.get(cmd).execute(msg, args);
            } catch (error) {
                console.error(`${msg.author.username} triggered a command_exec_error: ${error.message}`);
                msg.author.send(randomErrorMessage() + error.message);
            }
        }
        //If message is in a server
    } else if (msg.channel.type === 'text') {
        if (msg.channel.name.includes('raids') && msg.content.includes(prefix)) {
            //Note: prefix is hardcoded because you can't escape a double character prefix
            let poke = msg.content.match(/\$\$([^\s]+)/)[1];
            try {
                if (pokemonExists(poke))
                    notify(msg, poke);
            } catch (error) {
                msg.author.send('Why would you do this');
            }
        }
    }
});

//Helpers

function pokemonExists(query) {
    return !!pokemon.getId(properName(query));
}

function notify(msg, poke) {
    database.database().ref(getServerPath(msg, poke)).once('value', (data) => {
        if (data.exists()) {
            let users = Object.keys(data.val());
            users.forEach((userid) => {
                if (msg.guild.members.has(`${userid}`)) {
                    msg.guild.members.get(userid).send(`Beep beep. A **${properName(poke)}** raid has been reported on **${msg.guild.name}** in channel *${msg.channel.name}*.`)
                }
            });
        }
    });
}

function properName(query) {
    return query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
}

function getMutualServers(msg) {
    let mutuals = [];
    client.guilds.forEach((guild) => {
        if (guild.members.has(`${msg.author.id}`)) {
            mutuals.push(guild.id);
        }
    });

    return mutuals;
}

function getServerPath(msg, poke) {
    return `registrations/${msg.guild.id}/${poke.toUpperCase()}`;
}

function getPokePaths(msg, poke) {
    let paths = [];
    getMutualServers(msg).forEach((serverid) => {
        paths.push(`registrations/${serverid}/${poke.toUpperCase()}`);
    });

    return paths
}

module.exports = {
    prefix,
    database,
    properName,
    pokemonExists,
    getPokePaths
};

//Commands
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');
commandFiles.forEach((ele) => {
    const command = require(`./commands/${ele}`);
    client.commands.set(command.name, command);

});

client.login(discordToken).then(() => {
    client.user.setPresence({status: 'online', game: {name: 'PM $$help to get started'}});
});
