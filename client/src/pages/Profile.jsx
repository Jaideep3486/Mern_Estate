import React from 'react';
import { useSelector } from 'react-redux';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser?.avatar || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover cursor-pointer self-center"
        />
        <input
          type="text"
          placeholder="username"
          id="usename"
          value={currentUser?.username || ''}
          readOnly
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          value={currentUser?.email || ''}
          readOnly
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          // value={currentUser?.password || ''}
          //readOnly
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-6 ">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
