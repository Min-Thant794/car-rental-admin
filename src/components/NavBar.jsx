import React from 'react'
import { NavLink } from 'react-router-dom';
import {routes} from '../config/Routes'
import { useUser } from '../context/UserContext';
import Logo from '../assets/logo.png'

const NavBar = () => {

  const {logout} = useUser();
  const navRoutes = routes.find((route) => route.children);

  return (
    <div className='bg-[#a4a4a4] flex flex-col justify-between w-full'>
      <div className='flex flex-col py-5 gap-10'>
        <div>
          <img src={Logo} alt="" 
          className='px-4'
          />
        </div>
        <div className='flex flex-col gap-3'>
          {
            navRoutes?.children.filter((child) => child.name).map((child) => {
              return <NavLink
              key={child?.name}
              to={child?.path}
              className={({isActive}) => `${isActive ? "bg-[#434343] text-amber-50" : "bg-[#d6d6d6]"} btn-border-reveal transition duration-300 flex items-center shadow-gray-700 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] gap-3 font-bold mx-4 px-2 py-2 rounded-lg hover:opacity-85 cursor-pointer`}>
                <div
                className='text-xl'>
                  {child?.icon}
                </div>
                <div className=''>
                  {child?.name}
                </div>
              </NavLink>
            })
          }
        </div>
      </div>
      <div 
      onClick={(e) => {
        e.preventDefault();
        logout();
      }}
      className='transition duration-300 btn-border-reveal shadow-gray-700 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] font-bold tracking-wide px-3 py-2 bg-[#393939] text-amber-50 rounded-lg my-5 mx-4 active:opacity-65 hover:opacity-85 cursor-pointer'>
        Log out
      </div>
      </div>
  )
}

export default NavBar