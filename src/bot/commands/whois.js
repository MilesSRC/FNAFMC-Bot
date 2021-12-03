const { MessageEmbed } = require("discord.js");

module.exports = class ReportCommand {
    constructor(){
        this.name = "Whois";
        this.usage = `${process.env.PREFIX}whois <@Mention>`;
        this.desc = "Get your information for the server"
        this.catagory = ":busts_in_silhouette: User Specific"
    }

    async execute(client, message, args){
        const mentions = message.mentions.members;
        if(mentions.first()){
            const member = mentions.first();

            const embed = new MessageEmbed();
            embed.setTitle(`:busts_in_silhouette: Discord member data for ${member.user.tag}`);
            embed.setDescription(`**User**: ${member.user}
            **User ID:** ${member.user.id}
            **User Created**: ${member.user.createdAt.toDateString()}
            **Member Joined**: ${member.joinedAt.toDateString()}
            **Member Role Count**: ${member.roles.cache.size}
            **Member's Highest Role**: ${member.roles.highest || "No roles"}`);
            embed.setThumbnail(member.user.avatarURL());
            embed.setColor(member.displayHexColor);

            message.channel.send({ embeds: [embed] });
        } else {
            const member = message.member;

            const embed = new MessageEmbed();
            embed.setTitle(`:busts_in_silhouette: Discord member data for ${member.user.tag}`);
            embed.setDescription(`**User**: ${member.user}
            **User ID:** ${member.user.id}
            **User Created**: ${member.user.createdAt.toDateString()}
            **Member Joined**: ${member.joinedAt.toDateString()}
            **Member Role Count**: ${member.roles.cache.size}
            **Member's Highest Role**: ${member.roles.highest || "No roles"}`);
            embed.setThumbnail(member.user.avatarURL());
            embed.setColor(member.displayHexColor);

            message.channel.send({ embeds: [embed] });
        }
    }
}