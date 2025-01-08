import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from "../assets/logo.jpg";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className='bg-slate-200 shadow-md sticky top-0 z-50'>
      <div className='flex justify-between items-center max-w-6xl mx-auto px-4 py-3'>
        {/* Left Section: Logo and Title */}
        <Link to='/' className='flex items-center gap-3'>
          <img
            src={logo}
            alt='UrbanNiwas Logo'
            className='h-10 w-10 sm:h-12 sm:w-12 rounded-full p-1'
          />
          <h1 className='font-bold text-sm sm:text-xl'>
            <span className='text-slate-500'>Urban</span>
            <span className='text-slate-700'>Niwas</span>
          </h1>
        </Link>

        {/* Middle Section: Search Bar */}
        <form className='hidden lg:flex bg-slate-100 p-2 rounded-lg items-center w-2/5 justify-center'>
          <input
            type='text'
            className='bg-transparent focus:outline-none w-full text-sm placeholder-slate-400'
            placeholder='Search...'
          />
          <FaSearch className='text-slate-600 ml-2' />
        </form>

        {/* Right Section: Navigation Links */}
        <div className='hidden lg:flex items-center space-x-6'>
          <Link to='/' className='text-slate-700 hover:underline text-sm sm:text-base'>
            Home
          </Link>
          <Link to='/about' className='text-slate-700 hover:underline text-sm sm:text-base'>
            About
          </Link>
          <Link to='/sign-in' className='text-slate-700 hover:underline text-sm sm:text-base'>
            Sign in
          </Link>
          <Link to='/sign-up' className='text-slate-700 hover:underline text-sm sm:text-base'>
            Sign up
          </Link>
        </div>

        {/* Toggle Button for Mobile */}
        <button
          className='lg:hidden text-slate-700 text-xl'
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <ul className='lg:hidden flex flex-col items-center bg-slate-200 p-4 space-y-2'>
          <Link to='/'>
            <li className='text-slate-700 hover:underline text-sm sm:text-base'>Home</li>
          </Link>
          <Link to='/about'>
            <li className='text-slate-700 hover:underline text-sm sm:text-base'>About</li>
          </Link>
          <Link to='/sign-in'>
            <li className='text-slate-700 hover:underline text-sm sm:text-base'>Sign in</li>
          </Link>
          <Link to='/sign-up'>
            <li className='text-slate-700 hover:underline text-sm sm:text-base'>Sign up</li>
          </Link>
        </ul>
      )}
    </header>
  );
}
