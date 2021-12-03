module.exports = class ReportCommand {
    constructor(){
        this.name = "Fix";
        this.usage = `${process.env.PREFIX}fix`;
        this.desc = "Fix all channels";
        this.catagory = ":test_tube: Developer";
        this.permissions = ["@119602225696735232"];
    }

    async execute(client, message, args){
        let count = 0;
        const guild = message.guild;
        
        const channels = await guild.channels.fetch();
        channels.each(async channel => {
            if(channel.type == "GUILD_TEXT"){
                const catagory = channel.parent;
                if(catagory.name.toLowerCase().includes("rp") || catagory.name.toLowerCase().includes("roleplay"))
                    channel.delete("RP Channel"), count++;
            }
        });

        message.channel.send(`:white_check_mark: Deleted ${count} roleplay channels`);
    }
}