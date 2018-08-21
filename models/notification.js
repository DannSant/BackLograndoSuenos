const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

let types = {
    values: ["T", "F"],
    message: "{VALUE} no es un tipo valido"
};

var notificationSchema = new Schema({
    title: { type: String, required: [true, "El titulo es necesario"] },
    type: { type: String, default: 'T', enum: types },
    text: { type: String, required: [true, "El texto es necesario"] },
    userTo: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    broadcast: { type: Boolean, default: true },
    creationDate: { type: Date },
    status: { type: Boolean, default: true }
});

module.exports = mongoose.model("Notification", notificationSchema);