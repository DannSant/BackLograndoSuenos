const mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var autoIncrement = require('mongoose-auto-increment');
//autoIncrement.initialize(mongoose.connection);

var associateSchema = new Schema({
    personalEmail: { type: String, required: [true, 'El email de contacto es necesario'] },
    cellphone: { type: String, required: [true, 'El numero de contacto es necesario'] },
    bank: { type: Schema.Types.ObjectId, ref: 'Bank', required: false },
    account: { type: String, required: false },
    clabe: { type: String, required: false },
    card: { type: String, required: false },
    curp: { type: String, required: false },
    rfc: { type: String, required: [true, 'El rfc es necesario'] },
    address: { type: String, required: false },
    birthDate: { type: Date, required: [true, "La fecha de nacimiento es necesaria"] },
    state: { type: Schema.Types.ObjectId, ref: 'State', required: false },
    creationDate: { type: Date },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    userReference: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    status: { type: Boolean, default: true }
});

//associateSchema.plugin(autoIncrement.plugin, 'id');
//associateSchema.plugin(autoIncrement.plugin, { model: 'Associate', field: 'id', startAt: 1 });

module.exports = mongoose.model("Associate", associateSchema);