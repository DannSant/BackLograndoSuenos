const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const _ = require('underscore');
const app = express();
const Usuario = require('../models/user')
const { verificaToken, verificaAdmin } = require('../middlewares/auth')



app.post('/login', (req, res) => {

    let body = req.body;


    
    Usuario.findOne({ email: body.email }, (error, usuarioDB) => {
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
                    message: "No se encontró al usuario"
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Contraseña incorrecta"
                }
            })
        }
        usuarioDB.password = "."
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            data: usuarioDB,
            token
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