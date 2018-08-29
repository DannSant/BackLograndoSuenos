const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();
const Associate = require('../models/associate')
const User = require('../models/user')
const Position = require('../models/position')
const { verificaToken, verificaAdmin } = require('../middlewares/auth')




//=======================
// PETICIONES POST
//=======================

//Este metodo genera un afiliado, con el id de ese afiliado crea una nueva posicion en la matriz,
//luego, usando el numero otorgado por la posicion, se genera el username para crear el usuario
app.post('/register', (req, res) => {
    let body = req.body;

    let sentAssociate = body.associate;
    let sentPosition = body.position;
    let sentUser = body.position

    //PASO 1 - Generamos objeto del afiliado   
    let bank = sentAssociate.bank._id == "0" ? null : sentAssociate.bank;
    let state = sentAssociate.state._id == "0" ? null : sentAssociate.state;

    let associate = new Associate({        
        personalEmail: sentAssociate.personalEmail,
        cellphone: sentAssociate.cellphone,
        bank: bank,
        account: sentAssociate.account,
        clabe: sentAssociate.clabe,
        card: sentAssociate.card,
        curp: sentAssociate.curp,
        rfc: sentAssociate.rfc,
        address: sentAssociate.address,
        birthDate: sentAssociate.birthDate,       
        state: state,        
        creationDate: new Date()
    });

    //PASO 2 - Guardamos el objeto en la BD
    associate.save((error, associateDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                errorCode: 500,
                error,
                msg: "Error al crear el afiliado"
            })
        }

       

        let position = new Position({
            associate:associateDB._id,
            payAmmount: sentPosition.payAmmount,
            paymentDate: sentPosition.paymentDate,
            paymentNumber: sentPosition.paymentNumber
        });

         //PASO 4 - Guardamos la posicion en la base de datos
        position.save( (errorPosition, positionDB)=>{

            if (errorPosition) {
                return res.status(500).json({
                    ok: false,
                    errorCode: 500,
                    error:errorPosition,
                    msg: "Error al crear la posicion"
                })
            }

            //PASO 5 - Si no hay error generamos el objeto de usuario, usando los datos de la posicion y afiliado
            let username = sentUser.name.substring(0, 1).toUpperCase() + sentUser.lastname.substring(0, 1).toUpperCase() + positionDB.position_number + body.cellphone.substring(sentAssociate.cellphone.length - 2, sentAssociate.cellphone.length);
            let user = new User({
                name: sentUser.name,
                lastname: sentUser.lastname,
                username: username,
                password: "lograndosuenos7"
            });

            
            //PASO 6 - Guardamos el objeto usuario de en la BD
            user.save((errorUSer, userDB) => {
                if (errorUSer) {
                    return res.status(500).json({
                        ok: false,
                        errorCode: 500,
                        error: errorUSer,
                        msg: "Error al crear el usuario"
                    })
                }

                //PASO 7 - Si todo sale bien ligamos el id del usuario con el afiliado recien creado
                associateDB.user = userDB._id;

                //PASO 8 - Guardamos el cambio mencionado en el paso 5 en la BD
                associateDB.save((errorLink, associateLinked) => {
                    if (errorLink) {
                        return res.status(500).json({
                            ok: false,
                            errorCode: 500,
                            error: errorLink,
                            msg: "Error al ligar el usuario y afiliado"
                        })
                    }

                    //Si todo sale bien, regresamos la respuesta
                    res.json({
                        ok: true,
                        data: {
                            associate: associateLinked,
                            user: userDB,
                            position: positionDB
                        }
                    })
                })
            })
        });
        
        

    

    });

});