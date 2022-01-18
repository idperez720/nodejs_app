const helpers = {};

// Encriptar datos
const bcrypt = require('bcryptjs');
helpers.encryptPassword = async (password) => {
    // generamos un patron de cifrado
    const salt = await bcrypt.genSalt(10);

    // ciframos la contraseña basado en el patron de cifrado
    const hash = await bcrypt.hash(password, salt);

    return hash;

};


helpers.matchPassword = async (password, savePassword) => {
    try{
        await bcrypt.compare(password, savePassword);
    } catch(e) {
        console.log(e);
    }
    
};

module.exports = helpers;