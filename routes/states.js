const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();
const State = require('../models/state')
const { verificaToken, verificaAdmin } = require('../middlewares/auth');

/*******************
 * Peticiones GET
 */
app.get('/states/all', (req, res) => {

    State.find({ status: true })
    .exec((error, states) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                errorCode: 500,
                error
            });
        }

        State.count({ status: true }, (e, conteo) => {
            res.json({
                ok: true,
                records: conteo,
                data: states
            });
        });

    });
    
});

//=======================
// Exportar rutas
//=======================
module.exports = app;