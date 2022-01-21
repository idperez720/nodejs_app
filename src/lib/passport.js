// Seguridad de las cuentas  
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// importo base de datos
const pool = require('../database');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true,

}, async (req, username, password, done)=>{

  console.log(req.body);
  // consulto los usuario que coincida el username
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

  // si obtengo varios solo considero el primero
  if (rows.length > 0) {
    const user = rows[0];
    // Validamos la contraseña
    const validPassword = await helpers.matchPassword(password, user.password);
    
    // manejamos la validación de la contraseña
    if (validPassword){
      done(null, user, req.flash('success', 'Welcome' + user.username));
    } else {
      done(null, false, req.flash('message', 'Contraseña incorrecta'));
    }
  } else {
    return done(null, false, req.flash('message', 'No exite el nombre de usuario'))
  }
}));


passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
  
    const { fullname } = req.body;
    let newUser = {
      fullname,
      username,
      password
    };
    newUser.password = await helpers.encryptPassword(password);
    // Saving in the Database
    const result = await pool.query('INSERT INTO users SET ? ', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
  }));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done)=> {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});