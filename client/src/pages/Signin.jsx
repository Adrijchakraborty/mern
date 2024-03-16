import React, { useState } from 'react'
import { Link,useNavigate } from "react-router-dom"
import {useDispatch , useSelector} from "react-redux"
import {signInStart , signInSuccess, signInFailure} from "../redux/user/userSlice"

const Signin = () => {
  const [formData, setFormData] = useState({})
  const {loading , error} = useSelector((state)=>state.user)

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      dispatch(signInStart())
      const res = await fetch('api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      if(data.success === false) {
        dispatch(signInFailure(data.message))
        return
      }
      dispatch(signInSuccess(data))
      navigate("/");
      //console.log(data)
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }
  //console.log(formData)
  return (
    <div className='max-w-lg px-3 sm:px-0 mx-auto mt-[10rem] sm:mt-20'>
      <h1 className='my-7 text-2xl sm:text-3xl text-center font-semibold'>Sign In</h1>
      <form onSubmit={handleSubmit} className=' flex flex-col gap-3 '>
        <input type="email" id="email" placeholder='email' className='border p-3 rounded-lg' onChange={handleChange} />
        <input type="password" id="password" placeholder='password' className='border p-3 rounded-lg' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-500 p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? "Loading" :"signin"}</button>
      </form>
      <div className='flex'>
        <p>Dont have account?</p>
        <Link to={"/signup"} className='text-blue-900 underline'>Signup</Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}

export default Signin