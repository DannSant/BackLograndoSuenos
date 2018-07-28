const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var bankSchema = new Schema({
    name: { type: String, required: [true, "El nombre es necesario"] },
    digits: { type: Number, required: [true, 'Latitud  es necesaria'] },
    status: { type: Boolean, default: true }
});



module.exports = mongoose.model("Bank", bankSchema);