const express = require('express');
const fs = require("fast-csv")
const _ = require('underscore');
const app = express();
const Associate = require('../models/associate');
const Bank = require('../models/bank');
const State = require('../models/state')


let bankCatalog;
let stateCatalog;

/*******************
 * Peticiones POST
 */
app.post('/loadData', async(req, res) => {

    Bank.find({}, (error, banks) => {

        bankCatalog = banks;
        State.find({}, (error, states) => {
            stateCatalog = states;
            var csv = require("fast-csv");
            csv
                .fromPath("db.csv")
                .on("data", async(data) => {
                    let newAssociate = await createAssociate(data);
                    let newPosition = await createPosition(data, newAssociate._id);
                    let newUser = await createUser(data)
                    let associateWithUser = await linkAssociateUser(newAssociate, newUser._id);
                })
                .on("end", function() {
                    console.log("done");
                    res.json({ ok: true })
                });
        });
    });




});

let createAssociate = async(data) => {
    let bank = replaceSpecialChars(data[3]);
    let account = replaceSpecialChars(data[4]);
    let clabe = replaceSpecialChars(data[5]);
    let card = replaceSpecialChars(data[6]);

    let dateArray = data[7].split(" ");
    let day = dateArray[0];
    let month = dateArray[1];
    month = month - 1;
    let year = dateArray[2];
    let birthDate
    if (day == '' || year > 2018) {
        birthDate = new Date();
    } else {
        birthDate = new Date(year, month, day);
    }

    let curp = replaceSpecialChars(data[8]);
    let rfc = replaceSpecialChars(data[9]);
    let movil = replaceSpecialChars(data[10]);
    let address = replaceSpecialChars(data[11], false);
    let state = replaceSpecialChars(data[12], false);

    let bankId = findBankId(bank);
    let stateId = findStateId(state)



    // console.log("numero",data[0])
    // console.log("name",name)
    // console.log("payAmount",payAmmount)
    // console.log("bankName",bank)
    // console.log("account",account)
    // console.log("clabe",clabe)
    // console.log("card",card)
    // console.log("birthDate",birthDate)
    // console.log("curp",curp)
    // console.log("rfc",rfc)
    // console.log("movil",movil)
    // console.log(" ")

    //return "nuevo!" + data[0]; 



    let associate = new Associate({
        personalEmail: 'sinemail@sinemail.com',
        cellphone: movil,
        bank: bankId,
        account: account,
        clabe: clabe,
        card: card,
        curp: curp,
        rfc: rfc,
        address: address,
        birthDate: birthDate,
        payAmmount: payAmmount,
        state: stateId
    });
    let newAssociate;
    try {
        newAssociate = await associate.save();
        if (!newAssociate) {
            console.log(associate);
        }
    } catch (error) {
        console.log("Error al salvar el afiliado" + data[0]);
        console.log(error);
    } finally {
        return (newAssociate) ? newAssociate : null;
    }
}

let createPosition = async(data, associateId) => {
    let position = new Position({
        associate: associateId,
        payAmmount: 100,
        hasPayment: true,
        paymentDate: new Date(),
        paymentNumber: 0,
        isFirst: true
    });
    let newPosition;
    try {
        newPosition = await position.save();
        if (!newPosition) {
            console.log(newPosition);
        }
    } catch (error) {
        console.log("Error al salvar la posicion" + data[0]);
        console.log(error);
    } finally {
        return (newPosition) ? newPosition : null;
    }
}

let createUser = async(data, positionNumber, cellphone) => {
    let name = replaceSpecialChars(data[1], false);
    let lastname = replaceSpecialChars(data[2], false);
    let username = name.substring(0, 1).toUpperCase() + lastname.substring(0, 1).toUpperCase() + positionNumber + cellphone.substring(cellphone.length - 2, cellphone.length);
    let user = new User({
        name: sentUser.name,
        lastname: sentUser.lastname,
        username: username,
        password: bcrypt.hashSync("lograndosuenos7", 10),
    });
    let newUser;
    try {
        newUser = await user.save();
        if (!newUser) {
            console.log(newUser);
        }
    } catch (error) {
        console.log("Error al salvar el usuario" + data[0]);
        console.log(error);
    } finally {
        return (newUser) ? newUser : null;
    }
}

let linkAssociateUser = async(associate, userId) => {
    associate.user = userId
    let newAssociate;
    try {
        newAssociate = await associate.save();
        if (!newAssociate) {
            console.log(associate);
        }
    } catch (error) {
        console.log("Error al salvar el afiliado" + data[0]);
        console.log(error);
    } finally {
        return (newAssociate) ? newAssociate : null;
    }
}

let replaceSpecialChars = (value, replaceSpaces = true) => {
    if (typeof value != "string") {
        return value;
    }
    value = value.trim();
    if (replaceSpaces) {
        value = value.replace(/ /g, "");
    }
    value = value.replace(/\r?\n|\r/g, "");
    value = value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");

    if (value == null || value == undefined || value == '') {
        return 'nodata'
    }

    return value;
}

let findBankId = (bankDesc) => {
    let id;
    for (let bank of bankCatalog) {
        if (bank.name.toLowerCase() == bankDesc.toLowerCase()) {
            id = bank._id;
            break;
        }
    }

    return id ? id : "5b5946f504fec32c0cc356e9";
}

let findStateId = (stateDesc) => {
    let id;
    for (let state of stateCatalog) {
        if (state.name.toLowerCase() == stateDesc.toLowerCase()) {
            id = state._id;
            break;
        }
    }
    return id ? id : "5b779b882b34906d404d21cc";
}

app.get('/getMissingData', (req, res) => {
    let arreglo = [];
    for (let i = 0; i < 150; i++) {
        arreglo.push(i + 1);
    }

    let missing = [];
    Associate.find({})
        .sort({ id: 1 })
        .exec((error, associates) => {
            let index = 0;
            for (let associate of associates) {
                console.log(associate.id + "--" + arreglo[index]);
                if (associate.id != arreglo[index]) {
                    missing.push(arreglo[index]);
                }
                index++;
            }
            res.json({ ok: true, data: missing })
        })
});

//=======================
// Exportar rutas
//=======================
module.exports = app;