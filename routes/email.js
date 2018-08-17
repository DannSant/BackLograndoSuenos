'use strict';
const nodemailer = require('nodemailer');
const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();
const User = require('../models/user');
const Associate = require('../models/associate');
const { verificaToken, verificaAdmin } = require('../middlewares/auth')


//=======================
// PETICIONES POST
//=======================
app.post('/email/welcome', (req, res) => {
    let body = req.body;

    let userEmail = body.userEmail;
    if (!userEmail) {
        return res.status(409).json({
            ok: false,
            error,
            errorMsg: "Falta el campo de userEmail"
        })
    }

    let personalEmail = body.personalEmail;
    if (!personalEmail) {
        return res.status(409).json({
            ok: false,
            error,
            errorMsg: "Falta el campo de personalEmail"
        })
    }

    let userName = body.userName;
    if (!userName) {
        return res.status(409).json({
            ok: false,
            error,
            errorMsg: "Falta el campo de userName"
        })
    }

    let userUserName = body.userUserName;
    if (!userUserName) {
        return res.status(409).json({
            ok: false,
            error,
            errorMsg: "Falta el campo de userUserName"
        })
    }
    let userPassword = body.userPassword;
    if (!userPassword) {
        return res.status(409).json({
            ok: false,
            error,
            errorMsg: "Falta el campo de userPassword"
        })
    }

    let adminEmail = "pruebas@lograndosuenos7.com";
    let adminPassword = "Mmadlajca1*";

    let subject = `Bienvenido ${userName} a Logrando Sueños 7 🤗`
    let htmlBody = createHtmlBody(userEmail, userName, userUserName, userPassword);


    let account = { user: adminEmail, pass: adminPassword }
        // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'servidor3398.tl.controladordns.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Staff LograndoSueños7" <pruebas@lograndosuenos7.com>', // sender address
        to: personalEmail, // list of receivers
        subject: subject, // Subject line
        text: 'Hello world?', // plain text body
        html: htmlBody // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.json({
            ok: true,
            data: info
        });

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });

});

//=======================
// Exportar rutas
//=======================
module.exports = app;



//=========================
//Funciones
//==========================
function createHtmlBody(userEmail, userName, userUserName, userPassword) {
    let htmlbody = `
    <h1>Hola ${userName} ! </h1>
    
    <p>Este correo es para notificarte que tu registro en Logrando Sueños 7 ha sido completado</p>
    <p>Puedes dirigirte al sitio http://lograndosuenos7.com/home e iniciar sesion con los siguientes datos</p>

    <table>
        <tr>
            <td>Email:</td>
            <td>${userEmail}</td>
        </tr>
        <tr>
            <td>Usuario:</td>
            <td>${userUserName}</td>
        </tr>
        <tr>
            <td>Contraseña:</td>
            <td>${userPassword}</td>
        </tr>
    </table>

    <p>No olvides tambien descargar la aplicacion de Thunderbird en http://pajaritodetrueno.com </p>

    Gracias!!
    `;

    return htmlbody;
}