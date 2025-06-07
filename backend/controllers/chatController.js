const  User  = require('../models/User');
const Message = require('../models/Chat');
const { catchAsyncErrors } = require('../middleware/catchAsyncError');

class ChatController {
  // Get all users except the current user
  getUsers = catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find({ _id: { $ne: req.id } })
        .select('-password -createdAt -updatedAt')
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
        return res.json([]);
      }
      const searchQuery = new RegExp(query, 'i');
      const users = await User.find({
        $and: [
          { _id: { $ne: req.id } },
          {
            $or: [
              { email: { $regex: searchQuery } },
              { mobile: { $regex: searchQuery } },
              { username: { $regex: searchQuery } },
            ],
          },
        ],
      }).select('-password -createdAt -updatedAt');
      res.json(users);
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
      }).populate('sender', 'email username');
      res.json(messages);
    } catch (error) {
      next(error);
    }
  });

  // Fetch offline messages for the authenticated user
  getOfflineMessages = catchAsyncErrors(async (req, res, next) => {
    // Implementation of getOfflineMessages method
  });
}

module.exports = new ChatController();