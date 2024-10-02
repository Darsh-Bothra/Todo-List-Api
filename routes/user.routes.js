import express from "express";
import { authorization } from "../middleware/auth.middleware.js";
import {forgetPassword, resetPassword} from '../controllers/user.controllers.js'


const router =  express.Router();

// router.get('/user/todos/:id', authorization, getUserTodos);
// router.delete('/user/delete/:id', authorization, deleteUser);
router.post('/forgetPassword', authorization, forgetPassword);
router.post('/resetPassword/:token', authorization, resetPassword);

export default router