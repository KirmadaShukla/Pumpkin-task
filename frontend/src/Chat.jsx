// src/components/ChatUI.jsx
import React from 'react';

const ChatUI = () => {
  // Sample data for chat contacts
  const contacts = [
    { initials: 'JD', name: 'Jessica Drew', message: 'Ok, see you later', time: '8:30 pm', unread: 2 },
    { initials: 'DM', name: 'David Moore', message: 'You: I GOT IT REMEMBER ANYTHING', time: '8:16 pm', active: true },
    { initials: 'GJ', name: 'Greg James', message: 'I got a job at SpaceX', time: '8:02 pm' },
    { initials: 'ED', name: 'Emily Dorson', message: 'Table for four, 5PM. Be there.', time: '7:42 am' },
    { initials: 'OC', name: 'Office Chat', message: "Lewis: All done mate", time: '7:08 am' },
    { initials: 'LS', name: 'Little Sister', message: 'Tell mom I will be home for tea', time: 'Wed' },
  ];

  // Sample chat messages
  const messages = [
    { text: 'OMG DO YOU REMEMBER WHAT YOU DID LAST NIGHT AT THE WORK NIGHT OUT?', time: '8:12', sender: 'other' },
    { text: 'no haha', time: '18:16', sender: 'user' },
    { text: 'I don’t remember anything', time: '18:16', sender: 'user' },
  ];

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
          {contacts.map((contact, index) => (
            <div
              key={index}
              className={`p-4 flex items-center border-b border-gray-200 hover:bg-gray-100 cursor-pointer ${
                contact.active ? 'bg-blue-50' : ''
              }`}
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                {contact.initials}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h2 className="font-semibold">{contact.name}</h2>
                  <span className="text-sm text-gray-500">{contact.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{contact.message}</p>
              </div>
              {contact.unread && (
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                  {contact.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-3/4 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold mr-3">
            DM
          </div>
          <h2 className="font-semibold">David Moore</h2>
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
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Message"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="ml-2 p-2 text-blue-600 hover:text-blue-800">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;