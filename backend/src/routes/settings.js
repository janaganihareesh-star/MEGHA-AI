const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const UserPreference = require('../models/UserPreference');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const MemoryVault = require('../models/MemoryVault');
const Goal = require('../models/Goal');
const Achievement = require('../models/Achievement');

router.use(auth);

// GET /api/settings — fetch account-level settings
router.get('/', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const pref = await UserPreference.findOne({ userId: req.user.id });
    res.status(200).json({
      success: true,
      settings: {
        email: user.email,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        themePreference: user.themePreference,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        isActive: user.isActive,
        lastLogin: user.lastLogin
      },
      preferences: pref || null
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings — update account-level settings (fullName, mobileNumber, themePreference)
router.put('/', async (req, res, next) => {
  try {
    const { fullName, mobileNumber, themePreference } = req.body;
    const updateFields = {};

    if (fullName && fullName.trim()) updateFields.fullName = fullName.trim();
    if (mobileNumber && mobileNumber.trim()) updateFields.mobileNumber = mobileNumber.trim();
    if (themePreference && ['dark', 'light'].includes(themePreference)) {
      updateFields.themePreference = themePreference;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, message: 'Account settings updated.', user });
  } catch (err) {
    next(err);
  }
});

// GET /api/settings/export — export all user data as JSON
router.get('/export', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [user, preferences, conversations, memories, goals, achievements] = await Promise.all([
      User.findById(userId).select('-passwordHash -emailOtp -phoneOtp'),
      UserPreference.findOne({ userId }),
      Conversation.find({ userId }).limit(100),
      MemoryVault.find({ userId }).limit(200),
      Goal.find({ userId }),
      Achievement.find({ userId })
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      account: user,
      preferences,
      conversations,
      memories,
      goals,
      achievements
    };

    res.status(200).json({ success: true, data: exportData });
  } catch (err) {
    next(err);
  }
});

const bcrypt = require('bcryptjs');

// DELETE /api/settings/account — permanently delete all user data
router.delete('/account', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required to delete your account.' });
    }

    const user = await User.findById(userId).select('+passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Verify email
    if (user.email !== email) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Delete all user-related documents in parallel
    await Promise.all([
      UserPreference.deleteMany({ userId }),
      Conversation.deleteMany({ userId }),
      Message.deleteMany({ userId }),
      MemoryVault.deleteMany({ userId }),
      Goal.deleteMany({ userId }),
      Achievement.deleteMany({ userId }),
      User.findByIdAndDelete(userId)
    ]);

    res.status(200).json({ success: true, message: 'All account data permanently deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;