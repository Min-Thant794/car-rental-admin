import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'
import TopNavBar from '../components/TopNavBar'

const MainLayout = () => {
  return (
    <div className='flex scroll-smooth bg-[#d6d6d6]'>
      <div className='flex sticky top-0 w-3/20 h-screen text-center'>
        <NavBar/>
      </div>
      <div className='flex flex-col w-full'>
        <div className='top-0 sticky z-50'>
          <TopNavBar/>
        </div>
        <div className='p-3'>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default MainLayout