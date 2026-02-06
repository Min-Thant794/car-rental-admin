import React, { useState } from 'react';
import { useLocation, matchPath, useNavigate } from 'react-router-dom';
import { FaBell, FaUser } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import { IoIosSettings } from "react-icons/io";
import { RiLogoutBoxFill } from "react-icons/ri";
import { ImProfile } from "react-icons/im";

const TopNavBar = () => {

  const { userData: isUser, logout, isLoading } = useUser();

  const [isNotification, setIsNotification] = useState(false);
  const [userDetail, setUserDetail] = useState(false);

  const {pathname} = useLocation();

  const routeTitles = [
    {path: "/car", title: "Car"},
    {path: "/booking", title: "Booking"},
    {path: "/manage-users", title: "Manage Users"},
    {path: "/settings", title: "Settings"},
    {path: "/dashboard", title: "Dashboard"},
  ];
  const currentRoute = routeTitles.find((r) => 
    matchPath({ path: r.path, end: false}, pathname)
  );
  const currentTitle = currentRoute?.title || "Dashboard"

  const toggleNotification = () => {
    setIsNotification(!isNotification);
  };

  const toggleUserDetail = () => {
    setUserDetail(!userDetail);
  }

  const navigate = useNavigate();

  return (
    <div className='flex justify-between items-center bg-[#a4a4a4] px-3 py-1'>
        <div className='p-3 font-bold tracking-wide text-2xl'>
            {currentTitle}
        </div>
        <div className='flex items-center'>
            <div>
                <FaBell
                onClick={(e) => {
                    e.stopPropagation();
                    toggleNotification();
                }}
                className='text-2xl cursor-pointer hover:opacity-80 active:opacity-65'
                />
                {
                    isNotification &&
                    <div>
                        hello
                    </div>
                }
            </div>
            <div
            onClick={(e) => {
                e.stopPropagation();
                toggleUserDetail();
            }}
            className='flex relative justify-center gap-2 items-center cursor-pointer active:opacity-60 hover:opacity-80'>
                <div className='flex items-center justify-center p-3'>
                        {
                            isUser?.profileImageUrl ? (
                                <img
                                src={isUser.profileImageUrl}
                                alt= "Profile Icon"
                                className='active:opacity-65 w-7.5 h-7.5 rounded-full cursor-pointer object-cover'
                                />
                            )
                            :
                            <div className='w-7.5 h-7.5'>
                                <FaUser/>
                            </div>
                        }
                </div>
                <div className='font-bold text-lg active:opacity-60 cursor-pointer px-3'>{isUser?.userName || 'Admin'}</div>
            </div>
            <div className={`transition-all duration-300 ${userDetail ? "opacity-100 translate-y-1" : "opacity-0 -translate-y-1 pointer-events-none"} flex flex-col px-3 py-3 bg-[#a4a4a4] absolute right-5 top-17 p-2 w-40 rounded-lg cursor-pointer`}>
                <div 
                onClick={(e) => {
                    e.stopPropagation();
                    setUserDetail(false)
                }}
                className='flex items-center gap-2 font-semibold tracking-wide pt-1 pb-2 border-b-2 border-b-amber-50 hover:opacity-75 active:opacity-65'>
                    <div className='text-xl'>
                        <ImProfile />
                    </div>
                    <div>Profile Details</div>
                </div>
                <div 
                onClick={(e) => {
                    e.stopPropagation();
                    setUserDetail(false);
                    navigate("/settings");
                }}
                className='flex items-center gap-2 font-semibold tracking-wide py-2 border-b-2 border-b-amber-50 hover:opacity-75 active:opacity-65'>
                    <div className='text-xl'>
                        <IoIosSettings/>
                    </div>
                    <div>Settings</div>
                </div>
                <div 
                onClick={async (e) => {
                    e.stopPropagation();
                    setUserDetail(false);
                    await logout();
                    navigate("/login");
                }}
                className='flex items-center gap-2 font-semibold tracking-wide pt-2 hover:opacity-75 active:opacity-65'>
                    <div className='text-xl'>
                        <RiLogoutBoxFill/>
                    </div>
                    <div>Logout</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TopNavBar