const Discord = require('discord.js')

module.exports = {
    name: 'metodos',
    aliases: ['métodos', 'metodos'],
    run: async(client, message, args) => {

        var embed = {
            title: ':man_astronaut: Escolha qual método deseja efetuar o pagamento!',
            description: `:one: **Mercado Pago** - Cartão de crédito, débito ou saldo do Mercado Pago.\n:two: **PayPal** - Cartão de crédito, débito ou saldo do PayPal.\n:three: **PIX** - Pagamento através de Chave PIX.\n\nReaja ao **emoji** abaixo de acordo com o método de pagamento que deseja efetuar.`,
            color: '#4895EF'
        }

        var msg = await message.reply({ embed: embed })
        var emotes = ["1️⃣", "2️⃣", "3️⃣"]
                            
        for(let i in emotes) msg.react(emotes[i])
        var filtro = (r, u) => u.id === u.id 
        collector = msg.createReactionCollector(filtro, { max: 1 })

        collector.on('collect', async (r) => {

            switch(r.emoji.name) {

                case "1️⃣":

                    var embed = {
                        title: ':man_scientist: Método definido com sucesso!',
                        description: `Aguarde o(a) administrador responsável por essa comissão gerar a fatura de pagamento.\n\nMétodo de pagamento definido: **Mercado Pago**`,
                        color: '#4895EF'
                    }

                    message.reply({ embed: embed })

                break;
                case "2️⃣":

                    var embed = {
                        title: ':man_scientist: Método definido com sucesso!',
                        description: `Aguarde o(a) administrador responsável por essa comissão gerar a fatura de pagamento.\n\nMétodo de pagamento definido: **PayPal**`,
                        color: '#4895EF'
                    }

                    message.reply({ embed: embed })

                break;
                case "3️⃣":

                    var embed = {
                        title: ':man_scientist: Método definido com sucesso!',
                        description: `Aguarde o(a) administrador responsável por essa comissão gerar a fatura de pagamento.\n\nMétodo de pagamento definido: **PIX**`,
                        color: '#4895EF'
                    }

                    message.reply({ embed: embed })

                break;
            }

        })

    }
}