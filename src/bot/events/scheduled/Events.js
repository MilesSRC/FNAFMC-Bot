const MuteTask = require("./MuteTask")

/**
 * Register all events for the bot
 * 
 * @param {MongoScheduler} scheduler 
 */
exports.register = (scheduler, client) => {
    // Mute Tasks
    const mute = new MuteTask(client);
    scheduler.registerTask('muteExpire', mute.onExpire);
}