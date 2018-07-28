const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();
const Associate = require('../models/associate')
const { verificaToken, verificaAdmin } = require('../middlewares/auth')

//=======================
// PETICIONES GET
//=======================
app.get('/associate', verificaToken, (req, res) => {

    let id = req.query.id;


    Associate.findOne({ _id: id })
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
})

app.get('/associate/all', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 99;
    limite = Number(limite);

    Associate.find({ status: true })
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
app.post('/associate', (req, res) => {
    let body = req.body;

    let associate = new Associate({
        name: body.name,
        email: body.email,
        cellphone: body.cellphone,
        bank: body.bank,
        account: body.account,
        clabe: body.clabe,
        card: body.card,
        curp: body.curp,
        rfc: body.rfc,
        address: body.address,
        birthDate: body.birthDate,
        hasPayment: body.hasPayment,
        payAmmount: body.payAmmount,
        state: body.state,
        creationDate: new Date()
    });

    associate.save((error, associateDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                errorCode: 500,
                error
            })
        }
        //usuarioDB.password = null;

        res.json({
            ok: true,
            data: associateDB
        })

    });

});

app.post('/associate/delete/:id', function(req, res) {
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
app.put('/associate/:id', function(req, res) {
    let code = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'cellphone', 'bank', 'account', 'clabe', 'card', 'curp', 'rfc', 'address', 'birthDate', 'hasPayment', 'payAmmount']);
    //console.log(req.body);

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