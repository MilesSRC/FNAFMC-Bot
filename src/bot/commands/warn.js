const mdu = new (require('../util/MemberDataUtil'));
const embeds = require('../../library/embeds');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const Logger = new (require('../util/LoggerUtil'));

module.exports = class WarnCommand {
    constructor(){
        this.name = "Warn";
        this.usage = `${process.env.PREFIX}warn <@Mention> Reason...`;
        this.desc = "Issue a warning";
        this.catagory = ":shield: Moderation";
        this.permissions = ["!KICK_MEMBERS"];
    }

    async execute(client, message, args){
        // A
        const scheduler = global.scheduler;

        // Require dependants
        if(!args[0])
            return message.channel.send({ embeds: [ embeds.basicErr("You must provide a user to warn. Usage: " + this.usage) ]});
        
        // Get a reason
        let reason;
        if(!args[1]){
            reason = "No reason specified.";
        } else {
            reason = message.content.split(" ").slice(2).join(" ");
        }
            
        // Double check for mention
        if(!message.mentions.members.first())
            return message.channel.send({ embeds: [embeds.basicErr("You must mention/ping a user to warn. Usage: " + this.usage)]});

        // Les go
        const member = message.mentions.members.first();
        const memberData = await mdu.getMember(member);

        if(!memberData)
            return message.channel.send({ embeds: [ embeds.basicErr("Invalid mention. Couldn't retrieve user data. Usage: " + this.usage) ]});
        
        // Issue a warning and push the user data
        memberData.warnings.push({
            moderator: message.author.id,
            reason: reason,
            time: Date.now()
        });

        await memberData.cleaner();
        await memberData.push();

        const warned = new MessageEmbed();
        warned.setTitle(":warning: You have been warned.");
        warned.setDescription(`You were warned for: \n**${reason}**\n\n*You may be muted for some duration of time.*`);
        warned.setFooter(`Warned by ${message.author.tag}`);
        warned.setColor("YELLOW");
        member.send({embeds: [warned]}).catch(() => message.channel.send(member, { embeds: [warned] }));

        // Go ahead and do warning checks
        switch(memberData.warnings.length){
            case 1:
                // Do nothing
                break;
            case 2:
                // 10m mute
                await member.roles.add(process.env.MTD);
                await scheduler.scheduleTask("muteExpire", moment().add(10, "minutes").toDate(), {
                    guild: message.guild.id,
                    member: member.user.id,
                    moderator: message.author.id,
                    reason: reason
                });
                break;
            case 3:
                // 1h mute
                await member.roles.add(process.env.MTD);
                await scheduler.scheduleTask("muteExpire", moment().add(1, "hour").toDate(), {
                    guild: message.guild.id,
                    member: member.user.id,
                    moderator: message.author.id,
                    reason: reason
                });
                break;
            case 4:
                // 1 day mute
                await member.roles.add(process.env.MTD);
                await scheduler.scheduleTask("muteExpire", moment().add(1, "day").toDate(), {
                    guild: message.guild.id,
                    member: member.user.id,
                    moderator: message.author.id,
                    reason: reason
                });
                break;
            case 5:
                // 3 day mute
                await member.roles.add(process.env.MTD);
                await scheduler.scheduleTask("muteExpire", moment().add(3, "day").toDate(), {
                    guild: message.guild.id,
                    member: member.user.id,
                    moderator: message.author.id,
                    reason: reason
                });
                break;
            default:
                if(memberData.warnings.length > 5){
                    // 3 day mute
                    await member.roles.add(process.env.MTD);
                    await scheduler.scheduleTask("muteExpire", moment().add(3, "day").toDate(), {
                        guild: message.guild.id,
                        member: member.user.id,
                        moderator: message.author.id,
                        reason: reason
                    });
                }
        }

        const embed = new MessageEmbed();
        embed.setTitle(":white_check_mark: User warned.");
        embed.setDescription(`User now has **${memberData.warnings.length} warnings**`);
        embed.setColor("GREEN");
        message.channel.send({ embeds: [embed] });

        Logger.logWarning(message.member, reason, member, memberData.warnings.length);
    }
}