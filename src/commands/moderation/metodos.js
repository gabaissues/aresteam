const Discord = require('discord.js')

module.exports = {
    name: 'metodos',
    aliases: ['métodos', 'metodos'],
    run: async(client, message, args) => {

        if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('Somente administradores podem executar este comando.')

        var embed = {
            title: ':man_astronaut: Quem será o(a) cliente?',
            description: `Informe-nos o(a) cliente.`,
            color: '#4895EF'
        }

        var msg = await message.reply({ embed: embed })
        var filtro = (m) => m.author.id === message.author.id 

        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

        collector.on('collect', async (msg) => {

            let membro = msg.mentions.users.first
            
            var embed = {
                title: ':man_mechanic: Informação inválida!',
                description: 'Você não inseriu nenhum usuário(a) válido(a).',
                color: '#4895EF'
            }

            if(!membro) return message.reply({ embed: embed })

            var embed = {
                title: ':man_astronaut: Escolha uma das nossas formas de pagamento!',
                description: `Veja abaixo todas as nossas formas de pagamento disponível:\n\n:one: **Mercado Pago** - Cartão de crédito, débito ou saldo do Mercado Pago.\n:two: **PayPal** - Cartão de crédito, débito ou saldo do PayPal.\n:three: **PIX** - Pagamento através de Chave PIX.\n\nReaja ao **emoji** abaixo de acordo com o método de pagamento que deseja efetuar.`,
                color: '#4895EF'
            }
    
            var msg1 = await message.reply({ embed: embed })
            var emotes = ["1️⃣", "2️⃣", "3️⃣"]
                                
            for(let i in emotes) msg1.react(emotes[i])
            var filtro = (r, u) => u.id === membro.id
            collector = msg1.createReactionCollector(filtro, { max: 1 })
    
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

        })

    }
}