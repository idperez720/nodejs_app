// Seguridad de las cuentas  
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// importo base de datos
const pool = require('../database');
const helpers = require('./helpers')


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