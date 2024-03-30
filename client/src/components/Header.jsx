import React from 'react'
import Search from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'

const Header = () => {
    const { currentUser } = useSelector((state) => state.user)
    return (
        <div className='flex justify-between items-center px-8 bg-zinc-200 py-3'>
            <div className='font-bold text-lg sm:text-xl capitalize'>
                <Link to={"/"}>
                    <span className='text-slate-500 capitalize'>Sahand</span>
                    <span className='text-slate-700 capitalize'>Estate</span>
                </Link>

            </div>

            <form className=' flex items-center justify-center gap-1 sm:gap-3'>
                <input type="search" placeholder='Search...' className='bg-slate-100 focus:outline-none px-2 py-2 rounded-lg w-[96px] sm:w-fit' />
                <Search className='text-slate-700 cursor-pointer' />
            </form>

            <div className='flex gap-3'>
                {["home", "about", "profile"].map((item, index) => {
                    return (
                        <Link to={index === 0 ? `/` : `/${item}`} key={index} className={`${index === 2 ? "inline" : "hidden"} sm:inline capitalize cursor-pointer font-sans hover:underline`}>
                            {index === 2 ? <p>{currentUser ? <img className='w-7 h-7 border-2 border-slate-500 rounded-full object-contain' src={currentUser.avatar} alt="Image" /> : 'Sign In'}</p> : <p>{item}</p>}
                        </Link>
                    )
                })}
            </div>

        </div>
    )
}

export default Header