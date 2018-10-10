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

    Position.find({ email: null, status: true })
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

//Regresa las posiciones del afiliado enviado
app.get('/position/mine', [verificaToken], (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let associateId = req.query.associateId;


    Position.find({ associate: associateId })
        .skip(desde)
        .populate({ path: 'associate', populate: { path: 'user' } })
        .exec((error, positions) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    errorCode: 500,
                    error
                })
            }

            Position.count({ associate: associateId }, (e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: positions
                })
            })

        })
});


//Regresa la primera posicion del afiliado
app.get('/position/first', [verificaToken], (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let associateId = req.query.associateId;


    Position.findOne({ associate: associateId, isFirst: true })
        .skip(desde)
        .populate({ path: 'associate', populate: { path: 'user' } })
        .exec((error, positions) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    errorCode: 500,
                    error
                })
            }

            Position.count({ associate: associateId, isFirst: true }, (e, conteo) => {
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
        .populate({ path: 'associate', populate: { path: 'user bank state userReference' } })
        .sort({ position_number: 1 })
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
// PETICIONES POST
//=======================
app.post('/position/add/:id', (req, res) => {
    let associateId = req.params.id;

    let body = req.body;

    let position = new Position({
        associate: associateId,
        payAmmount: body.payAmmount,
        paymentDate: body.paymentDate,
        paymentNumber: body.paymentNumber,
        isFirst: false
    });

    position.save((error, savedPosition) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                errorCode: 500,
                error
            })
        }
        res.json({
            ok: true,
            data: savedPosition
        });

    })
});

app.post('/position/resetId', (req, res) => {
    //let Associate = connection.model('Book', bookSchema),
    position = new Position();

    position.save(function(err) {

        // book._id === 100 -> true

        position.nextCount(function(err, count) {

            // count === 101 -> true

            position.resetCount(function(err, nextCount) {

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
app.put('/position/addEmail/:id', (req, res) => {
    let code = req.params.id;
    let body;

    body = _.pick(req.body, ['email', 'external_username', 'external_password']);

    Position.findById(code, (error, position) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                errorCode: 500,
                error
            })
        }

        position.email = body.email;
        position.external_username = body.external_username;
        position.external_password = body.external_password;

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