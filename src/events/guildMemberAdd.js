module.exports = async (client) => {

    client.on('guildMemberAdd', async (membro) => {

        if(membro.guild.id == 782061667717742612) {

            membro.roles.add('782073083212726303')

        }

        if(membro.guild.id == 807340980684455996) { //Dev

            membro.roles.add('814583711743344651')

        }

        if(membro.guild.id == 807340735585583135) {//Build

            membro.roles.add('814583653702565898')

        }

        if(membro.guild.id == 807330861274890271) {//Design

            membro.roles.add('814583483694710875')

        }
        
    })

}