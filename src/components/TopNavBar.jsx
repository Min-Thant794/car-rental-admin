import React, { useEffect, useState } from 'react';
import { useLocation, matchPath, useNavigate } from 'react-router-dom';
import {updateUserData} from "../services/user.service"
import { FaBell, FaEdit, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import { RiLogoutBoxFill } from "react-icons/ri";
import { ImProfile } from "react-icons/im";
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';

const TopNavBar = () => {

  const { userData: isUser, logout, changeUserData} = useUser();

  const [isNotification, setIsNotification] = useState(false);
  const [userDetail, setUserDetail] = useState(false);
  const [expandUserDetail, setExpandUserDetail] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [previewImg, setPreviewImg] = useState(isUser?.profileImageUrl || null);
  const [userName, setUserName] = useState(isUser?.userName || "");
  const [email, setEmail] = useState(isUser?.email || "Not Provided");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if(expandUserDetail) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }
  }, [expandUserDetail]);

  const uploadImage = (file) => {
    if(!file) return 
    setFile(file);
    const url = URL.createObjectURL(file);
    setPreviewImg(url);
  }

  const uploadNewImage = () => {
    document.getElementById("fileupload").click();
  }

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

  useEffect(() => {
    const handleClickOutside = () => {
        setUserDetail(false);
        setExpandUserDetail(false);
        setIsNotification(false);
    };

    if(userDetail || expandUserDetail || isNotification) {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [userDetail, expandUserDetail, isNotification]);


  const handleCancelEdit = () => {
    setIsEdit(false);
    setPreviewImg(isUser?.profileImageUrl || null);
    setUserName(isUser?.userName || '');
    setEmail(isUser?.email || 'Not Provided');
    setPassword('');
  }

  const handleUserUpdate = async () => {
    try {

        const hasProfileChange = Boolean(file);
        const hasUserNameChange = userName.trim() !== (isUser?.userName || "");
        const hasEmailChange = email.trim() !== (isUser?.email || "");
        const hasPasswordChange = password.trim().length > 0;

        if(!hasProfileChange && !hasUserNameChange && !hasEmailChange && !hasPasswordChange) {
            return toast.info("Validation Failed!");
        }

        if(!isUser?._id) {
            return toast.error("Unable to update profile. User ID not found.");
        }

        const formData = new FormData();
        formData.append("userName", userName);
        formData.append("email", email);

        if(hasPasswordChange) {
            formData.append("password", password.trim());
        }

        if(file) {
            formData.append("profileImageUrl", file);
        }

        const response = await updateUserData(isUser._id, formData);
        console.log("handleUserUpdate() response: ", response);

        if(response.success) {
            const updatedUser = response?.data;

            if(updatedUser) {
                changeUserData(updatedUser);
            }

            toast.success(response?.message || "Profile updated successfully");
            setIsEdit(false);
            setPassword("");
            setFile(null);
            return;
        }
    } catch (error) {
        console.error("An Error Occurred at handleUserUpdate()", error);
        toast.error("An unexpected error occurred while updating profile!");
    }

    useEffect()
  }

  return (
    <div className='flex justify-between items-center bg-[#a4a4a4] px-3 py-1'>
        <div className='p-3 font-bold tracking-wide text-2xl'>
            {currentTitle}
        </div>

        <div className='flex items-center'>
            <div
            onClick={(e) => {
                e.stopPropagation();
                toggleNotification();
                setUserDetail(false);
            }}
            className='relative'
            >
                <FaBell className='text-2xl cursor-pointer hover:opacity-80 active:opacity-65'/>
                <div 
                onClick={(e) => {
                    e.stopPropagation();
                }}
                className={`transition-all shadow-md duration-300 absolute top-13 p-3 right-0.5 rounded-lg ${isNotification ? "opacity-100 translate-y-1" : "opacity-0 -translate-y-1 pointer-events-none"} bg-[#a4a4a4]`}>
                    <div className='tracking-wide font-semibold'>
                        Notification
                    </div>
                </div>
            </div>

            <div
            onClick={(e) => {
                e.stopPropagation();
                toggleUserDetail();
                setIsNotification(false);
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
                <div className='font-bold text-lg active:opacity-60 text-left cursor-pointer pl-2 pr-5'>{isUser?.userName || 'Admin'}</div>
            </div>

            <div 
            onClick={(e) => {
                e.stopPropagation();
            }}
            className={`transition-all shadow-md duration-300 ${userDetail ? "opacity-100 translate-y-1" : "opacity-0 -translate-y-1 pointer-events-none"} flex flex-col px-3 py-3 bg-[#a4a4a4] absolute right-5 top-17 w-45 rounded-lg cursor-pointer`}>
                <div 
                onClick={(e) => {
                    e.stopPropagation();
                    setUserDetail(false);
                    setPreviewImg(isUser?.profileImageUrl || null);
                    setUserName(isUser?.userName || "");
                    setPassword("");
                    setExpandUserDetail(true);
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
                    logout();
                    navigate("/login", { replace: true });
                }}
                className='flex items-center gap-2 font-semibold tracking-wide pt-2 hover:opacity-75 active:opacity-65'>
                    <div className='text-xl'>
                        <RiLogoutBoxFill/>
                    </div>
                    <div>Logout</div>
                </div>
            </div>

            {
                expandUserDetail &&
                <div 
                onClick={() => {
                    setExpandUserDetail(false)
                    handleCancelEdit();
                }}
                className='fixed shadow-md inset-0 flex items-center justify-center bg-black/20 z-50'>
                    <div 
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className='bg-[#434343] p-5 w-4/9 z-50 rounded-lg'>
                        <div className='flex justify-between items-center font-bold tracking-wide text-xl text-amber-50'>
                            <div>
                                Profile Details
                            </div>
                            <div 
                            onClick={() => {
                                setExpandUserDetail(false)
                                handleCancelEdit();
                            }}
                            className='transition duration-300 text-2xl font-bold cursor-pointer active:opacity-65 hover:opacity-80'>
                                <IoClose
                                />
                            </div>
                        </div>
                        <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUserUpdate();
                        }}
                        className='flex gap-3 pt-5 text-amber-50'>
                            <div className='relative flex w-2/5'>
                                <img src={previewImg || isUser?.profileImageUrl} alt="Profile Image" className='rounded-sm w-full h-62 object-cover'/>
                                {
                                    isEdit &&
                                    <div 
                                    onClick={uploadNewImage}
                                    className='transition duration-300 absolute flex items-center active:opacity-65 hover:opacity-80 cursor-pointer gap-2 px-2 py-1 rounded-md bottom-3 bg-[#a4a4a4] right-10'>
                                        <FaEdit/>
                                        <div className='font-semibold'>
                                            upload
                                        </div>
                                    </div>
                                }
                                <input 
                                type="file" 
                                multiple={false} 
                                accept='image/*' 
                                id='fileupload' 
                                className='hidden'
                                onChange={(e) => uploadImage(e.target.files[0])} />
                            </div>
                            <div className='flex flex-col w-3/5'>
                                <div className='flex w-full'>
                                    <label 
                                    htmlFor='userName'
                                    className='font-bold tracking-wide w-2/7'>
                                        Username: 
                                    </label>
                                    <input 
                                    type="text" 
                                    id='userName' 
                                    value={userName}
                                    readOnly={!isEdit}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className='col-span-4 font-semibold tracking-wide w-5/7 outline-none border-none' />
                                </div>
                                <div className='flex pt-1 w-full'>
                                    <label 
                                    htmlFor='email'
                                    className='col-span-3 font-bold tracking-wide w-2/7'>
                                        Email Address: 
                                    </label>
                                    <input 
                                    type="text" 
                                    id='email' 
                                    value={email}
                                    readOnly={!isEdit}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='col-span-4 font-semibold tracking-wide w-5/7 outline-none border-none' />
                                </div>
                                <div className='flex pt-1 w-full'>
                                    <label 
                                    htmlFor='password'
                                    className='font-bold tracking-wide w-2/7'>
                                        Password:
                                    </label>
                                    <div className='flex justify-between w-5/7 items-center col-span-4'>
                                        <input 
                                        type={showPassword ? "text" : "password"}
                                        id='password' 
                                        value={password}
                                        readOnly={!isEdit}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder='•••••••••'
                                        className='font-semibold tracking-wide outline-none border-none w-8/10' />
                                        {
                                            isEdit &&
                                            <div className='w-2/10'>
                                                {
                                                    showPassword ? 
                                                    <FaEye 
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className='cursor-pointer active:opacity-65'/>
                                                    :
                                                    <FaEyeSlash 
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className='cursor-pointer active:opacity-65'/>
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className='flex pt-1 w-full'>
                                    <div className='font-bold tracking-wide w-2/7'>
                                        Account Status: 
                                    </div>
                                    <div className='font-semibold tracking-wide w-5/7'>
                                        {isUser.accountStatus}
                                    </div>
                                </div>
                                <div className='flex pt-1 w-full'>
                                    <div className='font-bold tracking-wide w-2/7'>
                                        Created At: 
                                    </div>
                                    <div className='font-semibold tracking-wide w-5/7'>
                                        {isUser.createdAt.slice(0, 10)}
                                    </div>
                                </div>
                                <div className='flex pt-1 w-full'>
                                    <div className='font-bold tracking-wide w-2/7'>
                                        Updated At: 
                                    </div>
                                    <div className='font-semibold tracking-wide w-5/7'>
                                        {isUser.updatedAt.slice(0, 10)}
                                    </div>
                                </div>
                                <div className='relative w-full'>
                                    <div 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEdit(true);
                                    }}
                                    className={`${isEdit && "opacity-0 pointer-events-none"} transition duration-300 hover:opacity-65 active:opacity-80 px-3 py-2 text-center cursor-pointer w-3/10 mt-5 bg-[#a4a4a4] font-bold tracking-wide rounded-md`}>
                                        Edit
                                    </div>
                                    {
                                        isEdit &&
                                        <div className='absolute bottom-0.5 w-full flex gap-5'>
                                            <div 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCancelEdit();
                                            }}
                                            className='transition duration-300 active:opacity-65 hover:opacity-80 px-3 py-2 text-center cursor-pointer w-3/10 mt-5 bg-[#ff0000] font-bold tracking-wide rounded-md'>
                                            Cancel
                                            </div>
                                            <button
                                            onClick={() => {
                                                setIsEdit(false);
                                                handleUserUpdate();
                                            }}
                                            className='transition duration-300 active:opacity-65 hover:opacity-80 px-3 py-2 text-center cursor-pointer w-3/10 mt-5 bg-[#a4a4a4] font-bold tracking-wide rounded-md'>
                                                Update
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </div>
    </div>
  )
}

export default TopNavBar
