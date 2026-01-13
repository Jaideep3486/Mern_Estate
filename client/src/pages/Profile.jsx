import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form className="flex flex-col gap-4">
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
          value={currentUser.username}
          readOnly
          className="border p-3 rounded-lg"
        />

        <input
          type="email"
          value={currentUser.email}
          readOnly
          className="border p-3 rounded-lg"
        />

        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
        />

        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95">
          update
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
