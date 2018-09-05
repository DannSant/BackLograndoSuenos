const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();
const Position = require('../models/position')
const { verificaToken, verificaAdmin } = require('../middlewares/auth')


//=======================
// PETICIONES GET
//=======================

//regresa los asociados que tengan nuevas posiciones (que no tengan email)
app.get('/position/new', [verificaToken, verificaAdmin], (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 20;
    limite = Number(limite);

    Position.find({ email: null })
        .skip(desde)
        .limit(limite)
        .populate({ path: 'associate', populate: { path: 'user' } })
        .exec((error, positions) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    errorCode: 500,
                    error
                })
            }

            Position.count({ email: null }, (e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: positions
                })
            })

        })
});

//regresa una posicion por id
app.get('/position', (req, res) => {

    let id = req.query.id;


    Position.findOne({ _id: id })
        .populate({ path: 'associate', populate: { path: 'user' } })
        .exec((error, position) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    errorCode: 500,
                    error
                })
            }

            res.json({
                ok: true,
                records: 1,
                data: position
            });


        })
});

app.get('/position/all', (req, res) => {

    let id = req.query.id;


    Position.find({ status: true })
        .populate({ path: 'associate', populate: { path: 'user' } })
        .exec((error, positions) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    errorCode: 500,
                    error
                })
            }

            Position.count({ status: true }, (e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: positions
                })
            })


        })
});


//=======================
// PETICIONES PUT
//=======================
app.put('/position/addEmail/:id', (req, res) => {
    let code = req.params.id;
    let body;

    body = _.pick(req.body, ['email']);

    Position.findById(code, (error, position) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                errorCode: 500,
                error
            })
        }

        position.email = body.email;

        position.save((errorSave, savedPosition) => {
            if (errorSave) {
                return res.status(500).json({
                    ok: false,
                    errorCode: 500,
                    error: errorSave
                })
            }

            res.json({
                ok: true,
                data: savedPosition
            });
        })

    })

});

//=======================
// Exportar rutas
//=======================
module.exports = app;