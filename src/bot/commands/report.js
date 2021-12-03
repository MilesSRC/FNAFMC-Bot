const embeds = require('../../library/embeds');
const { Permissions: perms, MessageEmbed } = require('discord.js');
const nv = process.env;

module.exports = class ReportCommand {
    constructor(){
        this.name = "Player Report";
        this.usage = `${process.env.PREFIX}report`;
        this.desc = "Report a player/user"
        this.catagory = ":wave: Suggestions and Reports"

        this.db = require('monk')(process.env.DB_URI);
        this.reports = this.db.get("Reports");
    }

    async execute(client, message, args){
        if(await this.reports.findOne({ id: message.author.id, open: true }))
            return message.channel.send(embeds.basicErr(":x: You already have a player report open!"));

        // Create Channel
        message.guild.channels.create(`report-${await this.reports.count({}) + 1}-unresolved`, {
            type: "GUILD_TEXT",
            permissionOverwrites: [
                {
                    id: message.author.id,
                    allow: [perms.FLAGS.VIEW_CHANNEL, perms.FLAGS.SEND_MESSAGES, perms.FLAGS.EMBED_LINKS, perms.FLAGS.READ_MESSAGE_HISTORY, perms.FLAGS.ATTACH_FILES]
                },
                {
                    id: nv.MEM,
                    deny: [perms.FLAGS.VIEW_CHANNEL, perms.FLAGS.SEND_MESSAGES, perms.FLAGS.USE_PRIVATE_THREADS]
                },
                {
                    id: nv.CDT,
                    deny: [perms.FLAGS.VIEW_CHANNEL, perms.FLAGS.SEND_MESSAGES, perms.FLAGS.USE_PRIVATE_THREADS]
                },
                {
                    id: nv.MOD,
                    allow: [perms.FLAGS.VIEW_CHANNEL, perms.FLAGS.SEND_MESSAGES, perms.FLAGS.USE_PRIVATE_THREADS]
                },
                {
                    id: nv.ADM,
                    allow: [perms.FLAGS.VIEW_CHANNEL, perms.FLAGS.SEND_MESSAGES, perms.FLAGS.USE_PRIVATE_THREADS]
                },
                {
                    id: message.guild.roles.everyone,
                    deny: [perms.FLAGS.VIEW_CHANNEL, perms.FLAGS.SEND_MESSAGES, perms.FLAGS.USE_PRIVATE_THREADS]
                }
            ],
            parent: nv.RAS,
            reason: `${message.author.tag} created a new reports channel in #${message.channel.name}`
        }).then(async channel => {
            // Setup data in database
            this.reports.insert({
                id: message.author.id,
                open: true,
                channel: channel.id
            });

            // Ping user
            channel.send(`<@${message.author.id}>`);

            // Starting embed
            const embed = new MessageEmbed();
            embed.setTitle(`<:Yes:911270472073752576> Player report was created by ${message.author.tag}`);
            embed.setColor("GREEN");
            embed.setFooter("Created");
            embed.setTimestamp();

            // Let's ask somethings
            const embed2 = new MessageEmbed();
            embed2.setTitle(":wave: Thanks for reporting a player!");
            embed2.setDescription(`Please use this chat to:
            1). Tell us what happened or what the player did wrong.
            2). What's their IGN/Discord Username?
            3). When and where did this happen?
            4). Provide any images.`);
            embed2.setColor("GREEN");
            embed2.setFooter(process.env.EMBED_FOOTER);
            
            await channel.send({ embeds: [embed, embed2] });
        });
    }
}