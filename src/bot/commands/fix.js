module.exports = class FixCommand {
    constructor(){
        this.name = "Fix";
        this.usage = `${process.env.PREFIX}fix`;
        this.desc = "Fix all channels";
        this.catagory = ":test_tube: Developer";
        this.permissions = ["@119602225696735232"];
    }

    async execute(client, message, args){
        const channels = await message.guild.channels.fetch();

        channels.forEach(channel => {
            if(channel.type == "GUILD_TEXT"){
                console.log("❌ Removed perms to " + channel.name);

                channel.permissionOverwrites.create(message.guild.roles.cache.find(id => id.id == "704741911746838695"), {
                    SEND_MESSAGES: false,
                });
            }

            if(channel.type == "GUILD_VOICE"){
                console.log("❌ Removed perms to " + channel.name);

                channel.permissionOverwrites.create(message.guild.roles.cache.find(id => id.id == "704741911746838695"), {
                    SPEAK: false
                });
            }
        })
    }
}