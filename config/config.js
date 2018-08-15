//===============
// ENTORNO
//==============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//=========================
//PUERTO BACKEND
//=======================
process.env.PORT = process.env.PORT || 3000;

//=============================
//Link para afiliados
//============================
if(process.env.NODE_ENV=="dev"){
    process.env.ASSOCIATE_LINK="http://localhost:4200/register"
}else {
    process.env.ASSOCIATE_LINK="http://lograndosuenos7/register"
}


//===============
// JWT
//==============
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.SEED = "este-es-el-seed-de-desarrollo";

//===============
// DB
//===============

let urlDB = "";

if (process.env.NODE_ENV == "dev") {
    urlDB = 'mongodb://localhost:27017/lograndoSuenosDB';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;