# PoGoRaidNotifierBot
This is a NodeJS-based Discord bot to allow users to track subscribed pokemon in community raid servers

Invite the bot to your server: https://discordapp.com/oauth2/authorize?client_id=471887515389788160&scope=bot

# Commands and usage
**$$register [pokemon name]** to subscribe to raids for this pokemon

**$$unregister [pokemon name]** to unsubscribe to raids for this pokemon

Alolan Pokemon should be registered by their non-Alolan form

# Explanation of code usage
To run the bot just do `node NotifierBotMain.js`

Configuration is currently hardcoded as well but is slated to be moved to a configuration file soon.

### Configuration fields
(some of these are planned so they may not match the names in code)

firebaseToken: [your firebase token],

authDomain: [firebase auth server url],

databaseURL: [firebase db url],

dbuser: [username to auth into firebase],

dbpass: [password to auth into firebase],

discordToken: [your discord API token]
