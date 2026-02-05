import React, { useState } from 'react'
import loginVideo from '../assets/loginVideo.mp4';
import { useUser } from '../context/UserContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosInstance';
import { API_ROUTES } from '../config/config';

const Login = () => {
  
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            if(userName.trim() === "") {
                return alert("Please Enter Username!");
            }

            if(password.trim() === "") {
                return alert("Please Enter Password!");
            }

            const response = await axiosInstance.post(API_ROUTES.ADMIN_LOGIN,
                {
                userName: userName,
                password: password
            });

            console.log("response: ", response.data.message);

            if(response.data.success) {
                navigate("/dashboard");
            }
            
        } catch (error) {
            console.log("An Error Occurred!", error);
        }
    }

  return (
    <div className='flex justify-center items-center h-screen bg-[#434343]'>
        <div className='flex w-3/5 items-stretch bg-[#d6d6d6]/10 rounded-lg shadow-xl h-420px overflow-hidden'>
            <div className='w-1/2 relative'>
                <video src={loginVideo}
                    autoPlay
                    loop
                    muted
                    className='absolute inset-0 w-full h-full object-cover'
                />
            </div>
            <form action="" 
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            className='flex flex-col w-1/2 py-20 gap-2 px-20'>
                <div className='text-2xl font-bold text-amber-50'>
                    Welcome Back!
                </div>
                <div className='text-lg font-bold pb-5 text-amber-50'>
                    Sign Up To Get Started
                </div>
                <div className='flex flex-col w-full pb-5'>
                    <label htmlFor="username" className='w-full font-semibold text-amber-50'>Username</label>
                    <input type="text" id='username' value={userName} 
                    placeholder='Enter Your Username' 
                    onChange={(e) => setUserName(e.target.value)}
                    className='rounded-md text-amber-50 placeholder:font-semibold'/>
                </div>
                <div className='flex flex-col w-full'>
                    <label htmlFor="password" className='w-full font-semibold text-amber-50'>Password</label>
                    <div className='flex  items-center w-full'>
                        <input type={isShowPassword ? 'text' : 'password'} 
                        id='password'
                        value={password}
                        placeholder='Enter Your Password' 
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-9/10 border-none outline-none text-amber-50 placeholder:font-semibold' />
                        <div className='flex items-center justify-center w-1/10 cursor-pointer active:opacity-60'>
                            {
                                isShowPassword ?
                                <FaEye onClick={() => setIsShowPassword(!isShowPassword)} className='text-amber-50'/>
                                :
                                <FaEyeSlash  onClick={() => setIsShowPassword(!isShowPassword)} className='text-amber-50'/>
                            }
                        </div>
                    </div>
                </div>
                <button className='w-full bg-[#222222] text-center py-2 cursor-pointer rounded-md font-bold text-amber-50 tracking-wider mt-5'>
                    Login
                </button>
            </form>
        </div>
    </div>
  )
}

export default Login