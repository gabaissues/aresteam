const Discord = require('discord.js')
const { database } = require('../../services/firebase')

module.exports = {
    name: 'comissao',
    aliases: ['comissão', 'comissao'],
    run: async(client, message, args) => {
    
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('Você não tem permissão de utilizar este comando.')

        var embed = {
            author: {
                name: `Quem será o cliente?`,
                icon_url: message.guild.iconURL()
            },
            color: '#4895EF',
        }
        
        var msg = await message.reply({ embed: embed })
        var filtro = (m) => m.author.id === message.author.id 

        collector = msg.channel.createMessageCollector(filtro, { max: 1 })
        collector.on('collect', async (msg) => {

            msg.channel.bulkDelete(2)

            const membro = message.guild.member(msg.mentions.users.first() || message.guild.members.cache.get(msg.content))
            if(!membro) return message.reply('Você não inseriu nenhum membro válido.')

            var embed = {
                author: {
                    name: `Envie um exemplo do que deseja. (Imagem)`,
                    icon_url: message.guild.iconURL()
                },
                color: '#4895EF',
            }
            
            var msg1 = await message.reply({ embed: embed })
            collector = msg.channel.createMessageCollector(filtro, { max: 1 })
            collector.on('collect', async (msg1) => {

                msg.channel.bulkDelete(2)

                var embed = {
                    author: {
                        name: `Forneça-os os detalhes do pedido.`,
                        icon_url: message.guild.iconURL()
                    },
                    color: '#4895EF',
                }
                
                var msg2 = await message.reply({ embed: embed })
                collector = msg.channel.createMessageCollector(filtro, { max: 1 })
                collector.on('collect', async (msg2) => {
    
                    msg.channel.bulkDelete(2)

                    var embed = {
                        author: {
                            name: `Qual será o prazo máximo para conclusão desta comissão?`,
                            icon_url: message.guild.iconURL()
                        },
                        color: '#4895EF',
                    }
                    
                    var msg3 = await message.reply({ embed: embed })
                    collector = msg.channel.createMessageCollector(filtro, { max: 1 })
                    collector.on('collect', async (msg3) => {

                        msg.channel.bulkDelete(2)
        
                        var embed = {
                            author: {
                                name: `Qual o valor máximo que o cliente deseja pagar?`,
                                icon_url: message.guild.iconURL()
                            },
                            color: '#4895EF',
                        }
                        
                        var msg4 = await message.reply({ embed: embed })
                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })
                        collector.on('collect', async (msg4) => {

                            msg.channel.bulkDelete(2)

                            var embed = {
                                title: ':man_astronaut: Qual dessas categorias representa esse serviço?',
                                description: ':one: Designer\n:two: Construções\n:three: Desenvolvimento',
                                color: '#4895EF'
                            }

                            var msg5 = await message.reply({ embed: embed })
                            var emotes = ["1️⃣", "2️⃣", "3️⃣"]
                            
                            for(let i in emotes) msg5.react(emotes[i])

                            let rfiltro = (r, u) => u.id === message.author.id 
                            collector = msg5.createReactionCollector(rfiltro, { max: 1 })

                            collector.on('collect', async (r, u) => {

                                switch(r.emoji.name) {

                                    case "1️⃣":

                                        var servidor = client.guilds.cache.get('ID DO SERVIDOR')

                                        var canal = await servidor.channels.create(`pedido-${message.author.username}`, { type: 'text', parent: '784775232790462494' })
            
                                        var embed = {
                                            title: ':man_mechanic: Informações da comissão:',
                                            description: `Leia atentamente todas as informações do pedido.\n\nCliente: ${msg.author}\nAdministrador: <@${array[0]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                            color: '#4895EF'
                                        }
            
                                        message.reply('Pedido enviado com sucesso.')
            
                                        canal.send({ embed: embed })
                                        canal.send('804514886347653171').then(msg => msg.delete({ timeout: 5000 }))
            
                                        database.ref(`Solicitações/${canal.id}`).set({
                                            user: membro.id,
                                            canal: message.channel.id
                                        })

                                    break;
                                    case "2️⃣":

                                        var servidor = client.guilds.cache.get('ID DO SERVIDOR')

                                        var canal = await servidor.channels.create(`pedido-${message.author.username}`, { type: 'text', parent: '784775232790462494' })
            
                                        var embed = {
                                            title: ':man_mechanic: Informações da comissão:',
                                            description: `Leia atentamente todas as informações do pedido.\n\nCliente: ${msg.author}\nAdministrador: <@${array[0]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                            color: '#4895EF'
                                        }
            
                                        message.reply('Pedido enviado com sucesso.')
            
                                        canal.send({ embed: embed })
                                        canal.send('804514886347653171').then(msg => msg.delete({ timeout: 5000 }))
            
                                        database.ref(`Solicitações/${canal.id}`).set({
                                            user: membro.id,
                                            canal: message.channel.id
                                        })


                                    break;
                                    case "3️⃣":

                                        var servidor = client.guilds.cache.get('ID DO SERVIDOR')

                                        var canal = await servidor.channels.create(`pedido-${message.author.username}`, { type: 'text', parent: '784775232790462494' })
            
                                        var embed = {
                                            title: ':man_mechanic: Informações da comissão:',
                                            description: `Leia atentamente todas as informações do pedido.\n\nCliente: ${msg.author}\nAdministrador: <@${array[0]}>\n\nDetalhes do pedido:\n${msg.content}\n\nExemplo:\n${msg3.content}\n\nOrçamento máximo: ${msg1.content}\nPrazo **máximo** para entrega: ${msg2.content}`,
                                            color: '#4895EF'
                                        }
            
                                        message.reply('Pedido enviado com sucesso.')
            
                                        canal.send({ embed: embed })
                                        canal.send('804514886347653171').then(msg => msg.delete({ timeout: 5000 }))
            
                                        database.ref(`Solicitações/${canal.id}`).set({
                                            user: membro.id,
                                            canal: message.channel.id
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