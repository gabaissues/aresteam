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

                var embed = {
                    title: ':clock1: Espere alguns minutos!',
                    description: 'Você precisa esperar três minutos para requisitar outro serviço.',
                    color: '#4895EF'
                }

                u.send({ embed: embed }).catch(err => { return });

            } else {

                if (r.emoji.name === "1️⃣" || r.emoji.name === "2️⃣" || r.emoji.name === "3️⃣") {

                    r.users.remove(u.id)

                    Cooldown.add(u.id)

                    var canal = await r.message.guild.channels.create(`atendimento-${u.username}`, { parent: '784775232790462494' })//Esse ID é o da categoria no qual vai ficar os tickets.

                    canal.updateOverwrite(r.message.guild.roles.everyone, { "SEND_MESSAGES": true, "ATTACH_FILES": true, "VIEW_CHANNEL": false })
                    canal.updateOverwrite(u.id, { "VIEW_CHANNEL": true })
                    canal.updateOverwrite(r.message.guild.roles.cache.get('782062081456865298'), { "VIEW_CHANNEL": true })

                    var embed = {
                        title: ':astronaut: Obrigado por criar uma comissão conosco!',
                        description: `Responda todas as perguntas que fizermos para concluir o processo de pedido.\n\nCaso você esteja em dúvida sobre esse processo de pedido, você pode fazer uma leitura em nosso canal <#809823664849682452>\n\nDesejamos um **ótimo** trabalho! :wave:`,
                        color: '#4895EF'
                    }

                    canal.send({ embed: embed })

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
                                        description: `Abaixo está listado todos os administradores disponíveis para revisar sua comissão: \n\n1️⃣ <@${array[0] || "Indisponivel"}>\n2️⃣ <@${array[1] || "Indisponivel"}>\n3️⃣ <@${array[2] || "Indisponivel"}>\n4️⃣ <@${array[3] || "Indisponivel"}>\n5️⃣ <@${array[4] || "Indisponivel"}>\n6️⃣ <@${array[5] || "Indisponivel"}>\n7️⃣ <@${array[6] || "Indisponivel"}>\n8️⃣ <@${array[7] || "Indisponivel"}>\n9️⃣ <@${array[8] || "Indisponivel"}>\n🔟 <@${array[9] || "Indisponivel"}>\n\n:man_scientist: Reaja com o **emoji** abaixo correspondente ao administrador que você deseja que revise sua comissão.`,
                                        color: '#4895EF'
                                    }

                                    var msg4 = await canal.send({ embed: embed })
                                    let emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]

                                    for (let i in emotes) await msg4.react(emotes[i])

                                    var rfiltro = (reaction, user) => user.id === msg2.author.id
                                    collector = msg4.createReactionCollector(rfiltro)

                                    collector.on('collect', async (reaction, user) => {

                                        switch (reaction.emoji.name) {//Detalhes do pedido: ${msg.content}\nOrçamento máximo: ${msg1.content}\nPrazo máximo: ${msg2.content}

                                            case emotes[0]:

                                                if (!array[0]) return;

                                                reaction.message.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente abaixo todas as informações do pedido:\n\nCliente: ${u}\nAdministrador: <@${array[0]}>\n\nDetalhes do pedido: ${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                var msg5 = await canal.send({ embed: embed })

                                                msg5.react('❌')
                                                var filtro = (r, u) => u.id === array[0]
                                                collector = msg5.createReactionCollector(filtro, { max: 1 })

                                                collector.on('collect', async (r) => {

                                                    canal.delete()
                                                    database.ref(`Solicitações/${canal.id}`).delete()

                                                })


                                                var embed = {
                                                    title: '👩‍🚀 Perguntas respondidas com sucesso!',
                                                    description: `Obrigado! Para que o seu pedido seja melhor **esclarecido** para os nossos freelancers, converse com o administrador responsável pela revisão desta comissão.`,
                                                    color: '#4895EF'
                                                }
                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[0]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;
                                            case emotes[1]:

                                                if (!array[1]) return;

                                                reaction.message.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente abaixo todas as informações do pedido:\n\nCliente: ${u}\nAdministrador: <@${array[1]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                var msg5 = await canal.send({ embed: embed })

                                                msg5.react('❌')
                                                var filtro = (r, u) => u.id === array[1]
                                                collector = msg5.createReactionCollector(filtro, { max: 1 })

                                                collector.on('collect', async (r) => {

                                                    canal.delete()
                                                    database.ref(`Solicitações/${canal.id}`).delete()

                                                })


                                                var embed = {
                                                    title: '👩‍🚀 Perguntas respondidas com sucesso!',
                                                    description: `Obrigado! Para que o seu pedido seja melhor **esclarecido** para os nossos freelancers, converse com o administrador responsável pela revisão desta comissão.`,
                                                    color: '#4895EF'
                                                }
                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[1]}>`).then(msg => msg.delete({ timeout: 5000 }))
                                                break;
                                            case emotes[2]:

                                                if (!array[2]) return;

                                                reaction.message.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente abaixo todas as informações do pedido:\n\nCliente: ${u}\nAdministrador: <@${array[2]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                var msg5 = await canal.send({ embed: embed })

                                                msg5.react('❌')
                                                var filtro = (r, u) => u.id === array[2]
                                                collector = msg5.createReactionCollector(filtro, { max: 1 })

                                                collector.on('collect', async (r) => {

                                                    canal.delete()
                                                    database.ref(`Solicitações/${canal.id}`).delete()

                                                })


                                                var embed = {
                                                    title: '👩‍🚀 Perguntas respondidas com sucesso!',
                                                    description: `Obrigado! Para que o seu pedido seja melhor **esclarecido** para os nossos freelancers, converse com o administrador responsável pela revisão desta comissão.`,
                                                    color: '#4895EF'
                                                }
                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[2]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;
                                            case emotes[3]:

                                                if (!array[3]) return;

                                                reaction.message.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente abaixo todas as informações do pedido:\n\nCliente: ${u}\nAdministrador: <@${array[3]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                var msg5 = await canal.send({ embed: embed })

                                                msg5.react('❌')
                                                var filtro = (r, u) => u.id === array[3]
                                                collector = msg5.createReactionCollector(filtro, { max: 1 })

                                                collector.on('collect', async (r) => {

                                                    canal.delete()
                                                    database.ref(`Solicitações/${canal.id}`).delete()

                                                })


                                                var embed = {
                                                    title: '👩‍🚀 Perguntas respondidas com sucesso!',
                                                    description: `Obrigado! Para que o seu pedido seja melhor **esclarecido** para os nossos freelancers, converse com o administrador responsável pela revisão desta comissão.`,
                                                    color: '#4895EF'
                                                }
                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[3]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;
                                            case emotes[4]:

                                                if (!array[4]) return;

                                                reaction.message.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente abaixo todas as informações do pedido:\n\nCliente: ${u}\nAdministrador: <@${array[4]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                var msg5 = await canal.send({ embed: embed })

                                                msg5.react('❌')
                                                var filtro = (r, u) => u.id === array[4]
                                                collector = msg5.createReactionCollector(filtro, { max: 1 })

                                                collector.on('collect', async (r) => {

                                                    canal.delete()
                                                    database.ref(`Solicitações/${canal.id}`).delete()

                                                })


                                                var embed = {
                                                    title: '👩‍🚀 Perguntas respondidas com sucesso!',
                                                    description: `Obrigado! Para que o seu pedido seja melhor **esclarecido** para os nossos freelancers, converse com o administrador responsável pela revisão desta comissão.`,
                                                    color: '#4895EF'
                                                }
                                                canal.send({ embed: embed })

                                                canal.send(`<@${array[4]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;
                                            case emotes[5]:

                                                if (!array[5]) return;

                                                reaction.message.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente abaixo todas as informações do pedido:\n\nCliente: ${u}\nAdministrador: <@${array[5]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                var msg5 = await canal.send({ embed: embed })

                                                msg5.react('❌')
                                                var filtro = (r, u) => u.id === array[5]
                                                collector = msg5.createReactionCollector(filtro, { max: 1 })

                                                collector.on('collect', async (r) => {

                                                    canal.delete()
                                                    database.ref(`Solicitações/${canal.id}`).delete()

                                                })


                                                var embed = {
                                                    title: '👩‍🚀 Perguntas respondidas com sucesso!',
                                                    description: `Obrigado! Para que o seu pedido seja melhor **esclarecido** para os nossos freelancers, converse com o administrador responsável pela revisão desta comissão.`,
                                                    color: '#4895EF'
                                                }
                                                canal.send({ embed: embed })

                                                canal.send(`<@${array[5]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;
                                            case emotes[6]:

                                                if (!array[6]) return;

                                                reaction.message.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente abaixo todas as informações do pedido:\n\nCliente: ${u}\nAdministrador: <@${array[6]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                var msg5 = await canal.send({ embed: embed })

                                                msg5.react('❌')
                                                var filtro = (r, u) => u.id === array[6]
                                                collector = msg5.createReactionCollector(filtro, { max: 1 })

                                                collector.on('collect', async (r) => {

                                                    canal.delete()
                                                    database.ref(`Solicitações/${canal.id}`).delete()

                                                })

                                                canal.send(`<@${array[6]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;
                                            case emotes[7]:

                                                if (!array[7]) return;

                                                reaction.message.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente abaixo todas as informações do pedido:\n\nCliente: ${u}\nAdministrador: <@${array[7]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                var msg5 = await canal.send({ embed: embed })

                                                msg5.react('❌')
                                                var filtro = (r, u) => u.id === array[7]
                                                collector = msg5.createReactionCollector(filtro, { max: 1 })

                                                collector.on('collect', async (r) => {

                                                    canal.delete()
                                                    database.ref(`Solicitações/${canal.id}`).delete()

                                                })

                                                canal.send(`<@${array[7]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;
                                            case emotes[8]:

                                                if (!array[8]) return;

                                                reaction.message.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente abaixo todas as informações do pedido:\n\nCliente: ${u}\nAdministrador: <@${array[8]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                var msg5 = await canal.send({ embed: embed })

                                                msg5.react('❌')
                                                var filtro = (r, u) => u.id === array[8]
                                                collector = msg5.createReactionCollector(filtro, { max: 1 })

                                                collector.on('collect', async (r) => {

                                                    canal.delete()
                                                    database.ref(`Solicitações/${canal.id}`).delete()

                                                })

                                                canal.send(`<@${array[8]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;
                                            case emotes[9]:

                                                if (!array[9]) return;

                                                reaction.message.channel.bulkDelete(100)

                                                var embed = {
                                                    title: '👨‍🔧 Informações da comissão:',
                                                    description: `Leia atentamente abaixo todas as informações do pedido:\n\nCliente: ${u}\nAdministrador: <@${array[9]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                                    color: '#4895EF'
                                                }

                                                var msg5 = await canal.send({ embed: embed })

                                                msg5.react('❌')
                                                var filtro = (r, u) => u.id === array[9]
                                                collector = msg5.createReactionCollector(filtro, { max: 1 })

                                                collector.on('collect', async (r) => {

                                                    canal.delete()
                                                    database.ref(`Solicitações/${canal.id}`).delete()

                                                })

                                                canal.send(`<@${array[9]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                                break;

                                        }

                                        setTimeout(() => {

                                            Cooldown.delete(u.id)

                                        }, 180000)

                                    })

                                })


                            })

                        })

                    })
                    
                    var filtroall = (m) => m.author.id === m.author.id

                    collector = msg.channel.createMessageCollector(filtroall)
                    collector.on('collect', async (mensagem) => {

                        if(mensagem.author.bot) return;

                        database.ref(`Logs/${mensagem.channel.id}`).once('value').then(async function (searchChannel) {

                            if(searchChannel.val() === null) {
                                
                                var embed = {
                                    title: ':man_astronaut: Mensagem armazenada!',
                                    description: `Veja a mensagem armazenada abaixo:\n\nAutor: ${mensagem.author}\nMensagem: ${mensagem.content}`,
                                    color: '#4895EF'
                                }

                                var canal = await client.guilds.cache.get('812847600050503680').channels.create(`comissão-${u.username}`, { parent: '812847600050503681' })
                                canal.send({ embed: embed })

                                database.ref(`Logs/${mensagem.channel.id}`).set({
                                    canalid: canal.id
                                })

                            } else {

                                var embed = {
                                    title: ':man_astronaut: Mensagem armazenada!',
                                    description: `Veja a mensagem armazenada abaixo:\n\nAutor: ${mensagem.author}\nMensagem: ${mensagem.content}`,
                                    color: '#4895EF'
                                }

                                client.guilds.cache.get('812847600050503680').channels.cache.get(searchChannel.val().canalid).send({ embed: embed })

                            }

                        })
   
                    })

                }

            }

        } else {

            return;

        }


    })

}