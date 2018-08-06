const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();
const Associate = require('../models/associate')
const { verificaToken, verificaAdmin } = require('../middlewares/auth');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
// default options
app.use(fileUpload());


/***
 * PETICIONES GET
 */
app.get('/baucher/:img', function(req, res) {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../uploads/${img}`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let pathNoImage = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImage);
    }
});

/****
 * Peticiones PUT
 */
app.put('/baucher/:id', function(req, res) {

    let id = req.params.id;
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
    let nombreArchivo = archivo.name.split(".");
    let extension = nombreArchivo[nombreArchivo.length - 1];
    //extensiones permitidas
    let extensionesValidas = ["jpg", "png", "gif", "jpeg"];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: "Solo se permiten las extensiones: " + extensionesValidas.join(", ")
            }
        });
    }

    //cambiar nombre de archivo
    let nombreArchivoGuardar = `${id}-${new Date().getMilliseconds()}.${extension}`



    archivo.mv(`uploads/${nombreArchivoGuardar}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                error: err
            });

        //imagen cargada 
        imagenAfiliados(id, res, nombreArchivoGuardar);


    });;

});

function imagenAfiliados(id, res, nombreArchivo) {
    Associate.findById(id, (error, associateDB) => {
        if (error) {
            borrarArchivo(nombreArchivo)
            return res.status(500).json({
                ok: false,
                error
            })
        }

        if (!associateDB) {
            borrarArchivo(nombreArchivo)
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Afiliado no encontrado"
                }
            })
        }
        borrarArchivo(associateDB.paymentBaucher)

        associateDB.paymentBaucher = nombreArchivo;

        associateDB.save((error, asociadoGuardado) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            }
            res.json({
                ok: true,
                data: asociadoGuardado,
                img: nombreArchivo,
                message: "Archivo cargado"
            });
        })


    });

}

function borrarArchivo(nombre) {

    let pathImagen = path.resolve(__dirname, `../uploads/${nombre}`)

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

//=======================
// Exportar rutas
//=======================
module.exports = app;