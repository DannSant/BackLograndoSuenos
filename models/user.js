const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

let rolesValidos = {
    values: ["USER_ROLE", "ADMIN_ROLE", "EMPLOYEE_ROLE", "THERAPIST_ROLE"],
    message: "{VALUE} no es un rol valido"
};

var userSchema = new Schema({
    name: { type: String, required: [true, "El nombre es necesario"] },
    lastname: { type: String, required: [true, "El apellido es necesario"] },
    username: { type: String, unique: true, required: [true, "El usuario es necesario"] },
    password: { type: String, required: [true, "El password es necesario"] },
    role: { type: String, required: true, default: "USER_ROLE", enum: rolesValidos },
    status: { type: Boolean, default: true }
});

userSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser unico" });

module.exports = mongoose.model("User", userSchema);