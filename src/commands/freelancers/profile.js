const Discord = require('discord.js')
const { database } = require('../../services/firebase')

module.exports = {
    name: 'profile',
    aliases: ['profile', 'perfil', 'info'],
    run: async (client, message, args) => {

        const membro = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]))
        if(!membro) return message.reply('Você utilizou o comando **incorretamente**. Utilize: -perfil <usuário(a)>')

        const user = await database.ref(`Perfils/${membro.id}`).once('value')
        if (user.val() === null) {

            return message.reply('O usuário não possue seu perfil configurado corretamente, para prosseguir, peça para utilizar **-portfólio & -e-mail.**')

        } else {

            var embed = {
                author: {
                    name: `Perfil ⋅ ${membro.user.tag}`,
                    icon_url: message.guild.iconURL()
                },
                description: `**Discord:** ${membro.user.tag}/${membro.id}\n**Portfólio:** ${user.val().portfolio}\n**Remuneração dos serviços:** ${user.val().recebido}\n**Ultima avaliação:** ${user.val().avalia}\n**E-mail:** ${user.val().email}`,
                color: '#4895EF'
            }

            message.reply({ embed: embed })



        }

    }
}