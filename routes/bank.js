const express = require('express');
const _ = require('underscore');
const app = express();
const Bank = require('../models/bank')
const { verificaToken, verificaAdmin } = require('../middlewares/auth')

//=======================
// PETICIONES GET
//=======================
app.get('/bank', verificaToken, (req, res) => {

    let id = req.query.id;


    Bank.findOne({ _id: id })
        .exec((error, bank) => {
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
                data: bank
            });


        });
})

app.get('/bank/all', (req, res) => {

    Bank.find({ status: true })
        .exec((error, banks) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    errorCode: 500,
                    error
                });
            }

            Bank.count({ status: true }, (e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: banks
                });
            });

        });
});

//=======================
// PETICIONES POST
//=======================
app.post('/bank', (req, res) => {
    let body = req.body;

    let bank = new Bank({
        name: body.name,
        digits: body.digits,

    });

    bank.save((error, bankDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                errorCode: 500,
                error
            });
        }
        //usuarioDB.password = null;

        res.json({
            ok: true,
            data: bankDB
        });

    });

});

app.post('/bank/delete/:id', function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['status']);

    body.status = false


    Bank.findByIdAndUpdate(id, body, { new: true }, (error, bankDB) => {
        if (error) {
            return res.status(409).json({
                ok: false,
                errorCode: 500,
                error
            })
        }

        if (!bankDB) {
            return res.status(400).json({
                ok: false,
                errorCode: 400,
                error: {
                    message: "No se encontró el banco a borrar"
                }
            })
        }

        res.json({
            ok: true,
            data: bankDB
        });

    });
});


//=======================
// PETICIONES PUT
//=======================
app.put('/bank/:id', function(req, res) {
    let code = req.params.id;
    let body = _.pick(req.body, ['name', 'digits']);
    //console.log(req.body);

    Bank.findByIdAndUpdate(code, body, { new: true, runValidators: true }, (error, bankDB) => {
        if (error) {
            return res.status(409).json({
                ok: false,
                errorCode: 500,
                error
            })
        }

        if (!bankDB) {
            return res.status(400).json({
                ok: false,
                errorCode: 400,
                error: {
                    message: "No se encontró el banco a actualizar"
                }
            })
        }

        res.json({
            ok: true,
            data: bankDB
        });

    });
});


//=======================
// Exportar rutas
//=======================
module.exports = app;