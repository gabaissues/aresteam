const Discord = require('discord.js')
const { database } = require('../../services/firebase')

module.exports = {
    name: 'email',
    aliases: ['email', 'e-mail'],
    run: async(client, message, args) => {

        var embed = {
            title: ':man_scientist: Comando inválido!',
            description: `Você não inseriu algumas informações. Utilize: -e-mail <endereço>`,
            color: "RED"
        }

        if(!args[0]) return message.reply({ embed: embed })

        const user = await database.ref(`Perfils/${message.author.id}`).once('value')
        if(user.val() === null) {

            database.ref(`Perfils/${message.author.id}`).set({
                avalia: 0,
                email: args.join(' '),
                recebido: 0
            })
    
            var embed = {
                title: ':man_astronaut: E-mail definido com sucesso!',
                description: `Parabéns, você acabou de definir seu e-mail. Agora você está livre para ofertar pedidos.`,
                color: "#4895EF"
            }

            message.reply({ embed: embed })

        } else {

            database.ref(`Perfils/${message.author.id}`).update({
                email: args.join(' ')
            })
    
            var embed = {
                title: ':man_astronaut: E-mail definido com sucesso!',
                description: `Parabéns, você acabou de definir seu e-mail. Agora você está livre para ofertar pedidos.`,
                color: "#4895EF"
            }

            message.reply({ embed: embed })

        }
    }
}