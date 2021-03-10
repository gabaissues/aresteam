module.exports = async (client) => {

    client.on('error', async (error) => {

        var embed = {
            description: error
        }

        client.users.cache.get('414984935489667072').send({ embed: embed })

    })

}