import React from 'react'
import {Link} from "react-router-dom"

const Signout = () => {
  return (
    <div className='max-w-lg px-3 sm:px-0 mx-auto mt-[10rem] sm:mt-20'>
      <h1 className='my-7 text-2xl sm:text-3xl text-center font-semibold'>Sign Up</h1>
      <form className=' flex flex-col gap-3 '>
        <input type="text" id="text" placeholder='username'className='border p-3 rounded-lg'/>
        <input type="email" id="email" placeholder='email'className='border p-3 rounded-lg'/>
        <input type="password" id="password" placeholder='password'className='border p-3 rounded-lg'/>
        <button className='bg-slate-500 p-3 rounded-lg uppercase hover:opacity-95'>signup</button>
      </form>
      <div className='flex'>
      <p>Already have account?</p>
      <Link to={"/signin"} className='text-blue-900 underline'>Signin</Link>
      </div>
    </div>
  )
}

export default Signout