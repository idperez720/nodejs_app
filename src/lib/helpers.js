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
        return await bcrypt.compare(password, savePassword);
    } catch(e) {
        console.log(e);
    }
    
};

// comprobar si hay un usuario loggeado
helpers.isLoggedIn = (req, res, next) =>{
    // si el usuario está loggeado lo redirige a links    
    if (req.isAuthenticated()){
        return next();

    }
    // en caso contrario, lo redirige a loggearse
    req.flash('message', 'Debes loggearte primero')
    return res.redirect('/signin')
};

helpers.isNotLoggedIn = (req, res, next) => {
    // si el usuario está loggeado lo redirige al perfil
    if (!req.isAuthenticated()){
        return next();
    }
    return res.redirect('/profile')
};

module.exports = helpers;