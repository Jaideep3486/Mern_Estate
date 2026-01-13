//import { React, useState } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useRef, useEffect } from 'react';
//import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
//import { app } from '../firebase';
import { supabase } from '../supabase';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileInputRef = useRef(null);
  const [file, setFile] = React.useState(undefined);
  //const [setUploading] = useState(false);

  console.log(file);

  // const handleFileUpload = (file) => {
  //   // const storage = getStorage(app);
  //   const filename = new Date().getTime() + file.name;
  //   //const storageRef = ref(storage, filename);

  //   // Upload the file and metadata
  //   // const uploadTask = uploadBytesResumable(storageRef, file);
  //   // uploadTask.on(
  //   //   'state_changed',
  //   //   (snapshot) => {
  //   //     // Observe state change events such as progress, pause, and resume
  //   //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //   //     const progress =
  //   //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //   //     console.log('Upload is ' + progress + '% done');
  //     },
  //     (error) => {
  //       // Handle unsuccessful uploads
  //       console.error('Upload failed:', error);
  //     },
  //     () => {
  //       // Handle successful uploads on complete
  //       console.log('Upload successful!');
  //     }
  //   );
  // };
  const handleFileUpload = async (file) => {
    if (!file) return;

    try {
      // setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser._id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage
        .from('MERNESTATE')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      // Get public URL

      const { data } = supabase.storage
        .from('MERNESTATE')
        .getPublicUrl(filePath);

      console.log('Upload successful!');
      console.log('Public URL:', data.publicUrl);
      //console.log('Uploaded path:', data?.path);

      // 👉 Save this URL to your user profile in DB
    } catch (error) {
      console.error('Upload failed:', error.message);
    } finally {
      //setUploading(false);
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileInputRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileInputRef.current.click()}
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
