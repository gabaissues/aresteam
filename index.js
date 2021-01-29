require('dotenv').config()
require('./src/services/mercadopago.js')

const { Client, Collection } = require('discord.js')
const client = new Client()

client.commands = new Collection()
client.aliases = new Collection()

const { Handler } = require('./src/functions/handler')
const { Events } = require('./src/functions/events')

Handler(client)
Events(client)

client.login(process.env.TOKEN)