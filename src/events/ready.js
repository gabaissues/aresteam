module.exports = async (client) => {

    client.on('ready', async () => {

        console.log(` _____________________________________________`)
        console.log('|                                             |')
        console.log(`| Olá, estou online com atualmente ${client.commands.size} comando |`)
        console.log(`|_____________________________________________|`)

        var embed = {
            title: ':man_astronaut: Deseja adquirir um dos nossos serviços?',
            description: `Contamos com uma equipe bem formada para fornecer um ótimo trabalho.\n\n:shopping_cart: **Qual dos nossos serviços você deseja adquirir?**\nVeja abaixo as categorias disponíveis de serviços:\n\n:one: Designer\n:two: Construções\n:three: Desenvolvimento\n\nLeia atentamente o canal <#782062328464146462> e <#809823664849682452> antes de efetuar um pedido de serviço.\n\nReaja ao **emoji** abaixo correspondente ao serviço que você deseja!`,
            color: '#4895EF'
        }

        //A cima, é a mensagem que o bot irá enviar como ticket. Mas antes disso, ele vai apagar todas as mensagens do canal.
        //Para alterar o ID do canal, mude os numeros 804748012487573512 para o id atual do canal.
        //Para que funcione corretamente o icone do seu servidor também, mude o valor 803473185910947930 para o ID do seu servidor.

        client.channels.cache.get('807325945282166824').bulkDelete(100)

        var msg = await client.channels.cache.get('807325945282166824').send({ embed: embed })
        var emotes = ["1️⃣", "2️⃣", "3️⃣"]
        
        for(let i in emotes) msg.react(emotes[i])

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

        messages("809828302310604800", "👋", "Designer")
        messages("807376703366103050", "👋", "Desenvolvedor")
        messages("808461854477254696", "👋", "Construtor")

        client.user.setActivity('discord.aresteam.com.br')

        //Adicione a linha a cima para caso queira adicionar novos formulários.

    })

}