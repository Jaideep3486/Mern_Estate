import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
  //console.log(req.body);
  const { username, email, password } = req.body;
  // Extracting username, email, and password from the request body

  const hashedPassword = bcrypt.hashSync(password, 10);
  // Hashing the password using bcrypt for security

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  // Creating a new User instance with the extracted data

  await newUser
    .save()
    .then((user) => {
      res.status(201).json({ message: 'User registered successfully', user });
      // Sending a success response with the created user data
    })
    .catch((err) => {
      //res.status(500).json({ message: 'Error registering user', error: err });
      // Handling errors and sending an error response

      next(err);

      //  next(errorHandler(550, 'Custom Error: User registration failed'));
    });
};
