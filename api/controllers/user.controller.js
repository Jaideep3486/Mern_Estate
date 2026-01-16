import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const test = (req, res) => {
  res.json({ message: 'test message from user.controller.js test endpoint' });
  // Sending a response for test endpoint
};
// Controller function to handle test requests and send a JSON response

export const updateUser = async (req, res, next) => {
  // Function to update user details
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, 'You are not allowed to update this user!'));
  }
  // If the user ID in the token doesn't match the ID in the URL, return an error
  // Proceed with updating user details
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          usnername: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...otherDetails } = updatedUser._doc;
    res.status(200).json(otherDetails);
    // Sending the updated user details as a JSON response
  } catch (err) {
    next(err);
    // Passing any errors to the error handling middleware
  }
};
