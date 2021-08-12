const { Player } = require("../models")
const getOrCreateUserByName = async (userName) => {
    try {
        const founderUser =  await Player.findOne({
            name: userName
        })

        if(founderUser) {
            return founderUser
        }

        const createdUser = await Player.create({
            name: userName
        })

        return createdUser
    } catch(e) {
        throw e;
    }
}


module.exports = {
    getOrCreateUserByName
}
