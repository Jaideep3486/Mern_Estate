import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      // const user = result.user;
      //console.log(result);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          uid: result.user.uid,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="w-full bg-red-600 text-white p-3 rounded-lg mt-4 hover:bg-red-700 transition duration-150 ease-in-out flex justify-center items-center gap-3 uppercase"
    >
      Continue with Google
    </button>
  );
}
