import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        }
    },
    {timestamps: true},
)

const Todos = mongoose.model('Todos', todoSchema);

export default Todos;