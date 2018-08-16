const express = require('express')
const app = express()

//=======================
// Rutas de Catalogos
//=======================
app.use(require('./login'));
app.use(require('./user'));
app.use(require('./bank'));
app.use(require('./associate'));
app.use(require('./states'));
app.use(require('./baucher'));
app.use(require('./email'));



module.exports = app;