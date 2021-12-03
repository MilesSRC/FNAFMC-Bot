const { Message, MessageEmbed } = require('discord.js');
const fs = require('fs');
const errors = require('../../library/errors');

module.exports = (message) => {
    // Exports Client
    const client = message.client;

    // Export Details
    const intent = message.content.startsWith(process.env.PREFIX);

    // This person wants to send a command
    if(intent){
        // Export Command Details
        let command = message.content.split(" ")[0].split(process.env.PREFIX)[1];
        const args = message.content.split(" ").slice(1);
        
        // Handle Command
        try {
            // Directory
            const path = require('path');
            const dir = path.join(__dirname, '/../commands/');

            // Alias'
            if(fs.existsSync(`${dir}${command}.js`)){
                const commandFirst = new (require(`${dir}${command}.js`))();
                
                if(commandFirst.pointsTo) //It's an alias.
                    command = commandFirst.pointsTo;
            }

            // Exists (Prevent errors)
            if(fs.existsSync(`${dir}${command}.js`)){
                // Command
                const commandClass = new (require(`${dir}${command}.js`))();

                // Permissions
                let block = false;
                if(commandClass.permissions){
                    for(let i=0; i < commandClass.permissions.length; i++){
                        const node = commandClass.permissions[i];
    
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

                if(block){
                    // Tell the user that they have no access to the command
                    const embed = new MessageEmbed();
                    embed.setTitle(":x: You don't have access to that command!");
                    embed.setFooter(commandClass.permissions.toString());
                    embed.setColor("RED");
                    
                    // Send it
                    return message.channel.send({ embeds: [embed] });
                }
                
                // if all goes well, execute.
                commandClass.execute(client, message, args);
            }
                

            
        } catch(error) {
            errors.create('Bx1', error.stack);
        }
    }
}