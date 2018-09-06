const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const _ = require('underscore');
const app = express();
const Usuario = require('../models/user')
const Associate = require('../models/associate')
const { verificaToken, verificaAdmin } = require('../middlewares/auth')



app.post('/login', (req, res) => {

    let body = req.body;



    Usuario.findOne({ username: body.username }, (error, usuarioDB) => {
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
                    message: "Usuario o Contraseña incorrectos"
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Usuario o Contraseña incorrectos"
                }
            })
        }
        usuarioDB.password = "."
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        Associate.findOne({ user: usuarioDB._id })
            .exec((errorAssociate, associate) => {
                if (errorAssociate) {
                    return res.status(500).json({
                        ok: false,
                        error
                    })
                }
                console.log(usuarioDB.role);
                if (!associate && usuarioDB.role != "ADMIN_ROLE") {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: "El afiliado aun no está registrado"
                        }
                    })
                }
                res.json({
                    ok: true,
                    data: { user: usuarioDB, associate: associate },
                    token
                })
            })




    });
});

app.post('/validateToken', verificaToken, (req, res) => {
    let user = req.usuario;
    let token = jwt.sign({
        usuario: user
    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
    res.json({
        ok: true,
        data: user,
        token
    })
});

module.exports = app;