import mongoose from 'mongoose';
// Importing Mongoose library for MongoDB interactions

const userSchema = new mongoose.Schema(
  // Creating a new Mongoose schema for User
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Defining the schema fields with their types and constraints
  },
  { timestamps: true }
);
// Defining the User schema with fields: username, email, password, and timestamps
const User = mongoose.model('User', userSchema);
// Creating the User model using the defined schema
export default User;
// exporting the User model for use in other parts of the application
