import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { errorHandler } from "../utils/error.js";

export const register = async (req, res, next) => {
    const { username, email, password } = req.body;
    if ([username, email,password].some((field) => field?.trim() === "")) {
        return next(errorHandler(400, "All fields are required"));
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: encryptedPassword });
    try {
        await newUser.save();
        res.status(200).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        next(errorHandler(550, "Error from the function"));
        // console.log(error);
    }
}

export const login = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        if (!username && !email) {
            return next(errorHandler(400, "Username or Email are required"));
        }
        const user = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (!user) {
            return next(errorHandler(404, "User not found"));
        }
 
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return next(errorHandler(401, "Invalid email or password"));
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        const {password: pass, ...rem} = user._doc;
        // first generate of cookie for cilent side
        res
            .cookie("access_token", token, {
                // so that js that client side can't access my token
                httpOnly: true
            })
            .status(200)
            .json(rem);
    } catch (error) {
        next(error);
    }
}

export const logout = async (req, res, next) => {
    try {
        res.clearCookie("access_token");
        res.status(200).json("User logged out successfully");
    } catch (error) {
        next(error);
    }
}

