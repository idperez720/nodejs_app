const mysql = require('mysql');

const {promisify} = require('util');

const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('SE CERRÓ LA CONEXIÓN CON LA BASE DE DATOS');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.log('LA BASE DE DATOS TIENE MUCHAS CONEXIONES');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('CONEXIÓN CON LA BASES DE DATOS RECHAZADA');
        }

    }

    if (connection) connection.release();
    console.log('LA BD está conectada');
});

pool.query = promisify(pool.query).bind(pool);

module.exports = pool;
