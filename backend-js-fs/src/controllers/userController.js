import { encryptPassword } from "../helpers/encryptPassword";
import { generateToken } from "../helpers/generateToken";
import { response } from "../helpers/response";
import { userModel } from "../models/userModel";

const userCtrl = {};

userCtrl.register = async (req, reply) => {
    const {email, password, name} = req.body;
    try {
        const user = await userModel.findOne({emial});
        if (user) {
            return response(reply, 409, false, "", "El correo ya existe en otro registro")
        };

        const passwordEncrypt = encryptPassword(password);
        const newUser = new userModel({email, password: passwordEncrypt, name});

        await newUser.save();

        const token = generateToken({user: newUser._id})

        response(reply, 201, true, {...newUser._doc, token, password: null}, "Usuario creado")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

userCtrl.login = async (req, reply) => {
    const {password, email} = req.body
    try {
        const user = await userModel.findOne({email});

        if (user && user.matchPassword(password)){
            const token = generateToken({user: user._id})
            return response(reply, 200, true, {...user._doc, password: null, token}, "Bienvenido")
        };

        response(reply, 400, false, "", "Email o Contraseña incorrecta")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

export default userCtrl;