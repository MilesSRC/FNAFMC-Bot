const { MessageEmbed } = require("discord.js");

module.exports = async (member) => {
    member.roles.add(process.env.MEM);

    const embed = new MessageEmbed();
    embed.setTitle(":wave: Welcome to FNAFMC's Discord!");
    embed.setDescription(`Please read the rules in ${await member.guild.channels.fetch(process.env.RLS)}
    You can find our server to discord (and vise versa) chat at ${await member.guild.channels.fetch(process.env.FMC)}
    If you need anymore help, just say \`?help\` anywhere in the **discord server** for more information!
    Happy chatting!`);
    embed.setColor("YELLOW");
    embed.setFooter(process.env.EMBED_FOOTER);

    member.send({ embeds: [embed] }).catch(async err => {
        const embed = new MessageEmbed();
        embed.setTitle(":x: Failed to send Welcome DM.");
        embed.setDescription(`Failed to send DM to ${member.user.tag}
        This error was logged.`);
        embed.setColor("RED");
        embed.setFooter(process.env.EMBED_FOOTER);

        const log = await member.guild.channels.fetch(process.env.LOG);
        log.send({embeds: [embed]});
    });

    const embed2 = new MessageEmbed();
    embed2.setTitle(`:wave: Welcome ${member.user.tag} to the FNAFMC's Discord!`);
    embed2.setDescription(`Please welcome them in #chat with a very warm welcome!`);
    embed2.setThumbnail(member.user.avatarURL());
    embed2.setColor("YELLOW");
    embed2.setFooter(process.env.EMBED_FOOTER);
    
    const welcome = await member.guild.channels.fetch(process.env.CHT);
    welcome.send({ embeds: [embed2] });
}