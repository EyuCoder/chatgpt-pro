import React from 'react'
import { auth } from '../firebase'
import { FcGoogle } from 'react-icons/fc'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const SignIn = () => {

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  return (
    <div className='signin'>
      <div className='signin__container'>
        <button className="signin__btn flex items-center justify-center" onClick={signInWithGoogle}>
          <FcGoogle className='m-2' />
          Sign in with Google
        </button>

        <p className='signin__tos'>Do not violate the community guidelines or you will be banned for life!</p>
      </div>
    </div>
  )
}

export default SignIn