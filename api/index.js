import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
// Importing necessary libraries and route files
import authRouter from './routes/auth.route.js';

// Importing necessary libraries
dotenv.config();
// Importing necessary libraries and configuring environment variables

mongoose
  .connect(process.env.MONGO)
  // Connecting to MongoDB using Mongoose
  .then(() => {
    console.log('Connected to MongoDB');
    // Logging a message upon successful connection
  })
  // Successfully connected to MongoDB
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    // Handling connection errors
  });
// Connecting to MongoDB using Mongoose with connection string from environment variables

const app = express();
// Initializing Express application

app.use(express.json());
// Middleware to parse JSON request bodies , this app can now accept json data in req body

app.listen(3000, () => {
  // Starting the server on port 3000
  console.log('API server is running on http://localhost:3000!');
  // Logging a message to indicate the server is running
});
// Setting up Express server and connecting to MongoDB using Mongoose

// app.get('/test', (req, res) => {
//   res.send('Welcome to the API server!');
//   // Defining a simple route for the root URL
// });
// Defining a simple route for the root URL that sends a welcome message
// Req is the data that comes from the client
// Res is the data that we send back to the client

app.use('/api/users', await userRouter);
// Using the user routes for handling requests to /api/users

app.use('/api/auth', authRouter);
