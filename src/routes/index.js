const express = require('express');
const router = express.Router();

//Defino ruta inicial
router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;