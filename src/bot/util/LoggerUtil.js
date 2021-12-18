const e = require("express");
const { MessageEmbed } = require('discord.js');

module.exports = class Logger {
    constructor(client){
        this.client = client;
        this.nv = process.env;
    };

    /**
     * Log a warning to the bots mod log.
     * 
     * @param {GuildMember} moderator The moderator who issued the warning
     * @param {String} reason The reason for the warning
     * @param {GuildMember} moderated The user that was warned
     * @param {Number} warnCount The amount of warnings a user has now
     */
    async logWarning(moderator, reason, moderated, warnCount){
        // Get the mod log channel
        const modlog = await this.client.channels.fetch(this.nv.MLG);

        // Make an embed to send
        const embed = new MessageEmbed();
        embed.setTitle(":shield: User warned!");
        embed.setColor("BLUE");
        embed.setDescription(`${moderated} was warned by ${moderator}
        **Reason**: ${reason}
        **User has**: ${warnCount} warnings now.`);
        embed.setFooter("Warned successfully");
        embed.setTimestamp();

        // Send it off!
        await modlog.send({ embeds: [embed] });
    }

    /**
     * Log a mute expiring.
     * 
     * @param {GuildMember} moderator The moderator who issued the mute
     * @param {String} reason The original reason for the mute
     * @param {GuildMember} moderated The member who was muted
     */
    async logMuteExpire(moderator, reason, moderated){
        // Get the mod log channel
        const modlog = await this.client.channels.fetch(this.nv.MLG);

        // Make an embed to send
        const embed = new MessageEmbed();
        embed.setTitle(":shield: User mute expired!");
        embed.setColor("BLUE");
        embed.setDescription(`${moderated}'s mute by ${moderator} has expired.
        **Original Reason:** ${reason}`);
        embed.setFooter("Unmuted successfully");
        embed.setTimestamp();

        // Send it off!
        await modlog.send({ embeds: [embed] });
    }
}