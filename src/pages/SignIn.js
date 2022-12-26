import React from 'react'
import { auth } from '../firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const SignIn = () => {

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  return (
    <div className='signin'>
      <button className="signin__btn" onClick={signInWithGoogle}>Sign in with Google</button>
      <p className='signin__tos'>Do not violate the community guidelines or you will be banned for life!</p>
    </div>
  )
}

export default SignIn