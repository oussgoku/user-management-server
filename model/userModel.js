const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please tell us your first name!'],
  },
  lastName: {
    type: String,
    required: [true, 'Please tell us your last name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  role: {
    type: String,
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: Number, // 'double' is not a valid type in Mongoose. Use 'Number' instead.
    default: 0.0
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  dateOfBirth: {
    type: Date
  },
  hireDate: {
    type: Date,
    default: Date.now
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }
});


const User = mongoose.model('User', userSchema);

module.exports = User;