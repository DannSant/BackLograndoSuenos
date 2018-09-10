const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var positionSchema = new Schema({
    position_number: { type: Number },
    email: { type: String, required: false },
    payAmmount: { type: Number, required: [true, "Monto de pago es necesario"] },
    paymentDate: { type: Date, required: [true, "Fecha de pago es necesario"] },
    paymentNumber: { type: String, required: [true, "Folio de pago es necesario"] },
    paymentBaucher: { type: String },
    external_username: { type: String },
    external_password: { type: String },
    isFirst: { type: Boolean, default: false },
    associate: { type: Schema.Types.ObjectId, ref: 'Associate', required: true },
    status: { type: Boolean, default: true }
});

//associateSchema.plugin(autoIncrement.plugin, 'id');
positionSchema.plugin(autoIncrement.plugin, { model: 'Position', field: 'position_number', startAt: 1 });

module.exports = mongoose.model("Position", positionSchema);