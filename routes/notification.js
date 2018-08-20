const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();
const Notification = require('../models/notification')
const { verificaToken, verificaAdmin } = require('../middlewares/auth')

//=======================
// PETICIONES GET
//=======================
//regresa una notificacion por id
app.get('/notification', (req, res) => {

    let id = req.query.id;


    Associate.findOne({ _id: id })
        .exec((error, notification) => {
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
                data: notification
            });


        })
});

//regresa todas las notificaciones de la base de datos
//queryParams: status, user, broadcast
app.get('/notification/all', (req, res) => {

    let filter = {};

    if (req.query.status) {
        filter.status = req.query.status;
    }

    if (req.query.user) {
        filter.user = req.query.user;
    }

    if (req.query.broadcast) {
        filter.broadcast = req.query.broadcast;
    }

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 20;
    limite = Number(limite);

    Notification.find(filter)
        .skip(desde)
        .limit(limite)
        .exec((error, notifications) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    errorCode: 500,
                    error
                })
            }

            Notification.count(filter, (e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: notifications
                })
            })

        })
});

//regresa todas las notificaciones de la base de datos
//queryParams:  user
app.get('/notification/mine', (req, res) => {



    let user = req.query.user;


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 20;
    limite = Number(limite);

    Notification.find({
            $or: [
                { 'user': user },
                { 'broadcast': true }
            ],
            $and: [
                { 'status': true }
            ]
        })
        .skip(desde)
        .limit(limite)
        .exec((error, notifications) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    errorCode: 500,
                    error
                })
            }

            Notification.count({
                $or: [
                    { 'user': user },
                    { 'broadcast': true }
                ],
                $and: [
                    { 'status': true }
                ]
            }, (e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: notifications
                })
            })

        })
});

//buscar noificaciones con el titulo o texto que incluya el termino enviado
//queryParams: searchTerm
app.get('/notification/search', (req, res) => {

    let searchTerm = req.query.searchTerm;

    let regexp = new RegExp(searchTerm, 'i')

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 20;
    limite = Number(limite);

    Notification.find({
            $or: [
                { 'title': regexp },
                { 'text': regexp }
            ]
        })
        .skip(desde)
        .limit(limite)
        .exec((error, notifications) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    errorCode: 500,
                    error
                })
            }

            Notification.count({
                $or: [
                    { 'title': regexp },
                    { 'text': regexp }
                ]
            }, (e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: notifications
                })
            })

        })
});

//=======================
// PETICIONES POST
//=======================
//Genera una notificacion
app.post('/notification', (req, res) => {
    let body = req.body;

    let notification = new Notification({
        title: body.title,
        type: body.type,
        text: body.text,
        userTo: body.userTo,
        broadcast: body.broadcast,
        creationDate: new Date()
    });

    notification.save((error, notificationDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                errorCode: 500,
                error
            })
        }

        res.json({
            ok: true,
            data: notificationDB
        })

    });

});

//Cambia el estatus de una notificacion a false
app.post('/notification/delete/:id', function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['status']);

    body.status = false


    Notification.findByIdAndUpdate(id, body, { new: true }, (error, notificationDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                errorCode: 500,
                error
            })
        }

        if (!notificationDB) {
            return res.status(400).json({
                ok: false,
                errorCode: 400,
                error: {
                    message: "No se encontró la notificacion a borrar"
                }
            })
        }

        res.json({
            ok: true,
            data: notificationDB
        });

    });
});


//=======================
// PETICIONES PUT
//=======================
//modifica una notificion, solamente titulo o texto o usuario o broadcast
app.put('/notification/:id', function(req, res) {
    let code = req.params.id;
    let body = _.pick(req.body, ['title', 'text', 'userTo', 'broadcast']);
    //console.log(req.body);

    Notification.findByIdAndUpdate(code, body, { new: true, runValidators: true }, (error, notificationDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                errorCode: 500,
                error
            })
        }

        if (!notificationDB) {
            return res.status(400).json({
                ok: false,
                errorCode: 400,
                error: {
                    message: "No se encontró la notificacion a actualizar"
                }
            })
        }

        res.json({
            ok: true,
            data: notificationDB
        });

    });
});

//=======================
// Exportar rutas
//=======================
module.exports = app;