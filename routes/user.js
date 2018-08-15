const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();
const User = require('../models/user')
const { verificaToken, verificaAdmin } = require('../middlewares/auth')



//=======================
// PETICIONES GET
//=======================
app.get('/user', [verificaToken,verificaAdmin], (req, res) => {

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

app.get('/user/all', [verificaToken,verificaAdmin], (req, res) => {

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
app.post('/user', [verificaToken,verificaAdmin], (req, res) => {
    let body = req.body;
     
    let usuario = new User({
        name: body.name,
        email: body.email,
        username: body.username,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        associateLink: null
    });

    usuario.save((error, usuarioDB) => {

        if (error) {
            return res.status(409).json({
                ok: false,
                error,
                errorMsg:"Error al crear usuario"
            })
        }
        //usuarioDB.password = null;

        let id = usuarioDB._id;
        let associateLink = process.env.ASSOCIATE_LINK + "/" + id;

        usuarioDB.associateLink=associateLink;

        usuarioDB.save((error2,usuarioConLink)=>{
            if(error2){
                return res.status(409).json({
                    ok: false,
                    error,
                    errorMsg:"Error al asignar link al usuario creado"
                })
            }
            res.json({
                ok: true,
                data: usuarioConLink
            });
        })


        

    });

})

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