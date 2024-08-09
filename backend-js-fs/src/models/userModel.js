const {Schema, model} = mongoose;
import bcrypt from "bcrypt"
import mongoose from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "El campo name es requerido"]
    },

    email: {
        type: String,
        required: [true, "El campo email es requerido"],
        unique: true
    },

    password: {
        type: String,
        required: [true, "El campo password es requerido"]
    }
},
{
    timestamps: true
});

userSchema.methods.matchPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
};

export const userModel = model("user", userSchema);