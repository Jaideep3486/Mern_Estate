import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      uploadImage(file);
    }
  }, [file]);

  const uploadImage = async (file) => {
    try {
      setFileUploadError(false);
      setFilePerc(0);

      // validations (same as Firebase rules)
      if (!file.type.startsWith('image/')) {
        throw new Error('Only images allowed');
      }
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Image must be less than 2MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser._id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // ---- signed upload URL (required for progress) ----
      const { data: signedData, error: signedError } = await supabase.storage
        .from('MERNESTATE')
        .createSignedUploadUrl(filePath);

      if (signedError) throw signedError;

      // ---- manual upload to track progress ----
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedData.signedUrl);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setFilePerc(progress);
          }
        };

        xhr.onload = () => resolve();
        xhr.onerror = () => reject(new Error('Upload failed'));

        xhr.send(file);
      });

      // ---- public URL ----
      const { data } = supabase.storage
        .from('MERNESTATE')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, avatar: data.publicUrl }));
    } catch (err) {
      console.error(err);
      setFileUploadError(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // dispatch update profile action
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      // Optionally, you can reset the form or provide further feedback to the user here
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          hidden
          ref={fileRef}
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">Uploading {filePerc}%</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          name="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="email"
          id="email"
          name="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          name="password"
          onChange={handleChange}
          id="password"
          className="border p-3 rounded-lg"
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-3">{error ? error : ''}</p>
      <p className="text-green-700 mt-3">
        {updateSuccess ? 'Profile updated successfully!' : ''}
      </p>
    </div>
  );
}
