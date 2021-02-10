const Discord = require('discord.js')
const mercadopago = require('mercadopago')

module.exports = {
    name: 'fatura',
    aliases: ['fatura'],
    run: async(client, message, args) => {

        if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('Somente administradores podem executar este comando.')

        var msg = await message.reply('Qual seria o nome do produto? **(60 segundos)**')

        var filtro = (m) => m.author.id === message.author.id 
        collector = msg.channel.createMessageCollector(filtro, { max: 1, time: 60000 })

        collector.on('collect', async (msg) => {

            var msg1 = await message.reply('Qual seria o preço do produto? **(60 segundos)**')

            collector = msg.channel.createMessageCollector(filtro, { max: 1, time: 60000 })
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
                    title: '💳 ⋅ Perfeito!',
                    description: `O link de pagamento foi criado com sucesso, boas vendas ;)\n\n(${promise.body.init_point})`,
                    color: '#4895EF'
                }

                message.reply({ embed: embed })

            })

        })

    }
}