// convierte una fecha a hace cuanto tiempo se creo un objeto: ej: 12-2-2021 y hoy es 13-2-2021, se convierte a hace 1 dia (1 day ago)
const { format } = require('timeago.js');

const helpers = {};

helpers.timeago = (timestamp) =>{
    return format(timestamp);
}

module.exports = helpers;