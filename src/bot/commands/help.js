const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = class HelpCommand {
    constructor(){
        this.name = "Help";
        this.usage = `${process.env.PREFIX}help`;
        this.desc = "List all of my commands!";
        this.catagory = "<:freddyexe:911240532645261352> Bot Related";
    }

    async execute(client, message, args){
        if(!message.guild)
            return message.channel.send(":x: Please use this command in a server to see your permission specific commands!");
        
        // Otherwise, lets go.
        // Find Commands
        const catagories = {};

        // Directory
        const path = require('path');
        const dir = path.join(__dirname, '/../commands/');

        fs.readdirSync(dir).forEach((commandFile, index, arr) => {
            const command = new (require(`${dir}${commandFile}`))();

            // alias checking
            if(command.pointsTo)
                return 'ignore, it points to another command';

            // ensure basic structure
            if(!command.name)
                command.name = commandFile;
            
            if(!command.usage)
                command.usage = `${process.env.PREFIX}${commandFile}`;
            
            if(!command.desc)
                command.desc = "**This command doesn't have a description.**";

            if(!command.catagory)
                command.catagory = "🤪 Misc";

            // Permissions
            let block = false; // Used to block the command from being added.
            if(command.permissions){
                for(let i=0; i < command.permissions.length; i++){
                    const node = command.permissions[i];

                    switch(node[0]){
                        case '!': // Discord Permissions Node
                            if(!message.member.permissions.has(node.slice(1)))
                                block = true;
                            break;

                        case '@': // Restricted to a user id
                            if(message.author.id != node.slice(1))
                                block = true;
                            break;

                        case '&': // Restrcited to a discord role
                            if(!message.member.roles.find(role => role.id == node.slice(1)))
                                block = true;
                            break;
                    }
                }
            }

            // Apply command to catagories.
            if(catagories[command.catagory] && !block){
                catagories[command.catagory] += `**${command.name}** (\`\`${command.usage}\`\`) - ${command.desc}\n`
            } else if (!catagories[command.catagory] && !block) {
                catagories[command.catagory] = `**${command.name}** (\`\`${command.usage}\`\`) - ${command.desc}\n`
            }

            // When finished, compile an embed and send it.
            if(index == arr.length - 1){
                // Start Embed
                const embed = new MessageEmbed();
                embed.setTitle(":grey_question:  Here ya go! My commands are:");
                embed.setColor(process.env.EMBED_COLOR);

                // Compile fields
                Object.keys(catagories).forEach((catagory) => embed.addField(catagory, catagories[catagory]));
                
                // Image (lol)
                embed.setThumbnail("https://milesr.dev/res/img/fnafmc/botpic.gif");

                // Footer
                if(process.env.EMBED_FOOTER)
                    embed.setFooter(process.env.EMBED_FOOTER);
                
                // Send it to dms
                message.channel.send(":white_check_mark: I sent my commands to your DM's! :)");
                message.author.send({ embeds: [embed] }).catch(err => {
                    message.channel.send(":x: Couldn't send the commands list to your DM's, so I'll put it here.");
                    message.channel.send({ embeds: [embed] });
                });
            }
        });
    }
}