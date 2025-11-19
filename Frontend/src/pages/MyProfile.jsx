// src/Pages/Profile/MyProfile.jsx
import React, { useEffect, useState } from "react";
import { User2 } from "lucide-react"; // optional icon for avatar

const MyProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg font-medium">
        No user data found. Please log in.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 px-5 bg-gray-100">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md border border-gray-200 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md mb-3">
            <User2 className="w-12 h-12 text-yellow-500" />
          </div>
          <h1 className="text-white text-xl font-bold">{user.name}</h1>
          <p className="text-yellow-100 mt-1 text-sm">{user.email}</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {user.phone && (
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
              <span className="text-gray-600 font-medium">Phone:</span>
              <span className="text-gray-900">{user.phone}</span>
            </div>
          )}

          {user.isAdmin && (
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
              <span className="text-gray-600 font-medium">Role:</span>
              <span className="text-gray-900">Admin</span>
            </div>
          )}

          {/* Placeholder for future info */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
            <span className="text-gray-600 font-medium">Joined:</span>
            <span className="text-gray-900">
              {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
