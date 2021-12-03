const { startup } = require('../../library/embeds');

module.exports = async (client) => {
    //
    // Launch setup
    //
    client.user.setActivity({type:"WATCHING",name:"the FNAFMC discord"});

    //
    // Events
    //
    client.on('messageCreate', require('./message'));
    client.on('guildMemberAdd', require('./memberJoin'));

    // Do Message Log
    const log = await client.channels.fetch(process.env.LOG);
    log.send({ embeds: [startup()] });

    // Log
    console.log("Freddy Fazbear has been started.");
}