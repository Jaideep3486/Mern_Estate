import express from 'express';
import { test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Sample route for user registration

// router.get('/test', (req, res) => {
//   res.json({ message: 'test message user.route.js test endpoint' });
//   // Sending a response for user registration endpoint
// });

//Better way to do the above route by importing controller

router.get('/test', test);
// Defining a GET route for /test that uses the test controller function

router.post('/update/:id', verifyToken, updateUser);
// Defining a POST route for /update/:id that uses the updateUser controller function

export default router;
// Exporting the router to be used in other parts of the application
