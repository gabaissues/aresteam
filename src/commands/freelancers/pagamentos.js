const Discord = require('discord.js')
const { database } = require('../../services/firebase')

module.exports = {
    name: 'pagamentos',
    aliases: ['pagamentos'],
    run: async(client, message, args) => {

        const user = await database.ref(`Perfils/${message.author.id}`).once('value')

        var embed = {
            title: ':shopping_cart: Metódos de pagamento!',
            description: `Veja abaixo os métodos de pagamento:\n\n:one: - Mercado Pago\n:two: - PayPal\n:three: - PIX\n\nReaja ao emoji abaixo correspondente ao método de pagamento que você deseja.`,
            color: '#4895EF'
        }

        var msg = await message.reply({ embed: embed })
        var emotes = ["1️⃣", "2️⃣", "3️⃣"]
                            
        for(let i in emotes) msg.react(emotes[i])
        var filtro = (r, u) => u.id === message.author.id 
        collector = msg.createReactionCollector(filtro, { max: 1 })

        collector.on('collect', async (r) => {

            switch(r.emoji.name) {

                case "1️⃣":

                    if(user.val() === null) {

                        database.ref(`Perfils/${message.author.id}`).set({
                            portfolio: 'MercadoPago',
                            avalia: 0,
                            recebido: 0
                        })

                    }

                    database.ref(`Perfils/${message.author.id}`).update({
                        metodo: 'Mercado Pago'
                    })

                    var embed = {
                        title: ':man_astronaut: Metódo de pagamento alterado com sucesso!',
                        description: 'Você alterou o seu método de pagamento com sucesso.',
                        color: '4895EF'
                    }

                    message.reply({ embed: embed })

                break;
                case "2️⃣":

                    if(user.val() === null) {

                        database.ref(`Perfils/${message.author.id}`).set({
                            metodo: 'PayPal',
                            avalia: 0,
                            recebido: 0
                        })

                    }

                    database.ref(`Perfils/${message.author.id}`).update({
                        metodo: 'PayPal'
                    })

                    var embed = {
                        title: ':man_astronaut: Metódo de pagamento alterado com sucesso!',
                        description: 'Você alterou o seu método de pagamento com sucesso.',
                        color: '4895EF'
                    }

                    message.reply({ embed: embed })

                break;
                case "3️⃣":

                    var embed = {
                        title: ':man_scientist: Método de pagamento PIX!',
                        description: `Digite sua chave PIX.`,
                        color: '#4895EF'
                    }

                    var msg1 = await message.reply({ embed: embed })
                    var filtro = (m) => m.author.id === message.author.id 

                    collector = msg1.channel.createMessageCollector(filtro, { max: 1 })
                    collector.on('collect', async (msg1) => {

                        if(user.val() === null) {

                            database.ref(`Perfils/${message.author.id}`).set({
                                metodo: 'PIX',
                                chave: msg1.content,
                                avalia: 0,
                                recebido: 0
                            })
    
                        }

                        database.ref(`Perfils/${message.author.id}`).update({
                            metodo: 'PIX',
                            chave: msg1.content
                        })
    
                        var embed = {
                            title: ':man_astronaut: Metódo de pagamento alterado com sucesso!',
                            description: 'Você alterou o seu método de pagamento com sucesso.',
                            color: '4895EF'
                        }
    
                        message.reply({ embed: embed })
    
                    })

                break;

            }

        })
        
    }
}