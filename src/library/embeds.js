/**
 * Start a reaction collector in a channel.
 *
 * @param {Object} reactionOptions
 * @param {Array} reactionOptions.reactions Array of emoji's to watch for
 * @param {Channel} reactionOptions.channel Channel to send collector embed in
 * @param {User} reactionOptions.user User to filter in collector
 * @param {MessageEmbed} reactionOptions.embed Embed to send to collect with
 * 
 * @param {Function} [reactionOptions.error] Error handler for reaction collector
 * @param {Boolean} [reactionOptions.deleteAfter = true] Delete message after collection
 * @param {Boolean} [reactionOptions.collectFirst = true] Only collect first reaction sent
 * @returns {(Boolean | MessageReaction | Array[MessageReaction])}
 */

const { MessageEmbed } = require("discord.js");

exports.startReaction = async (reactionOptions) => {
    if(!reactionOptions.reactions)
        return console.error("No reactions were provided in reactionOptions!");

    if(!reactionOptions.channel)
        return console.error("No channel was provided in reactionOptions!");
    
    if(!reactionOptions.user)
        return console.error("No user was provided to lock on to!")

    if(reactionOptions.deleteAfter == undefined)
        reactionOptions.deleteAfter = true;

    if(reactionOptions.collectFirst == undefined)
        reactionOptions.collectFirst = true;

    if(!reactionOptions.embed)
        return console.error("No embed was provided to send!");

    try {
        // Destructure Required
        const { channel, reactions, embed, user, // Variables
                deleteAfter, collectFirst  } = reactionOptions; // Options
        
        // Create filter
        const filter = (r, u) => (u.id === user.id && reactions.indexOf(r.emoji.name) >= 0);

        // Send message and wait for reactions
        const message = await channel.send({ embeds: [embed] });
        message.awaitReactions({ filter, time: process.env.REACTION_WAIT_TIME * 1000, errors: ['time']}).then(collected => {
            if(deleteAfter)
                message.delete();
            
            return (collectFirst ? collected.first() : collected);
        }).catch(err => {
            if(reactionOptions.error)
                return reactionOptions.error('time');

            return false; // Didn't collect anything, aka. ran out of time.
        })

    } catch(err) {
        console.error("Caught an error in trying to start a reaction collector!");
        console.error(err);

        if(reactionOptions.error)
                return reactionOptions.error('collection', err);

        return false;
    }
}

exports.basicErr = (content) => {
    const embed = new MessageEmbed();
    embed.setTitle(":x: "+content);
    embed.setColor("RED");
    return embed;
}

exports.startup = () => {
    const embed = new MessageEmbed();
    embed.setTitle(":white_check_mark: Freddy Fazbear started.");
    embed.setFooter(process.env.EMBED_FOOTER);
    embed.setColor("GREEN");
    return embed;
}