const { MessageEmbed } = require("discord.js");

module.exports = class PingCommand {
    constructor(){
        this.name = "Ping";
        this.usage = `${process.env.PREFIX}ping`;
        this.desc = "Used to ping me!"
        this.catagory = "<:freddyexe:911240532645261352> Bot Related"
    }

    async execute(client, message, args){
        const embed = new MessageEmbed({
            description: `
:heartbeat: - ${client.ws.ping} ms
:envelope_with_arrow: - ${Date.now() - message.createdAt} ms`,
            color: "903d0b"
        });
        message.channel.send( { embeds: [embed] } );
    }
}