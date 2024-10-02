import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.route.js';
import todoRouter from './routes/todos.routes.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MonogDB connection successful')
    })
    .catch((err) => {
        console.log('MongoDB not connected: ', err);
    })


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/todos", todoRouter);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// error handling middleware over server side
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})


// mdb
// silentMonk
// todo8724


// Import the Express module
// import express from 'express';

// // Initialize an Express application
// const app = express();

// // Middleware to parse incoming JSON requests automatically
// app.use(express.json());

// // Define a GET route for the root URL ('/')
// // When someone accesses this URL, it will respond with 'Hello World'
// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

// // Define the port number for the server to listen on
// const port = 4040;

// // Start the server and listen for incoming requests on the specified port
// // Once the server is running, log a message to the console
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
