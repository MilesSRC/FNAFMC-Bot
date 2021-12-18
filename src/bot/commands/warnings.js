const { MessageEmbed } = require("discord.js");
const MemberDataUtil = new (require("../util/MemberDataUtil"));

module.exports = class WarningsCommand {
    constructor(){
        this.name = "Warnings";
        this.usage = `${process.env.PREFIX}warnings [Mention?]`;
        this.desc = "Used to check warnings of you or another user";
        this.catagory = ":shield: Moderation";
    }

    async execute(client, message, args){
        let member = message.member;
        if(message.mentions.members.first())
            member = message.mentions.members.first();

        // Get member data
        const data = await MemberDataUtil.getMember(member);
        
        // Parse a string
        let string = "";
        data.warnings.forEach((warning, index) => {
            string += `-> **Warning #${index + 1}** \n   --> Reason: **${warning.reason}**\n   --> Moderator: <@${warning.moderator}>\n   --> Issued: **${new Date(warning.time).toLocaleString()}**\n\n`;
        });

        // Parse an embed together
        const embed = new MessageEmbed();
        embed.setTitle(`:shield: ${member.user.tag} has ${data.warnings.length} warning(s)!`);
        embed.setDescription(string);
        embed.setColor("BLUE");
        embed.setFooter("Warnings as of");
        embed.setTimestamp();

        // Send it off
        message.channel.send({ embeds: [embed] });
    }
}