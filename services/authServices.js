import bcrypt from "bcryptjs";
import User from "../models/User.js";
import gravatar from "gravatar";

export const findUserByEmail = (email) => User.findOne({ where: { email } });

export const findUserById = (id) => User.findByPk(id);

export const register = async (data) => {
    const { email, password } = data;
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: '250', r: 'g', d: 'identicon' }, false);
    return User.create({ ...data, password: hashPassword, avatarURL });
};

export const updateToken = (id, token) => User.update({ token }, { where: { id } });
export const updateUser = (id, data) => User.update(data, { where: { id } });