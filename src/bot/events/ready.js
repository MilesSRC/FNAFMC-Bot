const { startup } = require('../../library/embeds');
const MongoScheduler = require('../util/SchedulerUtil');

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

    // Get the scheduler ready
    const scheduler = new MongoScheduler(process.env.DB_URI, { client: client });
    global.scheduler = scheduler;
    scheduler.pull();

    const events = require("./scheduled/Events");
    events.register(scheduler, client); // Register all of our events with our mongo scheduler.

    // Log
    console.log("Freddy Fazbear has been started.");
}