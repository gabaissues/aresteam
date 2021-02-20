const Discord = require('discord.js')
const { database } = require('../../services/firebase')

module.exports = {
    name: 'profile',
    aliases: ['profile', 'perfil', 'info'],
    run: async (client, message, args) => {

        var embed = {
            title: ':man_scientist: Comando inválido!',
            description: 'Você utilizou o comando incorretamente. Utilize: - perfil <usuário(a)>',
            color: 'RED'
        }

        const membro = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]))
        if(!membro) return message.reply({ embed: embed })

        const user = await database.ref(`Perfils/${membro.id}`).once('value')
        if (user.val() === null) {

            var embed = {
                title: ':man_astronaut: Este usuário não possui um perfil configurado!',
                description: 'Não podemos fornecer detalhes sobre esse perfil.',
                color: 'RED'
            }


            return message.reply({ embed: embed })

        } else {

            var embed = {
                title: ':man_astronaut: Perfil de Franklin',
                description: `Leia abaixo informações desse perfil:\n\nE-mail: ${user.val().email}\nGanhos totais: ${user.val().recebido}\nÚltima avaliação: ${user.val().avalia}\n\nPortfólio: ${user.val().portfolio}`,
                color: '#4895EF'
            }

            message.reply({ embed: embed })



        }

    }
}