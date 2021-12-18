const Logger = require("../../util/LoggerUtil");

module.exports = class MuteTask {
    constructor(client){
        this.client = client;
        return this;
    }

    async onExpire(muteDetails, scheduler){
        const client = global.scheduler.client;

        // Fetch the guild
        const guild = await client.guilds.fetch(muteDetails.guild);
        const member = await guild.members.fetch(muteDetails.member);
        const moderator = await guild.members.fetch(muteDetails.moderator);

        // Unmute the member
        if(member.roles.cache.find(role => role.id == process.env.MTD)){
            member.roles.remove(process.env.MTD);
        }

        // Log expiry
        const logger = new Logger(client);
        await logger.logMuteExpire(moderator, muteDetails.reason, member);
    }
}