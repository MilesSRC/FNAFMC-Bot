module.exports = class MongoScheduler {
    /**
     * Construct a MongoScheduler
     * 
     * @param {String} uri Database URI (required)
     * @param {Object} options Scheduler Options
     * @param {String} options.name Database name (Default: Scheduled)
     * @param {Number} options.polling Polling rate in milliseconds to pull from the database. (Default 1 minute)
     */
    constructor(uri, options){
        if(!options) options = {};

        this.db = require('monk')(uri);
        this.collection = this.db.get("tasks");

        // Polling Rate (1 minute default)
        this.pRate = options.polling || 60000;

        // Puller
        this.$puller = setInterval(this.pull, this.pRate);

        // Setup events
        this.events = [];

        // Optional Discord Client
        if(options.client)
            this.client = options.client;
    };

    /** 
     * Register an event handler
     * @param {String} name Name of the event
     * @param {Function} callback A callback to call when a scheduled task is scheduled to run with the same name as the event.
     */
    async registerTask(name, callback){
        this.events.push({
            name: name,
            cb: callback
        });
    }

    /**
     * Run a task callback with a name
     * @param {Object} scheduled
     * @param {String} scheduled.name Name of the scheduled tasks name
     * @param {Object} scheduled.args Arguments to pass to the callback
     */
    async runTask(scheduled){
        this.events.forEach(event => {
            if(scheduled.name == event.name){
                event.cb(scheduled.args);
            }
        })
    }

    /**
     * Schedule an event
     * 
     * @param {String} name The event name to schedule
     * @param {Number} when The date to run at
     * @param {Object} args The arguments to be passed when the event runs.
     */
    async scheduleTask(name, when, args){
        await this.collection.insert({
            name: name,
            runAt: when,
            args: args
        });
    } 

    /**
     * Fired when the polling rate is reached
     */
    async pull(){
        // Pull and check entries
        const tasks = await global.scheduler.collection.find({});

        // Run through tasks and run them if their due (shortened)
        tasks.filter(task => task.runAt < Date.now()).forEach(async task => {
            await global.scheduler.runTask(task)
            await global.scheduler.collection.findOneAndDelete({ _id: task._id });
        });
    }
}