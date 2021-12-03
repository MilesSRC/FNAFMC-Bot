module.exports = class ReportCommand {
    constructor(){
        this.name = "Suggest";
        this.usage = `${process.env.PREFIX}suggest`;
        this.desc = "Suggest a feature"
        this.catagory = ":wave: Suggestions and Reports"
    }

    async execute(client, message, args){
        
    }
}