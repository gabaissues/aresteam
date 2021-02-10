const { Collector } = require('discord.js')
const Discord = require('firebase')
const { database } = require('../../services/firebase')

module.exports = {
    name: 'lance',
    aliases: ['lance', 'lançar'],
    run: async (client, message, args) => {

        const user = await database.ref(`Perfils/${message.author.id}`).once('value')
        const snap = await database.ref(`Solicitações/${message.channel.id}`).once('value')

        if (user.val() === null) {

            return message.reply('Registre seu portfólio antes de ofertar a um pedido.')

        }

        if (!args[0]) return message.reply('Você não inseriu qual é o seu orçamento.')

        if (isNaN(args[0])) return message.reply('Insira somente números válidos como orçamento.')

        if (!args[1]) return message.reply('Você não inseriu quantos dias úteis você consegue entregar.')

        if (isNaN(args[1])) return message.reply('Insira somente números válidos para a quantidade de dias.')

        if (snap.val() === null) {

            message.reply('Não existe nenhum pedido nesse canal.')

        } else {

            var embed = {
                author: {
                    name: `Oferta ⋅ ${message.author.tag}/${args[0]}`,
                    icon_url: message.guild.iconURL()
                },
                description: `O usuário **${message.author.username}** ofertou ao seu pedido com a oferta de ${args[0]} reais e com ${args[1]} dias úteis para entregar.\n\n**Pórtfolio: ${user.val().portfolio}**`,
                image: {
                    url: 'https://cdn.discordapp.com/attachments/803751189283078195/805123833727680572/advancement.png'
                },
                color: '#4895EF',
                footer: {
                    text: 'Clique em 👍 para aceitar a oferta.'
                }
            }

            message.reply('Oferta enviada com sucesso, boa sorte.')
            var canal = message.guild.channels.cache.get(snap.val().canal)

            var msg = await canal.send({ embed: embed })
            msg.react('👍')

            var filtro = (reaction, user) => user.id === snap.val().user
            collector = msg.createReactionCollector(filtro, { max: 1 })

            collector.on('collect', async (reaction, user) => {

                canal.bulkDelete(100)
                canal.updateOverwrite(message.author, { "VIEW_CHANNEL": true })
                canal.edit({ name: `comissão-${message.author.username}` })

                var embed = {
                    title: `👨‍🚀 Comissão aceita!`,
                    color: '#4895EF',
                    description: `Obrigado pela preferência! Esperamos que tudoocorra como **planejado.** Tenham um bom trabalho!\n\nLembrando, caso tenham dúvidas, perguntem ao administrador dessa comissão.`
                }

                var mens = await canal.send({ embed: embed })

                canal.send(`<@${snap.val().user}>`).then(msg => msg.delete({ timeout: 5000 }))
                canal.send(`<@${message.author.id}>`).then(msg => msg.delete({ timeout: 5000 }))

            })

        }
    }
}