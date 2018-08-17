const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var associateSchema = new Schema({
    id: { type: Number },
    name: { type: String, required: [true, "El nombre es necesario"] },
    email: { type: String },
    personalEmail: { type: String },
    cellphone: { type: String, required: [true, 'El numero de contacto es necesario'] },
    bank: { type: Schema.Types.ObjectId, ref: 'Bank', required: true },
    account: { type: String, required: [true, 'El numero de cuenta es necesario'] },
    clabe: { type: String, required: [true, 'El numero de clabe es necesario'] },
    card: { type: String, required: [true, 'El numero de tarjeta es necesario'] },
    curp: { type: String, required: [true, 'El curp es necesario'] },
    rfc: { type: String, required: [true, 'El rfc es necesario'] },
    address: { type: String, required: [true, 'La direccion es necesaria'] },
    birthDate: { type: Date, required: [true, "La fecha de nacimiento es necesaria"] },
    hasPayment: { type: Boolean, default: true },
    payAmmount: { type: Number, required: false },
    paymentDate: { type: Date },
    paymentNumber: { type: String },
    paymentBaucher: { type: String },
    state: { type: Schema.Types.ObjectId, ref: 'State', required: true },
    creationDate: { type: Date },
    status: { type: Boolean, default: true }
});

//associateSchema.plugin(autoIncrement.plugin, 'id');
associateSchema.plugin(autoIncrement.plugin, { model: 'Associate', field: 'id', startAt: 1 });

module.exports = mongoose.model("Associate", associateSchema);