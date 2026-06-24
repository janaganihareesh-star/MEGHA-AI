const mongoose = require('mongoose');

const SecureVaultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  identifier: {
    type: String, // E.g., 'Bank Password', 'API Key'
    required: true
  },
  encryptedData: {
    type: String, // The AES encrypted cipher text
    required: true
  },
  iv: {
    type: String, // Initialization Vector used for encryption
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SecureVault', SecureVaultSchema);
