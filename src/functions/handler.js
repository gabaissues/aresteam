const { readdirSync } = require('fs')

const Handler = (client) => {

        readdirSync("./src/commands/").forEach(pasta => {

            const commands = readdirSync(`./src/commands/${pasta}/`).filter(arq => arq.endsWith(".js"));

            for (let arq of commands) {

                let arquivo = require(`../commands/${pasta}/${arq}`);

                if(arquivo.name) {

                    client.commands.set(arquivo.name, arquivo)
                    console.log(`| ${arquivo.name} / ✅ |`)

                } else {

                    console.log(`| ${arq} / ❎ |`)
                    continue;

                }

                if(arquivo.aliases && Array.isArray(arquivo.aliases)) arquivo.aliases.forEach(x => client.aliases.set(x, arquivo.name))

            }

        })

}

module.exports = { Handler }