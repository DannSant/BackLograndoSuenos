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

    Bank.find({},(error,banks)=>{
      
        bankCatalog = banks;
        State.find({},(error,states)=>{
            stateCatalog=states;            
            var csv = require("fast-csv");
            csv
                .fromPath("db.csv")
                .on("data", async(data)=> {
                let newAssociate = await createAssociate(data);
                //onsole.log(newAssociate)
                })
                .on("end", function() {
                    console.log("done");
                    res.json({ ok: true })
                });
        });
    });

    


});

let createAssociate = async(data) => {


    let name=replaceSpecialChars(data[1],false);
    let payAmmount =data[2];
    let bank=replaceSpecialChars(data[3]);
    let account=replaceSpecialChars(data[4]);
    let clabe=replaceSpecialChars(data[5]);
    let card=replaceSpecialChars(data[6]);

    let dateArray = data[7].split(" ");
    let day = dateArray[0];
    let month = dateArray[1];
    month = month-1;
    let year = dateArray[2];
    let birthDate
    if(day=='' || year>2018){
        birthDate= new Date();
    }else {
        birthDate=new Date(year , month, day); 
    }  

    let curp=replaceSpecialChars(data[8]);
    let rfc=replaceSpecialChars(data[9]);
    let movil=replaceSpecialChars(data[10]);
    let address=replaceSpecialChars(data[11],false);
    let state=replaceSpecialChars(data[12],false);

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

    

    let hasPayment = ((payAmmount || payAmmount>0) ? true : false);



    let associate = new Associate({
        name: name,
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
        hasPayment: hasPayment,
        payAmmount: payAmmount,
        state: stateId,
        paymentDate: null,
        paymentNumber: 0,
        creationDate: new Date()
    });
    let newAssociate;
    try {
        newAssociate = await associate.save();
        console.log("numero",data[0])
        console.log(newAssociate);
    }catch(error){
        console.log("Error al salvar el afiliado" + data[0]);
        console.log(error);
    }finally{
        return (newAssociate)?newAssociate:null;
    }
}

let replaceSpecialChars = (value,replaceSpaces=true)=>{
    if(typeof value !="string"){
        return value;
    }
    value = value.trim();
    if(replaceSpaces){
        value = value.replace(/ /g,"");
    }   
    value = value.replace(/\r?\n|\r/g,"");
    value = value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,"");

    if(value==null || value==undefined || value==''){
        return 'nodata'
    }

    return value;
}

let findBankId = (bankDesc)=>{
    let id;
    for (let bank of bankCatalog){
        if(bank.name.toLowerCase()==bankDesc.toLowerCase()){
            id=bank._id;
            break;
        }
    }
    
    return id?id:"5b758dad89185b24a8685953";
}

let findStateId = (stateDesc)=>{
    let id;
    for (let state of stateCatalog){
        if(state.name.toLowerCase()==stateDesc.toLowerCase()){
            id=state._id;
            break;
        }
    }
    return id?id:"5b7711b1a3e1b480a1b17083";
}

//=======================
// Exportar rutas
//=======================
module.exports = app;