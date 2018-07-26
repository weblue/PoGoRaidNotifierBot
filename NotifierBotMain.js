// Imports
const Discord = require('discord.js');
const firebase = require('firebase');
const fs = require('fs');
const pokemon = require('pokemon');

const prefix = '$$';
//TODO firebasetoken, discordtoken, dbpass as args/variables
//TODO remove user from db when they leave the server


const database = firebase.initializeApp({
    apiKey: dbtoken,
    authDomain: 'raidnotifier-80bb5.firebaseapp.com',
    databaseURL: 'https://raidnotifier-80bb5.firebaseio.com/'
});

const client = new Discord.Client({autoReconnect: true});

client.on('ready', () => {
    database.auth().signInWithEmailAndPassword(dbuser, dbpass).catch(((error) => {
        console.log(error.message);
    }));
    console.log(`logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
    if (!msg.content.contains(prefix) || msg.author.bot) return;

    //If the message is a PM
    if (!msg.channel.type === 'dm') {
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
        if (msg.channel.name.contains('raids') && msg.contains(prefix)/*msg.isMentioned(client.user)*/) {
            let regexp = new RegExp(`${prefix}(.*) `, 'g');
            let poke = regexp.exec(msg.content)[0];

            if (pokemonExists(poke)) {
                notify(msg, poke);
            }
        }
    }
});

//Helpers

function pokemonExists(query) {
    return pokemon.getId(query).instanceof(number);
}

function notify(msg, poke) {
    database.database().ref(getServerPath(msg, poke)).once('value', (data) => {
        let users = Object.keys(data);
        users.forEach((userid) => {
            client.users.get(userid).send(`Beep beep. A ${poke} raid has been reported on ${msg.guild.name} in channel ${msg.channel.name}.`)
        });
    });
}

function getMutualServers(msg) {
    let mutuals = [];
    client.guilds.forEach((guild) => {
        if (msg.author.id in guild.members) {
            mutuals.push(guild.id);
        }
    });

    return mutuals;
}

function getServerPath(msg, poke) {
    return `registrations/${msg.guild.id}/${poke}`;
}

function getPokePaths(msg, poke) {
    let paths = [];
    getMutualServers(msg).forEach((serverid) => {
        paths.push(`registrations/${serverid}/${poke}`);
    });

    return paths
}

module.exports = {
    prefix,
    database,
    pokemonExists,
    getPokePaths
};


//Commands

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');
commandFiles.forEach((ele) => {
    const command = require(`./commands/${ele}`);

    client.commands.set(command.name, command);
});

client.login(discordtoken);