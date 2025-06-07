import React from 'react';

const UserProfile = ({ user, isVisible, onClose }) => {
  if (!user) return null;

  return (
    <div
      className={`absolute top-0 right-0 h-full w-full sm:w-2/5 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      } z-10`}
    >
      {/* Profile Header */}
      <div className="p-4 border-b border-gray-200 flex items-center" style={{height: '69px'}}>
        <button onClick={onClose} className="mr-4 text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="font-semibold text-lg">Profile</h2>
      </div>

      {/* Profile Details */}
      <div className="p-6 flex flex-col items-center">
        <div className="relative w-24 h-24 mb-4">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-white text-4xl font-semibold">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          {user.online && (
            <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-500 ring-2 ring-white"></span>
          )}
        </div>
        <h2 className="text-2xl font-bold">{user.username}</h2>
        <p className="text-gray-500">{user.email}</p>
        <p className="text-gray-600">{user.mobile}</p>

      </div>
<hr/>
    </div>
  );
};

export default UserProfile; 