const Discord = require('discord.js')
const Cooldown = new Set()
const { database } = require('../services/firebase.js')

module.exports = (client) => {

    client.on('messageReactionAdd', async (r, u) => {

        if (r.message.partial) await r.message.fetch()
        if (r.partial) await r.fetch()

        if (u.bot) return;
        if (!r.message) return;

        if (Cooldown.has(u.id)) {

                r.users.remove(u.id)
                u.send('Você tem que esperar no minimo 7 dias para fazer o formulário novamente.').catch(err => { return });

        } else {

            async function form(channel, category, role) {

                if(r.message.channel.id == channel) {

                    await r.users.remove(u.id)

                    var canal = await r.message.guild.channels.create(`aplicação-${u.username}`, { parent: category })
                
                    canal.updateOverwrite(u, { "SEND_MESSAGES": true, "VIEW_CHANNEL": true })
                    canal.updateOverwrite(r.message.guild.roles.everyone, { "VIEW_CHANNEL": false })
                    canal.updateOverwrite(r.message.guild.roles.cache.get(role), { "VIEW_CHANNEL": true })

                    var embed = {
                        title: ':man_scientist: **Pergunta #1**',
                        description: 'Faça um pequeno texto explicando os motivos pelo qual deseja aplicar-se.',
                        color: '#4895EF'
                    }

                    var msg = await canal.send({ embed: embed })
                    var filtro = (m) => m.author.id === u.id 

                    collector = msg.channel.createMessageCollector(filtro, { max: 1 })
                    collector.on('collect', async (msg) => {

                        var embed = {
                            title: ':man_scientist: **Pergunta #2**',
                            description: 'Qual sua idade?',
                            color: '#4895EF'
                        }
    
                        var msg1 = await canal.send({ embed: embed })
                        var filtro = (m) => m.author.id === u.id 
    
                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })
                        collector.on('collect', async (msg1) => {
    
                            var embed = {
                                title: ':man_scientist: **Pergunta #3**',
                                description: 'Você já teve experiência trabalhando em outra equipe? Se sim, qual?',
                                color: '#4895EF'
                            }
        
                            var msg2 = await canal.send({ embed: embed })
                            var filtro = (m) => m.author.id === u.id 
        
                            collector = msg.channel.createMessageCollector(filtro, { max: 1 })
                            collector.on('collect', async (msg2) => {
        
                                var embed = {
                                    title: ':man_scientist: **Pergunta #4**',
                                    description: 'Envie-nos o seu portfólio.',
                                    color: '#4895EF'
                                }
            
                                var msg3 = await canal.send({ embed: embed })
                                var filtro = (m) => m.author.id === u.id 
            
                                collector = msg.channel.createMessageCollector(filtro, { max: 1 })
                                collector.on('collect', async (msg3) => {
            
                                    var array = []

                                    r.message.guild.roles.cache.get(role).members.forEach(x => {

                                        array.push(x.user.id)

                                    })
        
                                    console.log(array)

                                    var embed = {
                                        title: ':man_astronaut: **Escolha um dos nossos aplicadores para gerenciar essa aplicação.**',
                                        description: `Abaixo está listado todos os aplicadores disponíveis para gerenciar sua aplicação:\n\n1️⃣ <@${array[0] || "Indisponivel."}>\n2️⃣ <@${array[1] || "Indisponivel."}>\n3️⃣ <@${array[2] || "Indisponivel."}>\n4️⃣ <@${array[3] || "Indisponivel."}>\n5️⃣ <@${array[4] || "Indisponivel."}>\n6️⃣ <@${array[5] || "Indisponivel."}>\n7️⃣ <@${array[6] || "Indisponivel."}>\n8️⃣ <@${array[7] || "Indisponivel."}>\n9️⃣ <@${array[8] || "Indisponivel."}>\n🔟 <@${array[9] || "Indisponivel."}>\n\n:man_scientist: Reaja com o **emoji** abaixo correspondente ao aplicador que você deseja que gerencia sua aplicação.`,
                                        color: '#4895EF'
                                    }

                                    var msg4 = await canal.send({ embed: embed })
                                    let emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]

                                    for(let i in emotes) await msg4.react(emotes[i])

                                    var rfiltro = (reaction, user) => user.id === msg.author.id
                                    collector = msg4.createReactionCollector(rfiltro, { max: 1 })

                                    collector.on('collect', async (reaction, user) => {

                                        switch(reaction.emoji.name) {

                                            case emotes[0]:

                                                var embed = {
                                                    title: ':woman_astronaut: **Perguntas respondidas com sucesso!**',
                                                    description: `Obrigado! Aguarde o responsável pela aplicação desse pedido lhe enviar novas instruções. Lembre-se, ser educado e profissional resultará de forma positiva na sua aplicação.`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[0]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                            break;
                                            case emotes[1]:
                                                
                                                var embed = {
                                                    title: ':woman_astronaut: **Perguntas respondidas com sucesso!**',
                                                    description: `Obrigado! Aguarde o responsável pela aplicação desse pedido lhe enviar novas instruções. Lembre-se, ser educado e profissional resultará de forma positiva na sua aplicação.`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[1]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                            break;
                                            case emotes[2]:
                                                
                                                var embed = {
                                                    title: ':woman_astronaut: **Perguntas respondidas com sucesso!**',
                                                    description: `Obrigado! Aguarde o responsável pela aplicação desse pedido lhe enviar novas instruções. Lembre-se, ser educado e profissional resultará de forma positiva na sua aplicação.`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[2]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                            break;
                                            case emotes[3]:
                                                
                                                var embed = {
                                                    title: ':woman_astronaut: **Perguntas respondidas com sucesso!**',
                                                    description: `Obrigado! Aguarde o responsável pela aplicação desse pedido lhe enviar novas instruções. Lembre-se, ser educado e profissional resultará de forma positiva na sua aplicação.`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[3]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                            break;
                                            case emotes[4]:
                                                
                                                var embed = {
                                                    title: ':woman_astronaut: **Perguntas respondidas com sucesso!**',
                                                    description: `Obrigado! Aguarde o responsável pela aplicação desse pedido lhe enviar novas instruções. Lembre-se, ser educado e profissional resultará de forma positiva na sua aplicação.`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[4]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                            break;
                                            case emotes[5]:
                                                
                                                var embed = {
                                                    title: ':woman_astronaut: **Perguntas respondidas com sucesso!**',
                                                    description: `Obrigado! Aguarde o responsável pela aplicação desse pedido lhe enviar novas instruções. Lembre-se, ser educado e profissional resultará de forma positiva na sua aplicação.`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[5]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                            break;
                                            case emotes[6]:
                                                
                                                var embed = {
                                                    title: ':woman_astronaut: **Perguntas respondidas com sucesso!**',
                                                    description: `Obrigado! Aguarde o responsável pela aplicação desse pedido lhe enviar novas instruções. Lembre-se, ser educado e profissional resultará de forma positiva na sua aplicação.`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[6]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                            break;
                                            case emotes[7]:
                                                
                                                var embed = {
                                                    title: ':woman_astronaut: **Perguntas respondidas com sucesso!**',
                                                    description: `Obrigado! Aguarde o responsável pela aplicação desse pedido lhe enviar novas instruções. Lembre-se, ser educado e profissional resultará de forma positiva na sua aplicação.`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[7]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                            break;
                                            case emotes[8]:
                                                
                                                var embed = {
                                                    title: ':woman_astronaut: **Perguntas respondidas com sucesso!**',
                                                    description: `Obrigado! Aguarde o responsável pela aplicação desse pedido lhe enviar novas instruções. Lembre-se, ser educado e profissional resultará de forma positiva na sua aplicação.`,
                                                    color: '#4895EF'
                                                }

                                                canal.send({ embed: embed })
                                                canal.send(`<@${array[8]}>`).then(msg => msg.delete({ timeout: 5000 }))

                                            break;
                                            case emotes[9]:
                                                
                                                var embed = {
                                                    title: ':woman_astronaut: **Perguntas respondidas com sucesso!**',
                                                    description: `Obrigado! Aguarde o responsável pela aplicação desse pedido lhe enviar novas instruções. Lembre-se, ser educado e profissional resultará de forma positiva na sua aplicação.`,
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

            //form("142141414214", "4124214214", "45124124214214") (EXEMPLO DE COMO DEVE FICAR)
            //form("Canal que aparece fica a mensagem para o usuário reagir", "Categoria que aparece os formulários", "Cargo que pode ver os formulários")
            form("808444826399145994", "807349149765992489", "807338010436960357")

        }

    })

}