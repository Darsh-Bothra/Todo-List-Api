// what we will be doing in this file
// basically building an user authentication
// this authentication will their for certain routes
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';


export const authorization = (req, res, next) => {
    const token = req.cookies.access_token;
    console.log(token);
    if(!token) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    try {
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodeToken;
        next();
    } catch (error) {
        next(errorHandler(403, 'Forbidden'));
    }
};