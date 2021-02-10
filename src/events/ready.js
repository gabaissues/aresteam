module.exports = async (client) => {

    client.on('ready', async () => {

        console.log(` _____________________________________________`)
        console.log('|                                             |')
        console.log(`| Olá, estou online com atualmente ${client.commands.size} comando |`)
        console.log(`|_____________________________________________|`)

        var embed = {
            author: {
                name: `Suporte.`,
                icon_url: client.guilds.cache.get('782061667717742612').iconURL()
            },
            description: `Olá! Seja bem-vindo(a) ao nosso sistema de atendimento. Para que possamos começar com o seu atendimento, clique na reação que deseja tratar sobre. Após isso, vá até o canal que você foi mencionado(a) para que possamos tratar sobre o assunto. Tenha um otimo atendimento ;)\n\n🙇 **⋅ Categorias.**\n\n> 😭 **» Dúvidas.**\n> 💳 **» Orçamento.**\n\n⚠️ **⋅ Observação.**\n\nUso inadequado resultará em punição.`,
            image: {
                url: 'https://media.discordapp.net/attachments/803751212511526963/804752744606466078/advancement.png?width=432&height=86'
            },
            color: '#4895EF'
        }

        //A cima, é a mensagem que o bot irá enviar como ticket. Mas antes disso, ele vai apagar todas as mensagens do canal.
        //Para alterar o ID do canal, mude os numeros 804748012487573512 para o id atual do canal.
        //Para que funcione corretamente o icone do seu servidor também, mude o valor 803473185910947930 para o ID do seu servidor.

        client.channels.cache.get('807325945282166824').bulkDelete(100)

        var msg = await client.channels.cache.get('807325945282166824').send({ embed: embed })
        msg.react('😭')
        await msg.react('💳')

        async function messages(channel, react, area) {

            client.channels.cache.get(channel).bulkDelete(100)

            var embed = {
                title: ':man_astronaut: **Deseja aplicar-se?**',
                description: `O que você está esperando para tornar-se um(a) ${area.toLowerCase()} da Ares?\n\nVocê precisa atender todos os **requisitos** citados no canal #informações.\nReaja ao **emoji** abaixo para criar uma requisição de aplicação!`,
                color: '#4895EF'
            }

            var msg = await client.channels.cache.get(channel).send({ embed: embed })
            msg.react(react)

        }

        messages("808444826399145994", "👋", "Designer")
        //Adicione a linha a cima para caso queira adicionar novos formulários.

    })

}