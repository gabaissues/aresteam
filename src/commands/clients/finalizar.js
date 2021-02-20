const Discord = require('discord.js')
const { database } = require('../../services/firebase.js')

module.exports = {
    name: 'finalizar',
    aliases: ['fechar', 'finalizar'],
    run: async (client, message, args) => {

        var embed = {
            title: ':man_scientist: Pergunta #1',
            description: 'Quem foi o cliente desse serviço?',
            color: '#4895EF'
        }

        var msg = await message.reply({ embed: embed })
        var filtro = (m) => m.author.id === message.author.id

        collector = msg.channel.createMessageCollector(filtro, { max: 1 })
        collector.on('collect', async (msg) => {

            var embed = {
                title: ':man_mechanic: Informação inválida!',
                description: 'Você não inseriu um(a) cliente válido(a).',
                color: '#4895EF'
            }

            const client = message.guild.member(msg.mentions.users.first() || message.guild.members.cache.get(msg.content))
            if (!client) return message.reply({ embed: embed })

            var embed = {
                title: '👨‍💼 Avalie a administração desse serviço!',
                description: `Por favor, avalie o serviço prestado por ${message.author}\n\nDe acordo com o serviço prestado, avalie de 1 a 5 sua experiência trabalhando com esse administrador.\n\nReaja ao **emoji** abaixo correspondente a avaliação que você deseja dar ao administrador responsável por essa comissão.`,
                color: '#4895EF'
            }

            var msg2 = await message.reply({ embed: embed })
            var emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]

            for (let i in emotes) msg2.react(emotes[i])

            var rfiltro = (r, u) => u.id === client.id
            collector = msg2.createReactionCollector(rfiltro, { max: 1 })

            collector.on('collect', async (r, u) => {//👨‍💼 Avalie a administração desse serviço!

                switch (r.emoji.name) {

                    case emotes[0]:

                        var embed = {
                            title: ':man_scientist: Pergunta #2',
                            description: `Quem prestou esse serviço?`,
                            color: '#4895EF'
                        }

                        var msg3 = await message.reply({ embed: embed })
                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                        collector.on('collect', async (msg3) => {

                            var embed = {
                                title: ':man_mechanic: Informação inválida!',
                                description: 'Você não inseriu nenhum usuário(a) válido(a).',
                                color: '#4895EF'
                            }

                            const membro = message.guild.member(msg3.mentions.users.first() || message.guild.members.cache.get(msg3.content))
                            if (!membro) return message.reply({ embed: embed })

                            var embed = {
                                title: ':man_scientist: Avalie o serviço prestado!',
                                description: `Por favor, avalie o serviço prestado por ${membro}.\nDe acordo com o serviço prestado, avalie de 1 a 5 sua experiência trabalhando com esse membro da Equipe Ares.\n\nReaja ao **emoji** abaixo correspondente a avaliação que você deseja dar ao membro da Equipe Ares responsável por esse serviço.`,
                                color: '#4895EF'
                            }

                            var msg4 = await message.reply({ embed: embed })
                            var emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]

                            for (let i in emotes) msg4.react(emotes[i])
                            collector = msg4.createReactionCollector(rfiltro, { max: 1 })

                            collector.on('collect', async (r, u) => {

                                switch (r.emoji.name) {

                                    case emotes[0]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - 1️⃣\n\nAvaliação do(a) criador(a) do produto: ${membro} - 1️⃣\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[1]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - 1️⃣\n\nAvaliação do(a) criador(a) do produto: ${membro} - :two:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[2]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - 1️⃣\n\nAvaliação do(a) criador(a) do produto: ${membro} - :three:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[3]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - 1️⃣\n\nAvaliação do(a) criador(a) do produto: ${membro} - :four:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[4]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - 1️⃣\n\nAvaliação do(a) criador(a) do produto: ${membro} - :five:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;

                                }

                            })

                        })

                        break;
                    case emotes[1]:

                        var embed = {
                            title: ':man_scientist: Pergunta #2',
                            description: `Quem prestou esse serviço?`,
                            color: '#4895EF'
                        }

                        var msg3 = await message.reply({ embed: embed })
                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                        collector.on('collect', async (msg3) => {

                            var embed = {
                                title: ':man_mechanic: Informação inválida!',
                                description: 'Você não inseriu nenhum usuário(a) válido(a).',
                                color: '#4895EF'
                            }

                            const membro = message.guild.member(msg3.mentions.users.first() || message.guild.members.cache.get(msg3.content))
                            if (!membro) return message.reply({ embed: embed })

                            var embed = {
                                title: ':man_scientist: Avalie o serviço prestado!',
                                description: `Por favor, avalie o serviço prestado por ${membro}.\nDe acordo com o serviço prestado, avalie de 1 a 5 sua experiência trabalhando com esse membro da Equipe Ares.\n\nReaja ao **emoji** abaixo correspondente a avaliação que você deseja dar ao membro da Equipe Ares responsável por esse serviço.`,
                                color: '#4895EF'
                            }

                            var msg4 = await message.reply({ embed: embed })
                            var emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]

                            for (let i in emotes) msg4.react(emotes[i])
                            collector = msg4.createReactionCollector(rfiltro, { max: 1 })

                            collector.on('collect', async (r, u) => {

                                switch (r.emoji.name) {

                                    case emotes[0]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :two:\n\nAvaliação do(a) criador(a) do produto: ${membro} - 1️⃣\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[1]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :two:\n\nAvaliação do(a) criador(a) do produto: ${membro} - :two:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[2]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :two:\n\nAvaliação do(a) criador(a) do produto: ${membro} - :three:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[3]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :two:\n\nAvaliação do(a) criador(a) do produto: ${membro} - :four:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[4]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :two:\n\nAvaliação do(a) criador(a) do produto: ${membro} - :five:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;

                                }

                            })

                        })

                        break;
                    case emotes[2]:

                        var embed = {
                            title: ':man_scientist: Pergunta #2',
                            description: `Quem prestou esse serviço?`,
                            color: '#4895EF'
                        }

                        var msg3 = await message.reply({ embed: embed })
                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                        collector.on('collect', async (msg3) => {

                            var embed = {
                                title: ':man_mechanic: Informação inválida!',
                                description: 'Você não inseriu nenhum usuário(a) válido(a).',
                                color: '#4895EF'
                            }

                            const membro = message.guild.member(msg3.mentions.users.first() || message.guild.members.cache.get(msg3.content))
                            if (!membro) return message.reply({ embed: embed })

                            var embed = {
                                title: ':man_scientist: Avalie o serviço prestado!',
                                description: `Por favor, avalie o serviço prestado por ${membro}.\nDe acordo com o serviço prestado, avalie de 1 a 5 sua experiência trabalhando com esse membro da Equipe Ares.\n\nReaja ao **emoji** abaixo correspondente a avaliação que você deseja dar ao membro da Equipe Ares responsável por esse serviço.`,
                                color: '#4895EF'
                            }

                            var msg4 = await message.reply({ embed: embed })
                            var emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]

                            for (let i in emotes) msg4.react(emotes[i])
                            collector = msg4.createReactionCollector(rfiltro, { max: 1 })

                            collector.on('collect', async (r, u) => {

                                switch (r.emoji.name) {

                                    case emotes[0]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :three:\n\nAvaliação do(a) criador(a) do produto: ${membro} - 1️⃣\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[1]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :three:\n\nAvaliação do(a) criador(a) do produto: ${membro} - :two:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[2]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :three:\n\nAvaliação do(a) criador(a) do produto: ${membro} - :three:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[3]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :three:\n\nAvaliação do(a) criador(a) do produto: ${membro} - :four:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[4]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :three:\n\nAvaliação do(a) criador(a) do produto: ${membro} - :five:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;

                                }

                            })

                        })

                        break;
                    case emotes[3]:

                        var embed = {
                            title: ':man_scientist: Pergunta #2',
                            description: `Quem prestou esse serviço?`,
                            color: '#4895EF'
                        }

                        var msg3 = await message.reply({ embed: embed })
                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                        collector.on('collect', async (msg3) => {

                            var embed = {
                                title: ':man_mechanic: Informação inválida!',
                                description: 'Você não inseriu nenhum usuário(a) válido(a).',
                                color: '#4895EF'
                            }

                            const membro = message.guild.member(msg3.mentions.users.first() || message.guild.members.cache.get(msg3.content))
                            if (!membro) return message.reply({ embed: embed })

                            var embed = {
                                title: ':man_scientist: Avalie o serviço prestado!',
                                description: `Por favor, avalie o serviço prestado por ${membro}.\nDe acordo com o serviço prestado, avalie de 1 a 5 sua experiência trabalhando com esse membro da Equipe Ares.\n\nReaja ao **emoji** abaixo correspondente a avaliação que você deseja dar ao membro da Equipe Ares responsável por esse serviço.`,
                                color: '#4895EF'
                            }

                            var msg4 = await message.reply({ embed: embed })
                            var emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]

                            for (let i in emotes) msg4.react(emotes[i])
                            collector = msg4.createReactionCollector(rfiltro, { max: 1 })

                            collector.on('collect', async (r, u) => {

                                switch (r.emoji.name) {

                                    case emotes[0]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :four:\n\nAvaliação do(a) criador(a) do produto: ${membro} - 1️⃣\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[1]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :four:\n\nAvaliação do(a) criador(a) do produto: ${membro} - :two:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[2]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :four:\n\nAvaliação do(a) criador(a) do produto: ${membro} - :three:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[3]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :four:\n\nAvaliação do(a) criador(a) do produto: ${membro} - :four:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[4]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :four:\n\nAvaliação do(a) criador(a) do produto: ${membro} - :five:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;

                                }

                            })

                        })

                        break;
                    case emotes[4]:

                        var embed = {
                            title: ':man_scientist: Pergunta #2',
                            description: `Quem prestou esse serviço?`,
                            color: '#4895EF'
                        }

                        var msg3 = await message.reply({ embed: embed })
                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                        collector.on('collect', async (msg3) => {

                            var embed = {
                                title: ':man_mechanic: Informação inválida!',
                                description: 'Você não inseriu nenhum usuário(a) válido(a).',
                                color: '#4895EF'
                            }

                            const membro = message.guild.member(msg3.mentions.users.first() || message.guild.members.cache.get(msg3.content))
                            if (!membro) return message.reply({ embed: embed })

                            var embed = {
                                title: ':man_scientist: Avalie o serviço prestado!',
                                description: `Por favor, avalie o serviço prestado por ${membro}.\nDe acordo com o serviço prestado, avalie de 1 a 5 sua experiência trabalhando com esse membro da Equipe Ares.\n\nReaja ao **emoji** abaixo correspondente a avaliação que você deseja dar ao membro da Equipe Ares responsável por esse serviço.`,
                                color: '#4895EF'
                            }

                            var msg4 = await message.reply({ embed: embed })
                            var emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]

                            for (let i in emotes) msg4.react(emotes[i])
                            collector = msg4.createReactionCollector(rfiltro, { max: 1 })

                            collector.on('collect', async (r, u) => {

                                switch (r.emoji.name) {

                                    case emotes[0]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :five:\n\nAvaliação do(a) criador(a) do produto: ${membro} - 1️⃣\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[1]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :five:\n\nAvaliação do(a) criador(a) do produto: ${membro} - :two:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[2]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :five:\n\nAvaliação do(a) criador(a) do produto: ${membro} - :three:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[3]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - :five:\n\nAvaliação do(a) criador(a) do produto: ${membro} - :four:\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;
                                    case emotes[4]:

                                        var embed = {
                                            title: ':man_scientist: Pergunta #3',
                                            description: `Qual foi o valor desse serviço?`,
                                            color: '#4895EF'
                                        }

                                        var msg5 = await message.reply({ embed: embed })
                                        collector = msg.channel.createMessageCollector(filtro, { max: 1 })

                                        collector.on('collect', async (msg5) => {

                                            msg5.channel.bulkDelete(2)

                                            var embed = {
                                                title: ':man_mechanic: Informação inválida!',
                                                description: 'Você não inseriu uma quantia válida.',
                                                color: '#4895EF'
                                            }

                                            if (isNaN(msg5.content)) return message.reply({ embed: embed })
                                            msg5.delete()

                                            const util = await database.ref(`Solicitações`).once('value')
                                            let data = []
                                    
                                            util.forEach(x => {


                                                if(x.val().user === client.id && x.val().adm === message.author.id) {

                                                    data.push({ canal: x.val().canal, valor: x.val().valor, taxa: x.val().taxa })

                                                }
                                    
                                            })

                                            const user = await database.ref(`Perfils/${membro.id}`).once('value')

                                            var embed = {
                                                title: ':man_scientist: Trabalho concluído com sucesso!',
                                                description: 'Obrigado por trabalhar conosco, esperamos que tenha gostado do serviço.\n\n:clock1: **Aguarde um pouco!**\nEstaremos fechando esse canal em 1 hora automaticamente.',
                                                color: '#4895EF'
                                            }

                                            message.reply({ embed: embed })

                                            setTimeout(() => {

                                                message.channel.delete()
                                                database.ref(`Solicitações/${data[0].canal}`).delete()

                                            }, 3600000)

                                            var taxa = data[0].taxa
                                            let total = data[0].valor

                                            total = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let freelancer = (msg5.content-taxa)
                                            
                                            freelancer = freelancer.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            let adm = (taxa * 15) / 100
                                            let ares = (data[0].taxa-adm)

                                            adm = adm.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            console.log(ares)

                                            ares = ares.toLocaleString('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

                                            var embed = {
                                                title: ':shopping_cart: Comissão concluida com sucesso!',
                                                description: `Leia atentamente as informações abaixo.\n\nUsuário(a): ${membro}\nAdministrador: ${message.author}\nCliente: ${client}\nValor **total** da comissão: ${total}\n\n**:man_astronaut: Informações do(a) usuário(a):**\n\nE-mail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\n${user.val().chave ? `Chave PIX: ${user.val().chave}\n` : ''}Valor que irá receber: ${freelancer}\n\n**:man_scientist:  Informações do(a) administrador(a):**\n\nEmail: ${user.val().email}\nMétodo de pagamento: ${user.val().metodo}\nValor que irá receber: ${adm}\n\n**:man_mage: Informações da Ares Team:**\nComissão concluída com sucesso.\n\nValor recebido para Ares Team: ${ares}\n\nReaja ao **emoji** abaixo se o pagamento foi efetuado!`,
                                                color: '#4895EF'
                                            }

                                            var msg6 = await message.guild.channels.cache.get('809824224562380820').send({ embed: embed })
                                            msg6.react('👍')

                                            var rfiltro = (r, u) => r.message.guild.members.cache.get(u.id).roles.cache.has("782062081456865298")

                                            collector = msg6.createReactionCollector(rfiltro, { max: 1 })
                                            collector.on('collect', async (r, u) => {

                                                const snap = await database.ref(`Perfils/${membro.id}`).once('value')
                                                msg6.delete()

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${adm}\nMétodo de pagamento: ${snap.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                var embed = {
                                                    title: ':man_astronaut: Comissão concluida!',
                                                    description: `Veja abaixo informações dessa comissão:\n\nAvaliação da administração: ${message.author} - 5️⃣\n\nAvaliação do(a) criador(a) do produto: ${membro} - 5️⃣\n\nValor total da comissão: ${msg5.content}`,
                                                    color: '#4895EF'
                                                }

                                                message.guild.channels.cache.get('810225615998550016').send({ embed: embed })
                                                
                                                var embed = {
                                                    title: ':man_astronaut: Pagamento efetuado com sucesso!',
                                                    description: `Essa comissão já foi paga com sucesso.\n\n:shopping_cart: **Informações adicionais:**\n\nUsuário(a): ${membro}\n\nE-mail: ${snap.val().email}`,
                                                    color: 'GREEN'
                                                }
                                                
                                                r.message.channel.send({ embed: embed })

                                                var embed = {
                                                    title: ':man_astronaut: Você acaba de receber um pagamento!',
                                                    description: `Você recebeu um pagamento. Veja algumas informações abaixo:\n\n:shopping_cart: Comissão de ${client.username}:\n\nValor recebido: ${freelancer}\nMétodo de pagamento: ${user.val().metodo}`,
                                                    color: '#4895EF'
                                                }

                                                membro.send({ embed: embed }).catch(err => { return });

                                            })

                                        })

                                        break;

                                }

                            })

                        })

                        break;

                }

            })

        })

    }
}