const Discord = require('discord.js')
const { database } = require('../../services/firebase')

module.exports = {
    name: 'portfólio',
    aliases: ['portfólio', 'portfolio'],
    run: async(client, message, args) => {

        if(!args[0]) return message.reply('Você utilizou o comando **incorretamente**. Utilize: -portfólio <endereço>')

        const user = await database.ref(`Perfils/${message.author.id}`).once('value')
        if(user.val() === null) {

            database.ref(`Perfils/${message.author.id}`).set({
                portfolio: args[0],
                avalia: 0,
                email: 'Não definido.',
                recebido: 0
            })
    
            message.reply('Portfólio definido com **sucesso**!')    

        } else {

            database.ref(`Perfils/${message.author.id}`).update({
                portfolio: args[0]
            })
    
            message.reply('Portfólio definido com **sucesso**!')    

        }
    }
}