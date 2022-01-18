// tendra las rutas que guarden los 
const express = require('express');
const router = express.Router();

const pool = require('../database');


router.get('/add', (req, res) =>{
    res.render('links/add');
})

router.post('/add', async(req, res) =>{
    // obtengo los datos del formulario
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    // agrego los datos a la base de datos
    await pool.query('INSERT INTO links set ?', [newLink]);
    // mensaje
    req.flash('success', 'Enlace agregado correctamente');
    res.redirect('/links')
})


// Devuelve todos los datos de la tabla links
router.get('/', async(req, res) =>{
    const links = await pool.query('SELECT * FROM links');
    res.render('links/list', { links });
});

// Eliminar un link
router.get('/delete/:id', async(req, res) =>{
    //Obtengo el id del link a eliminar
    const { id } = req.params;

    // hago la consulta para eliminarlo
    await pool.query('DELETE FROM links WHERE ID = ?', id);
    // mensaje
    req.flash('success', 'Enlace eliminado correctamente');
    res.redirect('/links');
});


// abre el formulario de edicion
router.get('/edit/:id', async (req, res) => {
    //Obtengo el id del link a editar
    const { id } = req.params;

    // consulto el elemento a editar
    const links = await pool.query('SELECT * FROM links WHERE id = ?', id)

    res.render("links/edit", {links: links[0]})
})

// Editar la base de datos
router.post('/edit/:id', async (req, res) => {
    //Obtengo el id del link a editar
    const { id } = req.params;

    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };

    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    // mensaje
    req.flash('success', 'Enlace actualizado correctamente');
    res.redirect('/links')
});

module.exports = router;