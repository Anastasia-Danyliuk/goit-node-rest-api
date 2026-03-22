import bcrypt from "bcryptjs";
import User from "../models/User.js";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

export const findUserByEmail = (email) => User.findOne({ where: { email } });

export const findUserById = (id) => User.findByPk(id);

export const register = async (data) => {
    const { email, password } = data;
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: '250', r: 'g', d: 'identicon' }, false);

    const verificationToken = nanoid();
    const newUser = await User.create({
        ...data,
        password: hashPassword,
        avatarURL,
        verificationToken
    });

    const verifyEmail = {
        to: email,
        subject: "Verify your email",
        html: `<a target="_blank" href="${process.env.BASE_URL}/api/auth/verify/${verificationToken}">Click to verify your email</a>`,
    };
    await sendEmail(verifyEmail);

    return newUser;
};

export const updateToken = (id, token) => User.update({ token }, { where: { id } });
export const updateUser = (id, data) => User.update(data, { where: { id } });

export const verifyUser = async (verificationToken) => {
    const user = await User.findOne({ where: { verificationToken } });
    if (!user) return null;

    await user.update({ verify: true, verificationToken: null });
    return true;
};