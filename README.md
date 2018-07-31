# PoGoRaidNotifierBot
This is a NodeJS-based Discord bot to allow users to track subscribed pokemon in community raid servers

Invite the bot to your server: https://discordapp.com/oauth2/authorize?client_id=471887515389788160&scope=bot

# Commands and usage
**$$register [pokemon name]**

**$$unregister [pokemon name]**

The bot will check for any $$ in messages to channels containing the word *raids* in the title and ping all subscribed users

# Explanation of code usage
To run the bot just do `node NotifierBotMain.js`

Prefix is hardcoded and **must be hardcoded to support inline message reading**

Configuration is currently hardcoded as well but is slated to be moved to a configuration file soon.

### Configuration fields
(some of these are planned so they may not match the names in code)

firebaseToken: [your firebase token],

authDomain: [firebase auth server url],

databaseURL: [firebase db url],

dbuser: [username to auth into firebase],

dbpass: [password to auth into firebase],

discordToken: [your discord API token]
