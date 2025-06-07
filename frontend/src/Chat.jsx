// src/components/ChatUI.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  connectSocket,
  disconnectSocket,
  onUserStatus,
  onOfflineMessages,
  onReceiveMessage,
  sendMessage,
} from './socket';
import { useDispatch, useSelector } from 'react-redux';
import { asyncgetusers, asynclogout } from './store/actions/userAction';
import { getRequest, postRequest } from './config/Request';
import UserProfile from './UserProfile';


const ChatUI = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const CURRENT_USER_ID = useSelector((state) => state.user.user?._id);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const selectedContactRef = useRef(null);

  useEffect(() => {
    selectedContactRef.current = selectedContact;
  }, [selectedContact]);

  useEffect(() => {
    if (users) {
      setAllUsers(users);
    }
  }, [users]);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim() === '') {
        setAllUsers(users);
        return;
      }
      try {
        const response = await postRequest('/api/v1/chat/search', { query: searchQuery });
        setAllUsers(response.data);
      } catch (error) {
        console.error('Failed to search users:', error);
      }
    };
    const debounceTimer = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, users]);

  useEffect(() => {
    if (!CURRENT_USER_ID) return;

    connectSocket(CURRENT_USER_ID);
    dispatch(asyncgetusers());

    onOfflineMessages((offlineMsgs) => {
      const formattedMessages = offlineMsgs.map((msg) => ({
        _id: msg._id,
        text: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        senderId: msg.sender._id,
      }));
      setMessages((prev) => [...prev, ...formattedMessages]);
    });

    onReceiveMessage((message) => {
      const currentContact = selectedContactRef.current;
      if (currentContact && message.sender._id === currentContact._id) {
        setMessages((prev) => [
          ...prev,
          {
            _id: message._id,
            text: message.content,
            time: new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            senderId: message.sender._id,
          },
        ]);
      } else {
        // Increment unread count for non-active chats
        setAllUsers((prev) =>
          prev.map((c) =>
            c._id === message.sender._id ? { ...c, unread: (c.unread || 0) + 1 } : c
          )
        );
      }
    });

    onUserStatus((status) => {
      setAllUsers((prev) =>
        prev.map((c) => (c._id === status.userId ? { ...c, online: status.online } : c))
      );
    });

    return () => {
      disconnectSocket();
    };
  }, [CURRENT_USER_ID, dispatch]);

  const handleLogout = () => {
    dispatch(asynclogout());
  };

  const handleSelectContact = async (contact) => {
    setSelectedContact(contact);
    setIsProfileVisible(false);
    try {
      const response = await getRequest(`/api/v1/chat/messages/${contact._id}`);
      const formattedMessages = response.data.map((msg) => ({
        _id: msg._id,
        text: msg.content,
        time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        senderId: msg.sender._id,
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedContact) {
      sendMessage(selectedContact._id, newMessage);
      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now().toString(),
          text: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          senderId: CURRENT_USER_ID,
        },
      ]);
      setNewMessage('');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-blue-600 rounded mr-2"></div>
            <h1 className="text-xl font-bold">chat</h1>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            title="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
        {/* Search */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
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
                        ? new Date(contact.lastMessageDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </span>
                  </div>
                </div>
             
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No users found.</div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-3/4 flex flex-col relative overflow-hidden">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div
              className="p-4 border-b border-gray-200 flex items-center cursor-pointer"
              onClick={() => setIsProfileVisible(!isProfileVisible)}
            >
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
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.senderId === CURRENT_USER_ID ? 'justify-end' : 'justify-start'
                  } mb-4`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.senderId === CURRENT_USER_ID ? 'bg-blue-100' : 'bg-gray-200'
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className="text-xs text-gray-500 block text-right">
                      {message.time}
                    </span>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
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
        <UserProfile
          user={selectedContact}
          isVisible={isProfileVisible}
          onClose={() => setIsProfileVisible(false)}
        />
      </div>
    </div>
  );
};

export default ChatUI;