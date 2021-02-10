const Discord = require('discord.js')
const { database } = require('../../services/firebase')

module.exports = {
    name: 'email',
    aliases: ['email', 'e-mail'],
    run: async(client, message, args) => {

        if(!args[0]) return message.reply('Você utilizou o comando **incorretamente**. Utilize: -e-mail <método de pagamento> <endereço>')
        if(!args[1]) return message.reply(`Você utilizou o comando **incorretamente**. Utilize: -e-mail ${args[0]} <endereço>`)

        const user = await database.ref(`Perfils/${message.author.id}`).once('value')
        if(user.val() === null) {

            database.ref(`Perfils/${message.author.id}`).set({
                portfolio: 'Não definido.',
                avalia: 0,
                email: `${args.slice(1).join(' ')}`,
                metodo: args[0],
                recebido: 0
            })
    
            message.reply('E-mail definido com **sucesso**!')    

        } else {

            database.ref(`Perfils/${message.author.id}`).update({
                email: `${args.slice(1).join(' ')}`,
                metodo: args[0]
            })
    
            message.reply('E-mail definido com **sucesso**!')    

        }
    }
}