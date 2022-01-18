// Tendra las rutas relacionadas al login y autenticación
const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/signup', (req, res) =>{
    res.render('auth/signup')
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

router.get('/profile', (req, res) =>{
    res.send('Loggeado')
})

module.exports = router;