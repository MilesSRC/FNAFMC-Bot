const MemberData = require("./lib/MemberData");

module.exports = class MemberDataUtil {
    constructor(){
        return this;
    }

    /**
     * 
     * @param {GuildMember} member 
     * @returns {MemberData}
     */
    async getMember(member){
        const memberClass = new MemberData(member);
        await memberClass.get();
        return memberClass;
    }
}