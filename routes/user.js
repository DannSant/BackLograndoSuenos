const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();
const User = require('../models/user');
const Associate = require('../models/associate');
const { verificaToken, verificaAdmin } = require('../middlewares/auth')



//=======================
// PETICIONES GET
//=======================
app.get('/user', [verificaToken, verificaAdmin], (req, res) => {

    let id = req.query.id;


    User.findOne({ _id: id })
        .exec((error, usuarios) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                })
            }

            res.json({
                ok: true,
                records: 1,
                data: usuarios
            });


        })
})

app.get('/user/all', [verificaToken, verificaAdmin], (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    User.find({ status: true })
        .skip(desde)
        .limit(limite)
        .exec((error, usuarios) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                })
            }

            User.count({ status: true }, (e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: usuarios
                })
            })

        })
})


//=======================
// PETICIONES POST
//=======================

//Crea un usuario y lo vincula con el associate_id recibido dentro del mismo objeto usuario
app.post('/user', [verificaToken, verificaAdmin], (req, res) => {
    let body = req.body;
    let associateId = body.associate._id
    let usuario = new User({
        name: body.name,
        email: body.email,
        username: body.username,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        associate: associateId
    });

    //Paso 1 guardamos usuario en DB
    usuario.save((error, usuarioDB) => {

        if (error) {
            return res.status(409).json({
                ok: false,
                error,
                errorMsg: "Error al crear usuario"
            })
        }

        //Paso 2, despues de validar que no hay errores, buscamos al asociado recibido
        Associate.findOne({ _id: associateId })
            .exec((errorAssociate, associateDB) => {
                if (errorAssociate) {
                    return res.status(409).json({
                        ok: false,
                        error,
                        errorMsg: "Error al asignar email al afiliado creado"
                    })
                }

                //Paso 3, si no hay errores, actualizamos el email del asociado con el email del usuario recibido y guardamos
                associateDB.email = usuarioDB.email;
                associateDB.save((error2, savedAssociate) => {
                    if (error2) {
                        return res.status(409).json({
                            ok: false,
                            error,
                            errorMsg: "Error al asignar link al usuario creado"
                        })
                    }

                    //Paso 4, si todo esta bien, regresamos al usuario y al afiliado
                    res.json({
                        ok: true,
                        data: usuarioDB,
                        associate: savedAssociate
                    });
                })
            });
    });

});

app.post('/user/delete/:id', [verificaToken, verificaAdmin], function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['status']);

    body.status = false


    User.findByIdAndUpdate(id, body, { new: true }, (error, usuarioDB) => {
        if (error) {
            return res.status(409).json({
                ok: false,
                error
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró al usuario a borrar"
                }
            })
        }

        res.json({
            ok: true,
            data: usuarioDB
        });

    });
});

//=======================
// PETICIONES PUT
//=======================
app.put('/user/:id', [verificaToken], function(req, res) {
    let code = req.params.id;
    let body = {};

    if (req.body.password == '') {
        body = _.pick(req.body, ['name', 'username']);
    } else {
        body = _.pick(req.body, ['name', 'username', 'password']);
        body.password = bcrypt.hashSync(body.password, 10);
    }

    //console.log(body);

    User.findByIdAndUpdate(code, body, { new: true, runValidators: true }, (error, usuarioDB) => {
        if (error) {
            return res.status(409).json({
                ok: false,
                error
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró al usuario a actualizar"
                }
            })
        }

        res.json({
            ok: true,
            data: usuarioDB
        });

    });
});

app.put('/user/changeRol/:id/', [verificaToken, verificaAdmin], function(req, res) {
    let code = req.params.id;
    let body = _.pick(req.body, ['role']);
    //console.log(body);

    User.findByIdAndUpdate(code, body, { new: true, runValidators: true }, (error, usuarioDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró al usuario a actualizar"
                }
            })
        }

        res.json({
            ok: true,
            data: usuarioDB
        });

    });
});

//=======================
// PETICIONES DELETE
//=======================


//=======================
// Exportar rutas
//=======================
module.exports = app;