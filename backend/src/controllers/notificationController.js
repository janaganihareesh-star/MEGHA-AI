const Notification = require('../models/Notification');

// GET /api/notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const list = await Notification.find({ userId })
      .sort({ isRead: 1, createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, notifications: list });
  } catch (err) {
    next(err);
  }
};

// PUT /api/notifications/read
exports.markRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { ids } = req.body; // array of IDs to mark read, or empty to mark all read

    const query = { userId };
    if (ids && Array.isArray(ids) && ids.length > 0) {
      query._id = { $in: ids };
    }

    await Notification.updateMany(query, { isRead: true });

    res.status(200).json({ success: true, message: 'Notifications marked as read.' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/notifications/:id
exports.deleteNotification = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    const deleted = await Notification.findOneAndDelete({ _id: notificationId, userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Notification not found or unauthorized.' });
    }

    res.status(200).json({ success: true, message: 'Notification deleted successfully.' });
  } catch (err) {
    next(err);
  }
};