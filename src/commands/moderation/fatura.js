const Discord = require('discord.js')
const mercadopago = require('mercadopago')

module.exports = {
    name: 'fatura',
    aliases: ['fatura'],
    run: async(client, message, args) => {

        var embed = {
            title: ':woman_astronaut: Você não possui permissão!',
            description: 'Você não possui permissão para executar este comando.',
            color: '#4895EF'
        }

        if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply({ embed: embed })

        var embed = {
            title: ':man_scientist: Pergunta #1',
            description: 'Qual será o nome desse serviço?',
            color: '#4895EF'
        }

        var msg = await message.reply({ embed: embed })

        var filtro = (m) => m.author.id === message.author.id 
        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

        collector.on('collect', async (msg) => {

            var embed = {
                title: ':man_scientist: Pergunta #2',
                description: 'Qual o valor desse serviço?',
                color: '#4895EF'
            }

            var msg1 = await message.reply({ embed: embed })

            collector = msg.channel.createMessageCollector(filtro, { max: 1 })
            collector.on('collect', async (msg1) => {

                if(isNaN(msg1.content)) return message.reply('Você pode inserir somente números como preço.')

                var preferencia = {
                    items: [
                        {
                            title: msg.content,
                            quantity: 1,
                            unit_price: Number(msg1.content)
                        }
                    ]
                };

                var promise = await mercadopago.preferences.create(preferencia)
                
                var embed = {
                    title: ':shopping_cart: Fatura disponível para pagamento!',
                    description: `Clique no link abaixo para efetuar o pagamento.\n\nFatura:\n${promise.body.init_point}\n\n:man_astronaut: Obrigado por **aceitar*8 trabalhar conosco!`,
                    color: '#4895EF'
                }

                message.reply({ embed: embed })

            })

        })

    }
}