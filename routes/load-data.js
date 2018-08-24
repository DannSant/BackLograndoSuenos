const express = require('express');
const fs = require("fast-csv")
const _ = require('underscore');
const app = express();
const Associate = require('../models/associate')


/*******************
 * Peticiones POST
 */
app.post('/loadData', async(req, res) => {

    var csv = require("fast-csv");

    csv
        .fromPath("db.csv")
        .on("data", function(data) {
            console.log(data[1]);
        })
        .on("end", function() {
            console.log("done");
            res.json({ ok: true })
        });


});

let createAssociate = async(data) => {
    let body = req.body;

    let hasPayment = ((body.payAmmount) ? true : false);



    let associate = new Associate({
        name: body.name,
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

    let newAssociate = await associate.save();

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
}

//=======================
// Exportar rutas
//=======================
module.exports = app;