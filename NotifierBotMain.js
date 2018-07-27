// Imports
const Discord = require('discord.js');
const firebase = require('firebase');
const fs = require('fs');
const pokemon = require('pokemon');

const prefix = '$$';
//TODO firebasetoken, discordtoken, dbpass as args/variables



const database = firebase.initializeApp({
    apiKey: dbtoken,
    authDomain: 'raidnotifier-80bb5.firebaseapp.com',
    databaseURL: 'https://raidnotifier-80bb5.firebaseio.com/'
});

const client = new Discord.Client({autoReconnect: true});

const errorMessages =
    ['Please stop; you\'re killing me. ',
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
            let poke = msg.content.match(/\$\$(.+?) /)[1];

            console.log(poke.toString());

            try {
                if (pokemonExists(poke))
                    notify(msg, poke);
            } catch (error) {
                msg.author.send('Why would you do this');
            }
        } else {
            console.info(msg.channel.name + ' channel, contents: ' + msg.contents)
        }
    }
});

//Helpers

function pokemonExists(query) {
    let name = query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
    return !!pokemon.getId(name);
}

function notify(msg, poke) {
    //TODO notify
    database.database().ref(getServerPath(msg, poke)).once('value', (data) => {
        let users = Object.keys(data.val());
        console.log(users);

        users.forEach((userid) => {
            msg.guild.members.get(userid).send(`Beep beep. A *${poke}* raid has been reported on *${msg.guild.name}* in channel *${msg.channel.name}*.`)
        });
    });
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

client.login(discordToken);