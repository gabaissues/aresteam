const { readdirSync } = require('fs')

const Events = (client) => {

    readdirSync('./src/events').forEach(x => {
        
        require(`../events/${x}`)(client)

    });

}

module.exports = { Events }