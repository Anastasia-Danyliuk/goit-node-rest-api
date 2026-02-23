import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const findUserByEmail = (email) => User.findOne({ where: { email } });

export const findUserById = (id) => User.findByPk(id);

export const register = async (data) => {
    const { password } = data;
    const hashPassword = await bcrypt.hash(password, 10);
    return User.create({ ...data, password: hashPassword });
};

export const updateToken = (id, token) => User.update({ token }, { where: { id } });