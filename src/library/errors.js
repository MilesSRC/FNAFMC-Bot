const errors = {
    // Bot Related Errors
    Bx1: "Command Caught Error",
    Bx99: "Discord.js Message Failure"
}

exports.create = (code, stack) => {
    console.error(stack);
    console.log(code);
}