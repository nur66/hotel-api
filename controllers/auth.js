import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/errors.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    try {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash
        });

        await newUser.save();
        res.status(201).send('User has been created');
    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username})
        if(!user) return next(createError(404, "User Not Found"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect) return next(createError(400, "Wrong password or username"));

        // untuk registrasi json web tokennya agar untuk update dan create harus bisa menggunakan middleware jwt
        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT);

        // const {password, isAdmin, ...otherDetails} = user; // jika ingi melihat keseluruhan menggunakan otherDetails
        const {password, isAdmin, ...otherDetails} = user._doc;
        res
            .cookie("access_token", token, {
                httpOnly: true
            })
            .status(200)
            .json({details:{...otherDetails}, isAdmin});
    } catch (error) {
        next(error)
    }
}