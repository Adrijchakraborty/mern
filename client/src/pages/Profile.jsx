import React from 'react'
import {  useSelector } from 'react-redux'

const Profile = () => {
  const {currentUser}  = useSelector(state=>state.user);
  return (
    <div className='px-3 sm:px-0'>
      <h1 className='text-center text-3xl font-semi-bold my-5'>Profile</h1>
      <form className='flex flex-col max-w-lg gap-4 mx-auto'>
        <img src={currentUser.avatar} alt="Profile" className='w-24 rounded-full border-2 self-center'/>
        <input type="text" placeholder='username' className='p-3 rounded-lg'/>
        <input type="email" placeholder='email' className='p-3 rounded-lg'/>
        <input type="password" placeholder='password' className='p-3 rounded-lg'/>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-85'>update</button>
      </form>
      <div className='capitalize flex justify-between my-2'>
        <span className='text-red-700'>delete account</span>
        <span className='text-red-700'>sign out</span>
      </div>
    </div>
  )
}

export default Profile