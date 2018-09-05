const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();
const Associate = require('../models/associate')
const User = require('../models/user')
const { verificaToken, verificaAdmin } = require('../middlewares/auth')

//=======================
// PETICIONES GET
//=======================
//regresa un asociado por id
app.get('/associate', (req, res) => {

    let id = req.query.id;


    Associate.findOne({ _id: id })
        .populate('bank')
        .populate('state')
        .populate('user')
        .exec((error, associate) => {
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
                data: associate
            });


        })
});

//regresa todos los asociados activos
app.get('/associate/all', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 99;
    limite = Number(limite);

    Associate.find({ status: true })
        .skip(desde)
        .limit(limite)
        .populate('bank')
        .populate('state')
        .populate('user')
        .exec((error, associates) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    errorCode: 500,
                    error
                })
            }

            Associate.count({ status: true }, (e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: associates
                })
            })

        })
});

//regresa los asociados nuevos (que no tengan email)
app.get('/associate/new', [verificaToken, verificaAdmin], (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 20;
    limite = Number(limite);

    Associate.find({ email: null })
        .skip(desde)
        .limit(limite)
        .exec((error, associates) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    errorCode: 500,
                    error
                })
            }

            Associate.count({ status: true }, (e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: associates
                })
            })

        })
});

//=======================
// PETICIONES POST
//=======================


app.post('/associate/delete/:id', [verificaToken, verificaAdmin], function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['status']);

    body.status = false


    Associate.findByIdAndUpdate(id, body, { new: true }, (error, associateDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                errorCode: 500,
                error
            })
        }

        if (!associateDB) {
            return res.status(400).json({
                ok: false,
                errorCode: 400,
                error: {
                    message: "No se encontró al afiliado a borrar"
                }
            })
        }

        res.json({
            ok: true,
            data: associateDB
        });

    });
});

app.post('/associate/resetId', (req, res) => {
    //let Associate = connection.model('Book', bookSchema),
    associate = new Associate();

    associate.save(function(err) {

        // book._id === 100 -> true

        associate.nextCount(function(err, count) {

            // count === 101 -> true

            associate.resetCount(function(err, nextCount) {

                // nextCount === 100 -> true

                res.json({
                    ok: true,
                    nextCount: nextCount,
                    count: count
                });

            });

        });

    });
})


//=======================
// PETICIONES PUT
//=======================
app.put('/associate/:id', [verificaToken], function(req, res) {
    let code = req.params.id;
    let body = _.pick(req.body, ['personalEmail', 'cellphone', 'bank', 'account', 'clabe', 'card', 'curp', 'rfc', 'address', 'state', 'birthDate']);
    //console.log(req.body);



    let bank = body.bank._id == "0" ? null : body.bank;
    let state = body.state._id == "0" ? null : body.state;

    body.bank = bank
    body.state = state

    Associate.findByIdAndUpdate(code, body, { new: true, runValidators: true }, (error, associateDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                errorCode: 500,
                error
            })
        }

        if (!associateDB) {
            return res.status(400).json({
                ok: false,
                errorCode: 400,
                error: {
                    message: "No se encontró al afiliado a actualizar"
                }
            })
        }

        res.json({
            ok: true,
            data: associateDB
        });

    });
});


//=======================
// Exportar rutas
//=======================
module.exports = app;