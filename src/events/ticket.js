const Discord = require('discord.js')
const Cooldown = new Set()

module.exports = (client) => {

    client.on('messageReactionAdd', async (r, u) => {

        if (r.message.partial) await r.message.fetch()
        if (r.partial) await r.fetch()

        if (u.bot) return;
        if (!r.message) return;

        if(r.message.channel.id == 804748012487573512) {//Esse ID é o ID no qual ficará a mensagem do ticket, preste bem a atenção nisso.

            if(Cooldown.has(u.id)) {

                r.users.remove(u.id)
                u.send('Você tem que esperar três minutos para que possa abrir outro ticket, por favor, espere.').catch(err => { return });

            } else {

                async function ticket(react, name, role) {

                    if(r.emoji.name === react) {

                        r.users.remove(u.id)

                        Cooldown.add(u.id)

                        var canal = await r.message.guild.channels.create(`${name}-${u.tag}`, { parent: '804751358980391023' })//Esse ID é o da categoria no qual vai ficar os tickets.

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

                            if(reaction.me == true) return;

                            canal.send('Canal sendo deletado dentro de 3 segundos...')
                            setTimeout(() => {

                                canal.delete()
                                Cooldown.delete(u.id)

                            }, 3000)

                        })


                    } else {

                        return;

                    }

                }

                //A cima, está todo o sistema que está por trás do ticket. Para que não fique com diversas linhas, criei
                //Uma function no qual você mesma pode adicionar tickets sem problemas. Basta replicar essa linha
                //A baixo, e adicionar o nome, no caso está dúvida.

                //No terceiro parametro, é o cargo da equipe.

                ticket('😭', 'Dùvida', '803749942660431914')

            }

        } else {

            return;

        }


    })

}