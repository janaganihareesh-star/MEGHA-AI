const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/megha-ai';
  let retries = 5;
  while (retries > 0) {
    try {
      const conn = await mongoose.connect(connUri, {
        autoIndex: true
      });
      console.log('MongoDB Connected');
      
      mongoose.connection.on('disconnected', () => {
        console.warn('[MongoDB] Disconnected! Retrying connection in 5 seconds...');
        setTimeout(() => {
          mongoose.connect(connUri, { autoIndex: true }).catch(err => console.error('MongoDB Reconnect Error:', err.message));
        }, 5000);
      });
      
      // Drop unique index on mobileNumber if it exists to resolve duplication issues
      try {
        await conn.connection.db.collection('users').dropIndex('mobileNumber_1');
        console.log('Successfully dropped unique index mobileNumber_1 from users collection');
      } catch (indexErr) {
        // Index might not exist or already dropped, ignore error safely
      }
      
      break;
    } catch (err) {
      logger.error(`Database connection failed: ${err.message}`);
      retries -= 1;
      logger.info(`Retries left: ${retries}. Reconnecting in 5 seconds...`);
      if (retries === 0) {
        logger.error('Could not connect to MongoDB. Exiting application.');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

module.exports = connectDB;