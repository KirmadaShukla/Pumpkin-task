const User = require('../models/User');
const Message = require('../models/Chat');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Set user online status
    socket.on('setUser', async (userId) => {
      try {
        await User.findByIdAndUpdate(userId, { online: true });
        socket.userId = userId;
        socket.join(userId);
        io.emit('userStatus', { userId, online: true });

        // Send offline messages
        const messages = await Message.find({ recipient: userId, delivered: false })
          .populate('sender', 'email');
        socket.emit('offlineMessages', messages);
        await Message.updateMany({ recipient: userId, delivered: false }, { delivered: true });
      } catch (error) {
        console.error('Error in setUser:', error);
      }
    });

    // Handle direct message
    socket.on('sendMessage', async ({ recipientId, content }) => {
      try {
        const message = new Message({
          sender: socket.userId,
          recipient: recipientId,
          content,
        });
        await message.save();

        const populatedMessage = await Message.findById(message._id).populate('sender', 'username email');

        const recipient = await User.findById(recipientId);
        if (recipient.online) {
          io.to(recipientId).emit('receiveMessage', populatedMessage);
          await Message.updateOne({ _id: message._id }, { delivered: true });
        }
      } catch (error) {
        console.error('Error in sendMessage:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      if (socket.userId) {
        try {
          await User.findByIdAndUpdate(socket.userId, { online: false });
          io.emit('userStatus', { userId: socket.userId, online: false });
        } catch (error) {
          console.error('Error in disconnect:', error);
        }
      }
      console.log('User disconnected:', socket.id);
    });
  });
};