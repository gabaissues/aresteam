const Discord = require('discord.js')
const Cooldown = new Set()
const { database } = require('../services/firebase.js')

module.exports = (client) => {

    client.on('messageReactionAdd', async (r, u) => {

        if (r.message.partial) await r.message.fetch()
        if (r.partial) await r.fetch()

        if (u.bot) return;
        if (!r.message) return;

        if (r.message.channel.id == 807325945282166824) {//Esse ID é o ID no qual ficará a mensagem do ticket, preste bem a atenção nisso.

            if (Cooldown.has(u.id)) {

                r.users.remove(u.id)
                u.send('Você tem que esperar três minutos para que possa abrir outro ticket, por favor, espere.').catch(err => { return });

            } else {

                async function ticket(react, name, role) {

                    if (r.emoji.name === react) {

                        r.users.remove(u.id)

                        Cooldown.add(u.id)

                        var canal = await r.message.guild.channels.create(`${name}-${u.tag}`, { parent: '784775232790462494' })//Esse ID é o da categoria no qual vai ficar os tickets.

                        canal.updateOverwrite(r.message.guild.roles.everyone, { "SEND_MESSAGES": true, "ATTACH_FILES": true, "VIEW_CHANNEL": false })
                        canal.updateOverwrite(u.id, { "VIEW_CHANNEL": true })
                        canal.updateOverwrite(r.message.guild.roles.cache.get(role), { "VIEW_CHANNEL": true })

                        var embed = {
                            author: {
                                name: `Sistema de atendimento ⋅ ${name}.`,
                                icon_url: r.message.guild.iconURL()
                            },
                            description: `Olá! Seja bem-vindo(a) ao nosso sistema de atendimento. Para que possamos solucionar seu problema seja o mais específico possível, procure expor sua dúvida/problema de forma clara e objetiva.\n\nLembrando, envie o assunto o quanto antes para que a nossa equipe consiga ajudá-lo(a). **Uso inadequado resultará em punição.**`,
                            image: {
                                url: 'https://media.discordapp.net/attachments/803751212511526963/804752744606466078/advancement.png?width=432&height=86'
                            },
                            footer: {
                                text: 'Caso queira finalizar o canal, clique em 🔒'
                            },
                            color: '#4895EF'
                        }

                        canal.send(`${u}`).then(msg => msg.delete({ timeout: 5000 }))
                        canal.send(`<@&${role}>`).then(msg => msg.delete({ timeout: 5000 }))

                        var msg = await canal.send({ embed: embed })
                        msg.react('🔒')

                        var filtro = (reaction, user) => user.id === user.id
                        collector = msg.createReactionCollector(filtro, { max: 2 })

                        collector.on('collect', async (reaction, user) => {

                            if (reaction.me == true) return;

                            canal.send('Canal sendo deletado dentro de 3 segundos...')
                            setTimeout(() => {

                                canal.delete()
                                Cooldown.delete(u.id)

                            }, 3000)

                        })


                    }


                }

                //A cima, está todo o sistema que está por trás do ticket. Para que não fique com diversas linhas, criei
                //Uma function no qual você mesma pode adicionar tickets sem problemas. Basta replicar essa linha
                //A baixo, e adicionar o nome, no caso está dúvida.

                //No terceiro parametro, é o cargo da equipe.

                ticket('😭', 'Dùvida', '804514886347653171')

                if (r.emoji.name === "💳") {

                    r.users.remove(u.id)

                    Cooldown.add(u.id)

                    var canal = await r.message.guild.channels.create(`atendimento-${u.tag}`, { parent: '784775232790462494' })//Esse ID é o da categoria no qual vai ficar os tickets.

                    canal.updateOverwrite(r.message.guild.roles.everyone, { "SEND_MESSAGES": true, "ATTACH_FILES": true, "VIEW_CHANNEL": false })
                    canal.updateOverwrite(u.id, { "VIEW_CHANNEL": true })
                    canal.updateOverwrite(r.message.guild.roles.cache.get('782062081456865298'), { "VIEW_CHANNEL": true })

                    var embed = {
                        title: ':man_scientist: Pergunta #1',
                        description: 'Faça um texto detalhando o seu pedido.',
                        color: '#4895EF'
                    }

                    canal.send(`${u}`).then(msg => msg.delete({ timeout: 5000 }))

                    var msg = await canal.send({ embed: embed })

                    var filtro = (m) => m.author.id === u.id
                    collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                    collector.on('collect', async (msg) => {

                        msg.channel.bulkDelete(2)

                        var embed = {
                            title: ':man_scientist: Pergunta #2',
                            description: 'Qual será o orçamento máximo para essa comissão?',
                            color: '#4895EF'
                        }

                        var msg1 = await canal.send({ embed: embed })

                        var filtro = (m) => m.author.id === u.id
                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                        collector.on('collect', async (msg1) => {

                            msg.channel.bulkDelete(2)

                            var embed = {
                                title: ':man_scientist: Pergunta #3',
                                description: 'Qual prazo máximo para que essa comissão seja concluida?',
                                color: '#4895EF'
                            }


                            var msg2 = await canal.send({ embed: embed })

                            collector = msg.channel.createMessageCollector(filtro, { max: 1 })
                            collector.on('collect', async (msg2) => {

                                msg.channel.bulkDelete(2)

                                var embed = {
                                    title: ':man_scientist: Pergunta #4',
                                    description: 'Envie-nos um exemplo do que você deseja.',
                                    color: '#4895EF'
                                }


                                var msg3 = await canal.send({ embed: embed })

                                collector = msg.channel.createMessageCollector(filtro, { max: 1 })
                                collector.on('collect', async (msg3) => {

                                    msg.channel.bulkDelete(2)
                                    var array = []

                                    r.message.guild.roles.cache.get('782062081456865298').members.forEach(x => {

                                        array.push(x.user.id)

                                    })

                                    var embed = {
                                        title: '🧑‍🔧 **Escolha o administrador dessa comissão.**',
                                        description: `Abaixo está listado todos os administradores disponíveis para revisar sua comissão: \n\n1️⃣ <@${array[0] || "Indisponivel."}>\n2️⃣ <@${array[1] || "Indisponivel."}>\n3️⃣ <@${array[2] || "Indisponivel."}>\n4️⃣ <@${array[3] || "Indisponivel."}>\n5️⃣ <@${array[4] || "Indisponivel."}>\n6️⃣ <@${array[5] || "Indisponivel."}>\n7️⃣ <@${array[6] || "Indisponivel."}>\n8️⃣ <@${array[7] || "Indisponivel."}>\n9️⃣ <@${array[8] || "Indisponivel."}>\n🔟 <@${array[9] || "Indisponivel."}>\n\n:man_scientist: Reaja com o **emoji** abaixo correspondente ao administrador que você deseja que revise sua comissão.`,
                                        color: '#4895EF'
                                    }

                                    var msg4 = await canal.send({ embed: embed })
                                    let emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]

                                    for (let i in emotes) await msg4.react(emotes[i])

                                    var filtro = (reaction, user) => user.id === msg2.author.id
                                    collector = msg4.createReactionCollector(filtro, { max: 1 })

                                    collector.on('collect', async (reaction, user) => {

                                        switch (reaction.emoji.name) {//Detalhes do pedido: ${msg.content}\nOrçamento máximo: ${msg1.content}\nPrazo máximo: ${msg2.content}

                                            case emotes[0]:

                                                msg.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente todas as informações do pedido.\n\nCliente: ${msg.author}\nAdministrador: <@${array[0]}>\n\nDetalhes do pedido: ${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[0]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;
                                            case emotes[1]:

                                                msg.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente todas as informações do pedido.\n\nCliente: ${msg.author}\nAdministrador: <@${array[0]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[1]}>`).then(msg => msg.delete({ timeout: 5000 }))
                                                break;
                                            case emotes[2]:

                                                msg.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente todas as informações do pedido.\n\nCliente: ${msg.author}\nAdministrador: <@${array[0]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[2]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;
                                            case emotes[3]:

                                                msg.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente todas as informações do pedido.\n\nCliente: ${msg.author}\nAdministrador: <@${array[0]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[3]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;
                                            case emotes[4]:

                                                msg.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente todas as informações do pedido.\n\nCliente: ${msg.author}\nAdministrador: <@${array[0]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[4]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;
                                            case emotes[5]:

                                                msg.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente todas as informações do pedido.\n\nCliente: ${msg.author}\nAdministrador: <@${array[0]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[5]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;
                                            case emotes[6]:

                                                msg.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente todas as informações do pedido.\n\nCliente: ${msg.author}\nAdministrador: <@${array[0]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[6]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;
                                            case emotes[7]:

                                                msg.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente todas as informações do pedido.\n\nCliente: ${msg.author}\nAdministrador: <@${array[0]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[7]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;
                                            case emotes[8]:

                                                msg.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente todas as informações do pedido.\n\nCliente: ${msg.author}\nAdministrador: <@${array[0]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[8]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;
                                            case emotes[9]:

                                                msg.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente todas as informações do pedido.\n\nCliente: ${msg.author}\nAdministrador: <@${array[0]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[9]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;

                                        }

                                    })

                                })


                            })

                        })

                    })

                }

            }

        } else {

            return;

        }


    })

}