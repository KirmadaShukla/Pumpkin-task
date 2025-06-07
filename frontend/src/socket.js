import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your backend URL

export const connectSocket = (userId) => {
  socket.emit('setUser', userId);
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const onUserStatus = (callback) => {
  socket.on('userStatus', callback);
};

export const onOfflineMessages = (callback) => {
  socket.on('offlineMessages', callback);
};

export const onReceiveMessage = (callback) => {
  socket.on('receiveMessage', callback);
};

export const sendMessage = (recipientId, content) => {
  socket.emit('sendMessage', { recipientId, content });
}; 