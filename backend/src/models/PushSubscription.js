const mongoose = require('mongoose');

const PushSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscription: {
    type: Object, // The PushSubscription object from the browser
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PushSubscription', PushSubscriptionSchema);
