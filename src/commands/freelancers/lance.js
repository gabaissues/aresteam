const { Collector } = require('discord.js')
const Discord = require('firebase')
const { database } = require('../../services/firebase')

module.exports = {
    name: 'lance',
    aliases: ['lance', 'lançar'],
    run: async (client, message, args) => {

        message.delete()

        const user = await database.ref(`Perfils/${message.author.id}`).once('value')
        const snap = await database.ref(`Solicitações/${message.channel.id}`).once('value')

        var portfolio = {
            title: ':man_astronaut: Registre seu portfólio antes de ofertar um pedido!',
            description: `Defina seu portfólio anteriormente de ofertar um pedido utilizando o comando: -portfólio <link>`,
            color: 'RED'
        }

        var email = {
            title: ':man_astronaut: Registre seu e-mail antes de ofertar um pedido!',
            description: `Defina seu e-mail anteriormente de ofertar um pedido utilizando o comando: -e-mail <email>`,
            color: 'RED'
        }

        var metodo = {
            title: ':man_astronaut: Registre seu método de pagamento antes de ofertar um pedido!',
            description: `Defina seu método anteriormente de ofertar um pedido utilizando o comando: -pagamentos`,
            color: 'RED'
        }

        if (user.val() === null) {

            return message.reply({ embed: portfolio })

        }

        if (!user.val().portfolio) return message.reply({ embed: portfolio })
        if (!user.val().email) return message.reply({ embed: email })
        if (!user.val().metodo) return message.reply({ embed: metodo })

        var embed = {
            title: ':man_scientist: Comando inválido!',
            description: `Insira somente números válidos.`,
            color: "RED"
        }

        if (!args[0]) return message.reply({ embed: embed })

        var embed = {
            title: ':man_scientist: Comando inválido!',
            description: `Você não inseriu quantos dias úteis será necessário para esse serviço.`,
            color: "RED"
        }

        if (!args[1]) return message.reply({ embed: embed })

        let regex = /[1-9][0-9]*(d)|[1-9][0-9]*(s)|[1-9][0-9]*(m)/g
        regex.exec(args[1]).map(x => {

            switch (x) {

                case "d":

                    args[1] = args[1].replace('d', ' dia(s)')

                    break;
                case "s":

                    args[1] = args[1].replace('s', ' semana(s)')


                    break;
                case "m":

                    args[1] = args[1].replace('m', ' mês(es)')

                    break;

            }

        })

        if (snap.val() === null) {

            message.reply('Não existe nenhum pedido nesse canal.')

        } else {

            var taxa = (args[0] * 10) / 100
            args[0] = Number(args[0]) + Number(taxa)

            var embed = {
                title: ':man_scientist: Você recebeu um lance!',
                description: `Você acaba de receber um lance. Veja algumas informações abaixo:\n\nUsuário(a): ${message.author}\nPortfólio: ${user.val().portfolio}\nÚtilma avaliação: ${user.val().avalia}\n\nValor total da comissão: ${args[0].toLocaleString('pt-br', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}\nPrazo máximo para entrega: ${args[1]}\n\n:one: Aceitar lance\n:two: Negar lance\n\nReaja ao **emoji** abaixo correspondente a sua resposta para esse lance!`,
                color: '#4895EF'
            }

            var canal = client.channels.cache.get(snap.val().canal)

            var msg = await canal.send({ embed: embed })
            msg.react('1️⃣')
            await msg.react('2️⃣')

            canal.send(`<@${snap.val().user}>`).then(msg => msg.delete({ timeout: 5000 }))

            var embed = {
                title: ':man_astronaut: Lance enviado com sucesso!',
                description: `O seu lance foi enviado com sucesso, ${message.author}.`,
                color: '#4895EF'
            }

            message.reply({ embed: embed })
            let rfiltro = (r, u) => u.id === snap.val().user
            collector = msg.createReactionCollector(rfiltro, { max: 1 })

            collector.on('collect', async (r, u) => {

                switch (r.emoji.name) {

                    case "1️⃣":

                        database.ref(`Solicitações/${message.channel.id}`).update({
                            taxa: taxa,
                            valor: args[0]
                        })

                        message.channel.delete()

                        canal.bulkDelete(100)
                        canal.updateOverwrite(message.author, { "VIEW_CHANNEL": true })
                        canal.edit({ name: `comissão-${message.author.username}` })

                        var embed = {
                            title: `👨‍🚀 Comissão aceita!`,
                            color: '#4895EF',
                            description: `Obrigado pela preferência! Esperamos que tudo ocorra como **planejado**. Tenham um bom trabalho!\n\nLembrando: caso tenham dúvidas, perguntem ao(a) administrador(a) responsável por essa comissão.`
                        }

                        var mens = await canal.send({ embed: embed })

                        var embed = {
                            title: ':man_mechanic: Informações da comissão:',
                            description: `Leia atentamento abaixo todas as informações do pedido:\n\nCliente: <@${snap.val().user}>\nAdministrador: <@${snap.val().adm}>\nCriador(a) do serviço: ${message.author}\n\nDetalhes do pedido:\n${snap.val().detalhes}\n\nExemplo:\n${snap.val().exemplo}\n\nValor total da comissão: ${args[0].toLocaleString('pt-br', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}\nPrazo **máximo** para entrega: ${args[1]}`,
                            color: '#4895EF'
                        }

                        canal.send({ embed: embed })
                        canal.send(`<@${snap.val().user}>`).then(msg => msg.delete({ timeout: 5000 }))
                        canal.send(`<@${snap.val().adm}>`).then(msg => msg.delete({ timeout: 5000 }))
                        canal.send(`<@${message.author.id}>`).then(msg => msg.delete({ timeout: 5000 }))


                        break;
                    case "2️⃣":

                        msg.delete()

                        var embed = {
                            title: ':man_scientist: Informe-nos o motivo!',
                            description: `Abaixo está listado alguns dos possíveis motivos de você ter negado esse lance:\n\n:one: Portfólio\n:two: Preço\n:three: Tempo para entrega\n\nCriador(a) do serviço: ${message.author}\nValor total da comissão: ${args[0].toLocaleString('pt-br', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}\nPrazo máximo para entrega: ${args[1]}\n\nReaja ao **emoji** abaixo correspondente ao motivo!`,
                            color: '#4895EF'
                        }

                        var msg1 = await canal.send({ embed: embed })
                        var emotes = ["1️⃣", "2️⃣", "3️⃣"]

                        for (let i in emotes) msg1.react(emotes[i])
                        collector = msg1.createReactionCollector(rfiltro, { max: 1 })

                        collector.on('collect', async (r) => {

                            msg1.delete()

                            switch (r.emoji.name) {

                                case "1️⃣":

                                    var embed = {
                                        title: ':man_astronaut: Lance negado com sucesso!',
                                        description: `Você negou esse lance com sucesso.`,
                                        color: '#4895EF'
                                    }

                                    canal.send({ embed: embed })

                                    var embed = {
                                        title: ':man_bowing: Lance negado!',
                                        description: `O lance foi negado pelo(a) cliente, <@${snap.val().user}>\n\nAbaixo está listado o motivo do seu lance ter sigo negado pelo(a) cliente:\n\n:one: Portfólio: :white_check_mark:\n:two: Preço: :no_entry_sign:\n:three: Tempo para entrega: :no_entry_sign:`,
                                        color: '#4895EF'
                                    }

                                    message.reply({ embed: embed })

                                    break;
                                case "2️⃣":

                                    var embed = {
                                        title: ':man_astronaut: Lance negado com sucesso!',
                                        description: `Você negou esse lance com sucesso.`,
                                        color: '#4895EF'
                                    }

                                    canal.send({ embed: embed })

                                    var embed = {
                                        title: ':man_bowing: Lance negado!',
                                        description: `O lance foi negado pelo(a) cliente, <@${snap.val().user}>\n\nAbaixo está listado o motivo do seu lance ter sigo negado pelo(a) cliente:\n\n:one: Portfólio: :no_entry_sign:\n:two: Preço: :white_check_mark:\n:three: Tempo para entrega: :no_entry_sign:`,
                                        color: '#4895EF'
                                    }

                                    message.reply({ embed: embed })

                                    break;
                                case "3️⃣":

                                    var embed = {
                                        title: ':man_astronaut: Lance negado com sucesso!',
                                        description: `Você negou esse lance com sucesso.`,
                                        color: '#4895EF'
                                    }

                                    canal.send({ embed: embed })

                                    var embed = {
                                        title: ':man_bowing: Lance negado!',
                                        description: `O lance foi negado pelo(a) cliente, <@${snap.val().user}>\n\nAbaixo está listado o motivo do seu lance ter sigo negado pelo(a) cliente:\n\n:one: Portfólio: :no_entry_sign:\n:two: Preço: :no_entry_sign:\n:three: Tempo para entrega: :white_check_mark:`,
                                        color: '#4895EF'
                                    }

                                    message.reply({ embed: embed })

                                    break;

                            }

                        })



                        break;

                }
            })

        }
    }
}