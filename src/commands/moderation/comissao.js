const Discord = require('discord.js')
const { database } = require('../../services/firebase')

module.exports = {
    name: 'comissao',
    aliases: ['comissão', 'comissao'],
    run: async(client, message, args) => {
    
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('Você não tem permissão de utilizar este comando.')

        var embed = {
            title: ':astronaut: Pergunta #1',
            description: `Quem será o cliente?`,
            color: '#4895EF'
        }
        
        var msg = await message.reply({ embed: embed })
        var filtro = (m) => m.author.id === message.author.id 

        collector = msg.channel.createMessageCollector(filtro, { max: 1 })
        collector.on('collect', async (msg) => {

            msg.channel.bulkDelete(2)

            const membro = message.guild.member(msg.mentions.users.first() || message.guild.members.cache.get(msg.content))
            if(!membro) return message.reply('Você não inseriu nenhum membro válido.')

            var embed = {
                title: ':man_scientist: Pergunta #2',
                description: 'Faça um texto detalhando o seu pedido.',
                color: '#4895EF'
            }
            
            var msg1 = await message.reply({ embed: embed })
            collector = msg.channel.createMessageCollector(filtro, { max: 1 })
            collector.on('collect', async (msg1) => {

                msg.channel.bulkDelete(2)

                var embed = {
                    title: ':man_scientist: Pergunta #3',
                    description: 'Qual será o orçamento máximo para essa comissão?',
                    color: '#4895EF'
                }

                var msg2 = await message.reply({ embed: embed })
                collector = msg.channel.createMessageCollector(filtro, { max: 1 })
                collector.on('collect', async (msg2) => {
    
                    msg.channel.bulkDelete(2)

                    var embed = {
                        title: ':man_scientist: Pergunta #4',
                        description: 'Qual prazo máximo para que essa comissão seja concluida?',
                        color: '#4895EF'
                    }
                    
                    var msg3 = await message.reply({ embed: embed })
                    collector = msg.channel.createMessageCollector(filtro, { max: 1 })
                    collector.on('collect', async (msg3) => {

                        msg.channel.bulkDelete(2)
        
                        var embed = {
                            title: ':man_scientist: Pergunta #5',
                            description: 'Envie-nos um exemplo do que você deseja.',
                            color: '#4895EF'
                        }
                        
                        var msg4 = await message.reply({ embed: embed })
                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })
                        collector.on('collect', async (msg4) => {

                            msg.channel.bulkDelete(2)

                            var embed = {
                                title: '👨‍🚀 Qual das seguintes categorias representa esse serviço?',
                                description: 'Escolha uma das categorias disponíveis abaixo:\n\n:one: Designer\n:two: Construções\n:three: Desenvolvimento\n\nReaja ao **emoji** correspondente a categoria que representa esse serviço!',
                                color: '#4895EF'
                            }

                            var msg5 = await message.reply({ embed: embed })
                            var emotes = ["1️⃣", "2️⃣", "3️⃣"]
                            
                            for(let i in emotes) msg5.react(emotes[i])

                            let rfiltro = (r, u) => u.id === message.author.id 
                            collector = msg5.createReactionCollector(rfiltro, { max: 1 })

                            collector.on('collect', async (r, u) => {

                                msg5.delete()

                                switch(r.emoji.name) {

                                    case "1️⃣":

                                        var servidor = client.guilds.cache.get('807330861274890271')

                                        var canal = await servidor.channels.create(`pedido-${membro.user.username}`, { type: 'text', parent: '807336183365500999' })
            
                                        var embed = {
                                            title: ':man_mechanic: Informações da comissão:',
                                            description: `Leia atentamente abaixo todas as informações do pedido:\n\nCliente: ${membro}\nAdministrador: ${message.author}\n\nDetalhes do pedido:\n${msg1.content}\n\nExemplo:\n${msg4.content}\n\nOrçamento máximo: ${msg2.content}\nPrazo **máximo** para entrega: ${msg3.content}`,
                                            color: '#4895EF'
                                        }
            
                                        canal.send({ embed: embed })
                                        var embed = {
                                            title: ':man_astronaut: Pedido enviado com sucesso!',
                                            description: 'Registramos o seu pedido para os nossos(as) membros da Equipe Ares. Aguarde por um lance.',
                                            color: '#4895EF'
                                        }

                                        message.reply({ embed: embed })

                                        var embed = {
                                            title: ':man_scientist: Utilize os seguintes comandos para dar seu lance:',
                                            description: `-lance <valor> <dias>\n\nVeja algumas **informações** adicionais:\n\nd = dias\ns = semanas\nm = meses\n\n:man_astronaut: **Tutorial exemplificativo:**\n\nExemplo de **comando** de lance: -lance 10 1s\nO lance acima está no valor de 10R$ e o prazo para entrega é de 1 semana.`,
                                            color: '#4895EF'
                                        }

                                        canal.send({ embed: embed })
                                        canal.send('<@&807337791590498345>').then(msg => msg.delete({ timeout: 5000 }))
            
                                        database.ref(`Solicitações/${canal.id}`).set({
                                            user: membro.id,
                                            canal: message.channel.id,
                                            detalhes: msg1.content,
                                            orçamento: msg2.content,
                                            prazo: msg3.content,
                                            exemplo: msg4.content,
                                            adm: message.author.id
                                        })

                                    break;
                                    case "2️⃣":

                                        var servidor = client.guilds.cache.get('807340735585583135')

                                        var canal = await servidor.channels.create(`pedido-${message.author.username}`, { type: 'text', parent: '807340735929253938' })
            
                                        var embed = {
                                            title: ':man_mechanic: Informações da comissão:',
                                            description: `Leia atentamente abaixo todas as informações do pedido:\n\nCliente: ${membro}\nAdministrador: ${message.author}\n\nDetalhes do pedido:\n${msg1.content}\n\nExemplo:\n${msg4.content}\n\nOrçamento máximo: ${msg2.content}\nPrazo **máximo** para entrega: ${msg3.content}`,
                                            color: '#4895EF'
                                        }
            
                                        canal.send({ embed: embed })
                                        var embed = {
                                            title: ':man_astronaut: Pedido enviado com sucesso!',
                                            description: 'Registramos o seu pedido para os nossos(as) membros da Equipe Ares. Aguarde por um lance.',
                                            color: '#4895EF'
                                        }

                                        message.reply({ embed: embed })

                                        var embed = {
                                            title: ':man_scientist: Utilize os seguintes comandos para dar seu lance:',
                                            description: `-lance <valor> <dias>\n\nVeja algumas **informações** adicionais:\n\nd = dias\ns = semanas\nm = meses\n\n:man_astronaut: **Tutorial exemplificativo:**\n\nExemplo de **comando** de lance: -lance 10 1s\nO lance acima está no valor de 10R$ e o prazo para entrega é de 1 semana.`,
                                            color: '#4895EF'
                                        }

                                        canal.send({ embed: embed })
                                        canal.send('<@&807340735740379146>').then(msg => msg.delete({ timeout: 5000 }))
            
                                        database.ref(`Solicitações/${canal.id}`).set({
                                            user: membro.id,
                                            canal: message.channel.id,
                                            detalhes: msg1.content,
                                            orçamento: msg2.content,
                                            prazo: msg3.content,
                                            exemplo: msg4.content,
                                            adm: message.author.id
                                        })


                                    break;
                                    case "3️⃣":

                                        var servidor = client.guilds.cache.get('807340980684455996')

                                        var canal = await servidor.channels.create(`pedido-${message.author.username}`, { type: 'text', parent: '807340981220671547' })
            
                                        var embed = {
                                            title: ':man_mechanic: Informações da comissão:',
                                            description: `Leia atentamente abaixo todas as informações do pedido:\n\nCliente: ${membro}\nAdministrador: ${message.author}\n\nDetalhes do pedido:\n${msg1.content}\n\nExemplo:\n${msg4.content}\n\nOrçamento máximo: ${msg2.content}\nPrazo **máximo** para entrega: ${msg3.content}`,
                                            color: '#4895EF'
                                        }
            
                                        canal.send({ embed: embed })
                                        var embed = {
                                            title: ':man_astronaut: Pedido enviado com sucesso!',
                                            description: 'Registramos o seu pedido para os nossos(as) membros da Equipe Ares. Aguarde por um lance.',
                                            color: '#4895EF'
                                        }

                                        message.reply({ embed: embed })

                                        var embed = {
                                            title: ':man_scientist: Utilize os seguintes comandos para dar seu lance:',
                                            description: `-lance <valor> <dias>\n\nVeja algumas **informações** adicionais:\n\nd = dias\ns = semanas\nm = meses\n\n:man_astronaut: **Tutorial exemplificativo:**\n\nExemplo de **comando** de lance: -lance 10 1s\nO lance acima está no valor de 10R$ e o prazo para entrega é de 1 semana.`,
                                            color: '#4895EF'
                                        }

                                        canal.send({ embed: embed })
                                        canal.send('<@&807340980684456005>').then(msg => msg.delete({ timeout: 5000 }))
            
                                        database.ref(`Solicitações/${canal.id}`).set({
                                            user: membro.id,
                                            canal: message.channel.id,
                                            detalhes: msg1.content,
                                            orçamento: msg2.content,
                                            prazo: msg3.content,
                                            exemplo: msg4.content,
                                            adm: message.author.id
                                        })

                                    break;

                                }

                            })

                        }) 
        
                    })                
    
                })

            })
        })

    }
}