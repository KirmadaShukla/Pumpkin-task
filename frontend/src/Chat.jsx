// src/components/ChatUI.jsx
import React, { useState, useEffect } from 'react';
import {
  connectSocket,
  disconnectSocket,
  onUserStatus,
  onOfflineMessages,
  onReceiveMessage,
  sendMessage,
} from './socket';
import { useDispatch, useSelector } from 'react-redux';
import { asyncgetusers } from './store/actions/userAction';
import { getRequest } from './config/Request';


// This is a sample user. In a real app, you'd get this from your auth context.


const ChatUI = () => {
  // In a real app, this list of users/contacts would come from your database.
  const dispatch=useDispatch()
  const {users}=useSelector(state=>state.user)
  const CURRENT_USER_ID = useSelector(state => state.user.user?._id);
  console.log(CURRENT_USER_ID) 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(()=>{
    if(users){
      setAllUsers(users);
    }
  },[users]);
  useEffect(()=>{
    if(CURRENT_USER_ID)
    dispatch(asyncgetusers())
  },[CURRENT_USER_ID])
  useEffect(() => {
    if(!CURRENT_USER_ID) return
    connectSocket(CURRENT_USER_ID);

    onOfflineMessages((offlineMsgs) => {
      const formattedMessages = offlineMsgs.map(msg => ({
        text: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: msg.sender._id === CURRENT_USER_ID ? 'user' : 'other',
      }));
      setMessages(prev => [...prev, ...formattedMessages]);
    });

    onReceiveMessage((message) => {
      if (selectedContact && message.sender._id === selectedContact._id) {
        setMessages(prev => [...prev, {
          text: message.content,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: 'other',
        }]);
      } else {
        // Increment unread count for non-active chats
        setAllUsers(prev => prev.map(c => 
          c._id === message.sender._id ? { ...c, unread: (c.unread || 0) + 1} : c
        ));
      }
    });

    onUserStatus((status) => {
      setAllUsers(prev => prev.map(c => 
        c._id === status.userId ? { ...c, online: status.online } : c
      ));
    });

    // return () => {
    //   disconnectSocket();
    // };
  }, [users,CURRENT_USER_ID,selectedContact]);

  const handleSelectContact = async (contact) => {
    setSelectedContact(contact);
    try {
      const response = await getRequest(`/api/v1/chat/messages/${contact._id}`);
      const formattedMessages = response.data.map((msg) => ({
        text: msg.content,
        time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: msg.sender === CURRENT_USER_ID ? 'user' : 'other',
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setMessages([]);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedContact) {
      sendMessage(selectedContact._id, newMessage);
      setMessages(prev => [...prev, {
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'user',
      }]);
      setNewMessage('');
    }
  };


  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center border-b border-gray-200">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-blue-600 rounded mr-2"></div>
          <h1 className="text-xl font-bold">chat</h1>
        </div>
        {/* Search */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {allUsers && allUsers.length > 0 ? (
          allUsers?.map((contact) => (
            <div
              key={contact._id}
              onClick={() => handleSelectContact(contact)}
              className={`p-4 flex items-center border-b border-gray-200 hover:bg-gray-100 cursor-pointer ${
                selectedContact?._id === contact._id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="relative w-10 h-10 mr-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold">
                  {contact?.username?.charAt(0).toUpperCase()}
                </div>
                {contact?.online && (
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h2 className="font-semibold">{contact?.username}</h2>
                  <span className="text-sm text-gray-500">
                  {contact.lastMessageDate
                      ? new Date(contact.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {contact?.email}
                </p>
              </div>
            
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No users found.</div>
        )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-3/4 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center">
              <div className="relative w-10 h-10 mr-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedContact.username?.charAt(0).toUpperCase()}
                  </div>
                  {selectedContact.online && (
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                  )}
              </div>
              <h2 className="font-semibold">{selectedContact.username}</h2>
            </div>
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="text-center text-gray-500 mb-4">Today</div>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.sender === 'user' ? 'bg-blue-100' : 'bg-gray-200'
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className="text-xs text-gray-500 block text-right">{message.time}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <input
                  type="text"
                  placeholder="Message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button type="submit" className="ml-2 p-2 text-blue-600 hover:text-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUI;