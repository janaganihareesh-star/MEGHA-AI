const crypto = require('crypto');
const SecureVault = require('../models/SecureVault');

// 256-bit AES key is 32 bytes (64 hex characters)
const getSecretKey = () => {
  const key = process.env.SECURE_VAULT_KEY;
  if (!key || key.length !== 64) {
    throw new Error('Invalid SECURE_VAULT_KEY. Must be 64 hex characters.');
  }
  return Buffer.from(key, 'hex');
};

const ALGORITHM = 'aes-256-cbc';

/**
 * Encrypts a plaintext string and saves it to the database.
 */
async function encryptAndSave(userId, identifier, plainText) {
  const iv = crypto.randomBytes(16);
  const key = getSecretKey();
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Upsert logic
  let vaultItem = await SecureVault.findOne({ userId, identifier });
  if (vaultItem) {
    vaultItem.encryptedData = encrypted;
    vaultItem.iv = iv.toString('hex');
    await vaultItem.save();
  } else {
    vaultItem = await SecureVault.create({
      userId,
      identifier,
      encryptedData: encrypted,
      iv: iv.toString('hex')
    });
  }

  return vaultItem;
}

/**
 * Decrypts a stored cipher text.
 */
async function decryptAndRetrieve(userId, identifier) {
  const vaultItem = await SecureVault.findOne({ userId, identifier });
  if (!vaultItem) return null;

  const key = getSecretKey();
  const iv = Buffer.from(vaultItem.iv, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(vaultItem.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

module.exports = {
  encryptAndSave,
  decryptAndRetrieve
};
