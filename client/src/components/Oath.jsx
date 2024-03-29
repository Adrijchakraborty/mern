import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { app } from '../Firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import {useNavigate} from 'react-router-dom'

const Oath = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogle = async () => {
        try {
            const Provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, Provider)
            const res = await fetch('api/auth/google', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                })
            })
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            console.log("could not sign in with google", error);
        }
    }

    return (
        <button onClick={handleGoogle} type='button' className='bg-red-700 py-3 rounded-lg text-white uppercase hover:opacity-95'>Continue with google</button>
    )
}

export default Oath