const Discord = require('discord.js')

module.exports = {
    name: 'ajuda',
    aliases: ['ajuda', 'help', 'tutorial'],
    run: async(client, message, args) => {

        var embed = {
            title: ':man_astronaut: Conheça todos os nossos comandos disponíveis para equipe!',
            description: `Veja abaixo todos os nossos comandos disponíveis:\n\n:shopping_cart: **Definir método de pagamento!**\nIremos utilizar o método de pagamento definido por você para efetuar pagamentos pelos seus serviços prestados.\n\n**Comando:**\n-pagamentos\n\n:incoming_envelope: **Definir endereço de e-mail**\nIremos utilizar seu endereço de e-mail para efetuar pagamentos.\n\n**Comando:**\n-e-mail <e-mail>\n\n**:man_scientist: Definir portfólio!**\nIremos utilizar seu portfólio para que os clientes possam visualizar seus serviços. Você só poderá efetuar um lance caso tenha seu portfólio definido.\n\n**Comando:**\n-portfólio <link>\n\n**:man_astronaut: Conheça todos os nossos comandos disponíveis para administração!**\nVeja abaixo todos os nossos comandos disponíveis para administração:\n\n**:man_scientist:  Enviar comissão!**\nUtilize esse comando para enviar a seguinte comissão para os membros da Equipe Ares.\n\n**Comando:**\n-comissão\n\n**:woman_scientist: Comissão finalizada!**\nUtilize esse comando quando a comissão for finalizada.\n\n**Comando:**\n-fechar\n\n**:astronaut: Veja abaixo todos os nossos comandos disponíveis para os nossos membros:**\n\n**:man_scientist: Visualizar perfil!**\nUtilize esse comando para visualizar um perfil de um membro da nossa Equipe Ares.\n\nComando:\n-perfil <usuário(a)>`,
            color: '#4895EF'
        }

        message.reply({ embed: embed })

    }
}