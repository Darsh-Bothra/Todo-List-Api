import Todos from '../models/todos.model.js';
import { errorHandler } from '../utils/error.js';

export const createTodo = async (req, res, next) => {
    try {
        const todo = await Todos.create(req.body);
        res.status(200).json(todo);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const updateTodo = async (req, res, next) => {
    const todo = Todos.findById(req.params.id);

    if (!todo) {
        return next(errorHandler(404, "Todo not found"));
    }

    try {
        const userId = req.params.id;
        const updates = req.body;
        const updatedTodo = await Todos.findByIdAndUpdate(
            userId,
            updates,
            { new: true }
        );
        res.status(200).json(updatedTodo);
    } catch (error) {
        next(error);
    }
}

export const deleteTodo = async (req, res, next) => {
    const todo = Todos.findById(req.params.id);
    if (!todo) {
        return next(errorHandler(404, "Todo not found"));
    }
    try {
        await Todos.findByIdAndDelete(req.params.id);
        res.status(200).json("Todo deleted successfully");
    } catch (error) {
        next(error);
    }
}

export const getTodos = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 1;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const {title, description} = req.query;
        const queryObj = {};
        if(title) {
            queryObj.title = title;
        }
        if(description) {
            queryObj.description = description;
        }
        // console.log(queryObj);
        const todos = await Todos.find(queryObj).skip(skip).limit(limit);
        res.status(200).json({todos, limit: limit, page: page, total: todos.length});
    } catch (error) {
        next(error);
    }
}