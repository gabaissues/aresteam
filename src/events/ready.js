module.exports = async (client) => {

    client.on('ready', async () => {

        console.log(` _____________________________________________`)
        console.log('|                                             |')
        console.log(`| Olá, estou online com atualmente ${client.commands.size} comandos |`)
        console.log(`|_____________________________________________|`)

        var embed = {
            author: {
                name: `Suporte.`,
                icon_url: client.guilds.cache.get('803473185910947930').iconURL()
            },
            description: `Olá! Seja bem-vindo(a) ao nosso sistema de atendimento. Para que possamos começar com o seu atendimento, clique na reação que deseja tratar sobre. Após isso, vá até o canal que você foi mencionado(a) para que possamos tratar sobre o assunto. Tenha um otimo atendimento ;)\n\n🙇 **⋅ Categorias.**\n\n> 😭 **» Dúvida.**\n\n⚠️ **⋅ Observação.**\n\nUso inadequado resultará em punição.`,
            image: {
                url: 'https://media.discordapp.net/attachments/803751212511526963/804752744606466078/advancement.png?width=432&height=86'
            },
            color: '#4895EF'
        }

        //A cima, é a mensagem que o bot irá enviar como ticket. Mas antes disso, ele vai apagar todas as mensagens do canal.
        //Para alterar o ID do canal, mude os numeros 804748012487573512 para o id atual do canal.
        //Para que funcione corretamente o icone do seu servidor também, mude o valor 803473185910947930 para o ID do seu servidor.

        client.channels.cache.get('804748012487573512').bulkDelete(100)

        var msg = await client.channels.cache.get('804748012487573512').send({ embed: embed })
        msg.react('😭')

    })

}