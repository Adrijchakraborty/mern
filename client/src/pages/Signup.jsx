import React, { useState } from 'react'
import { Link } from "react-router-dom"

const Signout = () => {
  const [formData, setFormData] = useState({})
  const [Error, setError] = useState(null)
  const [loading, setLoading] = useState(false)


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await fetch('api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      if(data.success === false) {
        setError(data.message);
        setLoading(false);
        return
      }
      setLoading(false);
      setError(null)
      //console.log(data)
    } catch (error) {

    }
  }
  //console.log(formData)
  return (
    <div className='max-w-lg px-3 sm:px-0 mx-auto mt-[10rem] sm:mt-20'>
      <h1 className='my-7 text-2xl sm:text-3xl text-center font-semibold'>Sign Up</h1>
      <form onSubmit={handleSubmit} className=' flex flex-col gap-3 '>
        <input type="text" id="username" placeholder='username' className='border p-3 rounded-lg' onChange={handleChange} />
        <input type="email" id="email" placeholder='email' className='border p-3 rounded-lg' onChange={handleChange} />
        <input type="password" id="password" placeholder='password' className='border p-3 rounded-lg' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-500 p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? "Loading" :"signup"}</button>
      </form>
      <div className='flex'>
        <p>Already have account?</p>
        <Link to={"/signin"} className='text-blue-900 underline'>Signin</Link>
      </div>
      {Error && <p className='text-red-500'>{Error}</p>}
    </div>
  )
}

export default Signout