import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { IoCartOutline, IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";

import { Input } from './ui/input';
import { Button } from './ui/button';
import Marquee from "react-fast-marquee";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const getprofile = useUserStore((state) => state.getprofile);

  useEffect(() => {
    getprofile();
  }, [getprofile]);

  return (
    <nav className='z-50 sticky top-0 w-full bg-[#fcfbf7] border-b border-gray-100 shadow-sm'>
      {/* Top Announcement Bar */}
      <Marquee speed={60} gradient={false} className='h-9 bg-black text-white text-xs font-medium uppercase tracking-widest'>
        <span className="mx-10">👟 Step into Style: New Arrivals Drop Every Friday!</span>
        <span className="mx-10">🔥 Free Delivery on orders above ₹1,999!</span>
        <span className="mx-10">👟 SOLESPHERE Member Exclusive: Extra 10% OFF</span>
      </Marquee>

      <div className='max-w-8xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16 md:h-16'>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-2xl">
              {isMenuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
            </button>
          </div>

          {/* Left: Search (Desktop Only) */}
          <div className='hidden md:flex items-center bg-gray-100 rounded-full px-4 py- w-64 focus-within:ring-1 ring-gray-300 transition-all'>
            <IoIosSearch className='text-gray-500 text-lg' />
            <Input 
              className='bg-transparent border-0 focus-visible:ring-0 placeholder:text-gray-400 text-sm' 
              placeholder='Search sneakers...' 
            />
          </div>

          {/* Center: Brand Logo */}
          <Link to="/" className='flex flex-col items-center group'>
            <span className='font-[Montserrat] text-xl md:text-2xl font-black tracking-tighter transition-colors'>
              SOLESPHERE
            </span>
            <div className="h-0.5 w-0 group-hover:w-full bg-black transition-all duration-300"></div>
          </Link>

          {/* Right: Actions */}
          <div className='flex items-center gap-2 md:gap-5'>
            {/* Desktop Auth Links */}
            {!user && (
              <div className='hidden md:flex items-center gap-4 text-sm font-medium'>
                <Link to="/login" className='hover:text-gray-600 transition'>Login</Link>
                <Link to="/signup">
                  <Button variant="outline" className="rounded-full px-6 border-black hover:bg-black hover:text-white transition-all">
                    Join Us
                  </Button>
                </Link>
              </div>
            )}

            {/* Icons Section */}
            <div className='flex items-center gap-3'>
              {user && (
                <Link to="/profile">
                  
                </Link>
              )}
              
              <Link to="/cart" className="relative p-2">
                <IoCartOutline className='text-2xl md:text-2xl' />
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </Link>

              {user?.role === 'admin' && (
                <Link to="/dashboard" className="hidden lg:block">
                  <Button size="sm" className="bg-black text-white hover:bg-gray-800 rounded-md">
                    Admin
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Expandable) */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#fcfbf7] border-t px-4 py-6 space-y-4 animate-in slide-in-from-top duration-300">
          <div className='flex items-center bg-gray-100 rounded-lg px-3 py-1'>
            <IoIosSearch className='text-gray-500' />
            <Input className='bg-transparent border-0 focus-visible:ring-0' placeholder='Search...' />
          </div>
          <div className="flex flex-col gap-4 font-semibold uppercase tracking-tight">
            <Link to="/category/shoes" onClick={() => setIsMenuOpen(false)}>All Footwear</Link>
            <Link to="/category/new-arrivals" onClick={() => setIsMenuOpen(false)}>New Arrivals</Link>
            {!user && (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </>
            )}
            {user?.role === 'admin' && <Link to="/dashboard">Admin Dashboard</Link>}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;