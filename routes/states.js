const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();
const User = require('../models/user')
const { verificaToken, verificaAdmin } = require('../middlewares/auth');

const STATES = [
    { code: "01", name: "Aguascalientes" },
    { code: "02", name: "Baja California" },
    { code: "03", name: "Baja California Sur" },
    { code: "04", name: "Campeche" },
    { code: "05", name: "Chihuahua" },
    { code: "06", name: "Chiapas" },
    { code: "07", name: "Coahuila" },
    { code: "08", name: "Colima" },
    { code: "09", name: "Durango" },
    { code: "10", name: "Guanajuato" },
    { code: "11", name: "Guerrero" },
    { code: "12", name: "Hidalgo" },
    { code: "13", name: "Jalisco" },
    { code: "14", name: "México" },
    { code: "15", name: "Michoacán" },
    { code: "16", name: "Morelos" },
    { code: "17", name: "Nayarit" },
    { code: "18", name: "Nuevo Leon" },
    { code: "19", name: "Oaxaca" },
    { code: "20", name: "Puebla" },
    { code: "21", name: "Querétaro" },
    { code: "22", name: "Quintana Roo" },
    { code: "23", name: "San Luis Potosí" },
    { code: "24", name: "Sinaloa" },
    { code: "25", name: "Sonora" },
    { code: "26", name: "Tabasco" },
    { code: "27", name: "Tamaulipas" },
    { code: "28", name: "Tlaxcala" },
    { code: "29", name: "Veracruz" },
    { code: "30", name: "Yucatán" },
    { code: "31", name: "Zacatecas" }
];


/*******************
 * Peticiones GET
 */
app.get('/states/all', (req, res) => {
    res.json({
        ok: true,
        data: STATES
    })
});

//=======================
// Exportar rutas
//=======================
module.exports = app;