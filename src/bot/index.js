const MongoScheduler = require('./util/SchedulerUtil');

module.exports.initialize = () => {
    // Discord
    const discord = require('discord.js');
    const client = new discord.Client({ 
        intents: 
        ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MEMBERS"] 
    });

    // Events
    client.on('ready', require('./events/ready'));

    // Login
    client.login(process.env.TOKEN);
}