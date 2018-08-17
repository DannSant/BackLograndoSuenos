const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var stateSchema = new Schema({
    name: { type: String, required: [true, "El nombre es necesario"] },    
    status: { type: Boolean, default: true }
});



module.exports = mongoose.model("State", stateSchema);