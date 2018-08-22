const express = require('express');
const app = express();
const { verificaToken, verificaAdmin } = require('../middlewares/auth');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
// default options
//app.use(fileUpload());


/***
 * PETICIONES GET
 */
app.get('/generalfiles/:name', function(req, res) {
    let tipo = req.params.tipo;
    let fileName = req.params.name;

    let pathImagen = path.resolve(__dirname, `../uploads/files/${fileName}`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        res.json({ ok: false, message: "Not found" });
    }
});

/****
 * Peticiones POST
 */
app.post('/generalfiles', function(req, res) {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            error: {
                message: "No se recibio ningun archivo"
            }
        });
    }

    //Validar extensiones
    let archivo = req.files.archivo
    let nombreArchivo = archivo.name;

    borrarArchivo(nombreArchivo)

    archivo.mv(`uploads/files/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                error: err
            });

        res.json({
            ok: true,
            data: nombreArchivo,
            message: "Archivo cargado"
        });


    });;

});

function borrarArchivo(nombre) {

    let pathImagen = path.resolve(__dirname, `../uploads/files/${nombre}`)

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

//=======================
// Exportar rutas
//=======================
module.exports = app;