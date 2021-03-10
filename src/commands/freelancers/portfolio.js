const Discord = require('discord.js')
const { database } = require('../../services/firebase')

module.exports = {
    name: 'portfólio',
    aliases: ['portfólio', 'portfolio'],
    run: async(client, message, args) => {

        var embed = {
            title: ':man_scientist: Comando incorreto!',
            description: `Você utilizou o comando incorretamente. Utilize: -portfólio <link>`,
            color: '#4895EF'
        }

        if(!args[0]) return message.reply({ embed: embed })

        const user = await database.ref(`Perfils/${message.author.id}`).once('value')
        if(user.val() === null) {

            database.ref(`Perfils/${message.author.id}`).set({
                portfolio: args.join(' '),
                avalia: 0,
                recebido: 0
            })
    
            var embed = {
                title: ':man_scientist: Portfólio definido com sucesso!',
                description: `Obrigado por nos informar seu portfólio.`,
                color: '#4895EF'
            }

            message.reply({ embed: embed })

        } else {

            database.ref(`Perfils/${message.author.id}`).update({
                portfolio: args.join(' ')
            })
    
            var embed = {
                title: ':man_scientist: Portfólio definido com sucesso!',
                description: `Obrigado por nos informar seu portfólio.`,
                color: '#4895EF'
            }

            message.reply({ embed: embed })
            
        }
    }
}