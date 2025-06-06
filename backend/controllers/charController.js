const { User } = require('../models/User');
const Message = require('../models/Chat');
const { catchAsyncErrors } = require('../middleware/catchAsyncError');

class ChatController {
  // Search users by email or mobile
  searchUser = catchAsyncErrors(async (req, res, next) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ message: 'Query is required' });
      }
      const users = await User.find({
        $or: [{ email: query }, { mobile: query }],
        _id: { $ne: req.user.id }, // Exclude the current user
      }).select('email mobile');
      res.json(users);
    } catch (error) {
      next(error);
    }
  });

  // Fetch offline messages for the authenticated user
  getOfflineMessages = catchAsyncErrors(async (req, res, next) => {
    try {
      const messages = await Message.find({ recipient: req.user.id, delivered: false })
        .populate('sender', 'email')
        .sort({ timestamp: 1 });
      res.json(messages);
    } catch (error) {
      next(error);
    }
  });
}

module.exports = new ChatController();