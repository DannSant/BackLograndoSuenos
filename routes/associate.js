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
//Este metodo va a crear un afiliado, y despues crea un usuario usando el numero de registro(id) que
//va a refresar el afiliado, luego el afiliado será ligado al usuario mediante el campo de user
app.post('/associate/register', (req, res) => {
    let body = req.body;

    let hasPayment = ((body.payAmmount) ? true : false);
    //PASO 1 - Generamos objeto del afiliado
    let associate = new Associate({
        name: body.name,
        lastname: body.lastname,
        personalEmail: body.personalEmail,
        cellphone: body.cellphone,
        bank: body.bank,
        account: body.account,
        clabe: body.clabe,
        card: body.card,
        curp: body.curp,
        rfc: body.rfc,
        address: body.address,
        birthDate: body.birthDate,
        hasPayment: hasPayment,
        payAmmount: body.payAmmount,
        state: body.state,
        paymentDate: body.paymentDate,
        paymentNumber: body.paymentNumber,
        creationDate: new Date()
    });

    //PASO 2 - Guardamos el objeto en la BD
    associate.save((error, associateDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                errorCode: 500,
                error,
                msg:"Error al crear el afiliado"
            })
        }
       
        //PASO 3 - Si todo sale bien, generamos el objeto del Usuario
        let username = body.name.substring(0,1).toUpperCase() + body.lastname.substring(0,1).toUpperCase() + associateDB.id + body.cellphone.substring(body.cellphone.length - 1,1);
        let user = new User({
            name:body.name,
            lastname:body.lastname,
            username:username,
            password:"lograndosuenos7"
        })

        //PASO 4 - Guardamos el objeto en la BD
        user.save((errorUSer,userDB)=>{
            if (errorUSer) {
                return res.status(500).json({
                    ok: false,
                    errorCode: 500,
                    error,
                    msg:"Error al crear el usuario"
                })
            }

            //PASO 5 - Si todo sale bien ligamos el id del usuario con el afiliado recien creado
            associateDB.user = userDB._id;

            //PASO 6 - Guardamos el cambio mencionado en el paso 5 en la BD
            associateDB.save((errorLink,associateLinked)=>{
                if (errorLink) {
                    return res.status(500).json({
                        ok: false,
                        errorCode: 500,
                        error,
                        msg:"Error al ligar el usuario y afiliado"
                    })
                }    
                
                //Si todo sale bien, regresamos la respuesta
                res.json({
                    ok: true,
                    data: {
                        associate: associateLinked,
                        user: userDB
                    }
                })
            })
        })
    });

});

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
app.put('/associate/:id', [verificaToken, verificaAdmin], function(req, res) {
    let code = req.params.id;
    let body = _.pick(req.body, ['name', 'personalEmail', 'cellphone', 'bank', 'account', 'clabe', 'card', 'curp', 'rfc', 'address', 'birthDate', 'hasPayment', 'payAmmount']);
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