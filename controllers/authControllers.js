import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as authService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import path from "path";
import fs from "fs/promises";

const { JWT_SECRET } = process.env;

export const register = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await authService.findUserByEmail(email);
        if (user) throw HttpError(409, "Email in use");

        const newUser = await authService.register(req.body);
        res.status(201).json({
            user: { email: newUser.email, subscription: newUser.subscription, avatarURL: newUser.avatarURL }
        });
    } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await authService.findUserByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw HttpError(401, "Email or password is wrong");
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "23h" });
        await authService.updateToken(user.id, token);

        res.status(200).json({
            token,
            user: { email: user.email, subscription: user.subscription }
        });
    } catch (error) { next(error); }
};

export const logout = async (req, res, next) => {
    try {
        await authService.updateToken(req.user.id, null);
        res.status(204).send();
    } catch (error) { next(error); }
};

export const getCurrent = (req, res) => {
    res.status(200).json({
        email: req.user.email,
        subscription: req.user.subscription
    });
};


const avatarsDir = path.resolve("public", "avatars");

export const updateAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            throw HttpError(400, "File is required");
        }
        const { id } = req.user;
        const { path: tempUpload, originalname } = req.file;

        const filename = `${req.user.id}_${originalname}`;
        const resultUpload = path.join(avatarsDir, filename);

        await fs.rename(tempUpload, resultUpload);

        const avatarURL = `/avatars/${filename}`;
        await authService.updateUser(req.user.id, { avatarURL });

        res.status(200).json({ avatarURL });
    } catch (error) {
        next(error);
    }
};