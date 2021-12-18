const db = require('monk')(process.env.DB_URI);
const members = db.get('members');

module.exports = class MemberData {
    /**
     * 
     * @param {GuildMember} member 
     */
    constructor(member){
        this.id = member.id;
        this.guild = member.guild.id;

        this.warnings = []
        this.punishments = []
    }

    /*
     * Cleaners
     */
    async cleaner(){
        // Clean warnings older than 6 months
        this.warnings.forEach((warning, index, arr) => {
            if((Date.now() - warning.time) > 15778800000){ // 15778800000 = 6 months in milliseconds
                this.warnings = this.warnings.splice(index, 1);
                console.log("Warning cleaned.");
            }
        });
    }

    /*
     *  Database
     */
    async get(){
        const member = await members.findOne({ id: this.id, guild: this.guild });
        if(member){
            this.id = member.id;
            this.guild = member.guild;
            this.warnings = member.warnings;
            this.punishments = member.punishments;
        }
    }

    async push(){
        const member = await members.findOne({ id: this.id, guild: this.guild });
        if(member){
            console.log("bro");
            console.log({
                id: this.id,
                guild: this.guild,
                warnings: this.warnings,
                punishments: this.punishments
            });
            await members.update({ id: this.id, guild: this.guild }, { $set: {
                id: this.id,
                guild: this.guild,
                warnings: this.warnings,
                punishments: this.punishments
            }});
        } else {
            await members.insert(this);
        }
    }
}