const  User  = require('../models/User');
const Message = require('../models/Chat');
const { catchAsyncErrors } = require('../middleware/catchAsyncError');

class ChatController {
  // Get all users except the current user
  getUsers = catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find({ _id: { $ne: req.id } })
        .select('-password -createdAt -updatedAt -email')
        .lean();

      const usersWithLastMessage = await Promise.all(
        users.map(async (user) => {
          const lastMessage = await Message.findOne({
            $or: [
              { sender: req.id, recipient: user._id },
              { sender: user._id, recipient: req.id },
            ],
          })
            .sort({ timestamp: -1 })
            .select('timestamp')
            .lean();

          return {
            ...user,
            lastMessageDate: lastMessage ? lastMessage.timestamp : null,
          };
        })
      );

      res.json(usersWithLastMessage);
    } catch (error) {
      next(error);
    }
  });

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

  getMessages = catchAsyncErrors(async (req, res, next) => {
    try {
      const { otherUserId } = req.params;
      const messages = await Message.find({
        $or: [
          { sender: req.id, recipient: otherUserId },
          { sender: otherUserId, recipient: req.id },
        ],
      }).sort({ timestamp: 'asc' });
      res.json(messages);
    } catch (error) {
      next(error);
    }
  });
}

module.exports = new ChatController();