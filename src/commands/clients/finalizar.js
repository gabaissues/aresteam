const Discord = require('discord.js')
const { database } = require('../../services/firebase.js')

module.exports = {
    name: 'finalizar',
    aliases: ['fechar', 'finalizar'],
    run: async(client, message, args) => {

        var msg = await message.reply('Qual é o administrador que prestou serviço? (Mencione-o)')
        var filtro = (m) => m.author.id === message.author.id 

        collector = msg.channel.createMessageCollector(filtro, { max: 1 })
        collector.on('collect', async (msg) => {

            const adm = message.guild.member(msg.mentions.users.first() || message.guild.members.cache.get(msg.content))
            if(!adm) return message.reply('Você não inseriu o administrador que te atendeu.')

            var msg1 = await message.reply('Qual nota você daria para o atendimento? (1 a 5)')
            var emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]

            for(let i in emotes) msg1.react(emotes[i])

            var rfiltro = (r, u) => u.id === message.author.id 
            collector = msg1.createReactionCollector(rfiltro, { max: 1 })
            
            collector.on('collect', async (r, u) => {

                switch(r.emoji.name) {

                    case emotes[0]:

                        var msg2 = await message.reply('Qual é o freelancer que te atendeu? (Mencione-0)')
                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                        collector.on('collect', async (msg2) => {

                            const membro = message.guild.member(msg2.mentions.users.first() || message.guild.members.cache.get(msg2.content))    
                            if(!membro) return message.reply('Você não inseriu o freelancer que te atendeu.')

                            var msg3 = await message.reply('Qual nota você daria para o atendimento? (1 a 5)')
                            var emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]
                
                            for(let i in emotes) msg3.react(emotes[i])
                            collector = msg3.createReactionCollector(rfiltro, { max: 1 })
            
                            collector.on('collect', async (r, u) => {

                                switch(r.emoji.name) {

                                    case emotes[0]:
                                    
                                        var msg4 = await message.reply('Quanto o freelancer recebeu deste trabalho? (Insira somente números)')
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg4) => {

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            message.reply('Estarei fechando o ticket dentro de 1 hora, você pode revisar tudo certinho até lá.')
                                            
                                            var embed = {
                                                title: '👨‍💼 Comissão concluida!',
                                                description: `Usuário: ${membro}\nCliente: ${message.author.username}\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }
                                            
                                            var msg5 = await message.guild.channels.cache.get('805191108766072873').send({ embed: embed })
                                            msg5.react('👍')

                                            collector = msg5.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                msg5.delete()
                                                r.message.channel.send('Obrigado por coperar com nosso trabalho!').then(msg => msg.delete({ timeout: 5000 }))

                                            })

                                        })
                                    
                                    break;
                                    case emotes[1]:
                                    
                                    
                                    
                                    break;
                                    case emotes[2]:
                                    
                                    
                                    
                                    break;
                                    case emotes[3]:
                                    
                                    
                                    
                                    break;
                                    case emotes[4]:



                                    break;

                                }

                            })
                
                        })

                    break;
                    case emotes[1]:



                    break;
                    case emotes[2]:



                    break;
                    case emotes[3]:



                    break;
                    case emotes[4]:



                    break;

                }

            })

        })

    }
}