const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generateOtp } = require('../utils/helpers');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  mobileNumber: {
    type: String,
    trim: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required']
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailOtp: String,
  emailOtpExpiry: Date,
  profilePicture: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  tokenVersion: {
    type: Number,
    default: 0
  },
  themePreference: {
    type: String,
    enum: ['dark', 'light'],
    default: 'dark'
  }
}, {
  timestamps: true
});

// Pre-save middleware to hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

// Generate Email OTP method
UserSchema.methods.generateEmailOtp = function () {
  const otp = generateOtp();
  this.emailOtp = bcrypt.hashSync(otp, 10);
  this.emailOtpExpiry = new Date(Date.now() + 4 * 60 * 1000); // 4 minutes expiry (as required)
  return otp;
};

module.exports = mongoose.model('User', UserSchema);