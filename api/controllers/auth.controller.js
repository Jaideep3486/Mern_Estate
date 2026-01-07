import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

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

export const signin = async (req, res, next) => {
  // Signin logic to be implemented

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return next(errorHandler(401, 'wrong credentials'));
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    const { password: pass, ...userInfo } = user._doc;
    res.cookie('access_token', token, { httpOnly: true });
    // res.status(200).json({ message: 'Signin successful', userInfo });
    res.status(200).json(userInfo);
  } catch (error) {
    next(error);
  }
};
