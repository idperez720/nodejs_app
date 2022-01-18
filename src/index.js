// init express
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
// almacena datos en la memoria del servidor
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys');

// Autenticación
const passport = require('passport');

// Inicializar
const app = express();
require('./lib/passport');

// Configuración
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));

/// Configuración del motor con handlebars
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs',
    helpers: require('./lib/handlebars')
}));
// Uso del motor
app.set('view engine', '.hbs');

// Middlewares (Funciones que se ejecutan cuando se hace una peticion). Sirve para ver lo que está llegando al servidor
app.use(session({
    secret: 'mysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))
// /// Poder enviar mensajes
app.use(flash());
app.use(morgan('dev'));
/// Es para poder aceptar los datos de los formularios. Datos Sencillos.
app.use(express.urlencoded({extended: false}));
/// Poder recibir json.
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());


// Variables Globales
app.use((req, res, next) => {

    //req: Toma la información del usuario
    //res: Respuesta del servidor
    // next: codigo a ejecutar
    app.locals.success = req.flash('success');
    next();

})

// Rutas (URL del servidor)
app.use(require('./routes'));
app.use(require('./routes/authentication'));

/// A cada ruta que cree le precedera un prefijo links
app.use('/links', require('./routes/links'));


// Archivos Publicos (Codigo que el navegador puede acceder)
/// Carpetas de css, javascript del cliente, etc.
app.use(express.static(path.join(__dirname, 'public')));

// Arranca el servidor
app.listen(app.get('port'), () => {
    console.log('Servidor en puerto:', app.get('port'))
});