import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';

export const forgetPassword = async (req, res, next) => {
    const user = User.findOne({ mail: req.body.mail });
    if (!user) {
        return errorHandler(404, "User not found");
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "10m",
    })

    // nodemailer 
    const transporter = nodemailer.createTransport({
        host: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: "Reset Password",
        html: `<h1>Reset Your Password</h1>
                <p>Click on the following link to reset your password:</p>
                <a href="http://localhost:4040/reset-password/${token}">http://localhost:4040/reset-password/${token}</a>
                <p>The link will expire in 10 minutes.</p>
                <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            return next(errorHandler(500, err.message));
        }
        res.status(200).json("Mail sent");
    })
}

export const resetPassword = async (req, res, next) => {
    try {
        // verify the token
        const decodeToken = jwt.verify(req.param.token, process.env.JWT_SECRET);
        if(!decodeToken) {
            return next(errorHandler(401, "Invalid Token"));
        }
        const user = await User.findOne({_id: decodeToken.userId});
        if(!user) {
            return next(errorHandler(401, "User not found"));
        }
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(req.body.newPassword, salt);
        user.password = newPassword;
        await user.save();
        res.status(200).json("Password updated successfully");
    } catch (error) {
        next(error);
    }
}
