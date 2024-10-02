import express from 'express';
import { authorization } from '../middleware/auth.middleware.js';
import { createTodo, deleteTodo, getTodos, updateTodo } from '../controllers/todos.controllers.js';



const router = express.Router();

router.post('/create', authorization, createTodo);
router.put('/update/:id', authorization, updateTodo);
router.delete('/delete/:id', authorization, deleteTodo);
router.get('/get/:id', authorization, getTodos);

export default router;