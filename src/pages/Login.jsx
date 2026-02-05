import React, { useState } from 'react'
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

  return (
    <>
        <div className='flex w-1/2 justify-center items-center bg-red-700'>
            <div className='w-1/2'>
                video
            </div>
            <form action="" className='w-1/2'>
                <div>
                    Welcome Back!
                </div>
                <div>
                    Sign Up To Get Started!
                </div>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" placeholder='Enter Your Username' />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <div>
                        {
                            isShowPassword ?
                            <FaEye onClick={() => setIsShowPassword(!isShowPassword)}/>
                            :
                            <FaEyeSlash  onClick={() => setIsShowPassword(!isShowPassword)}/>
                        }
                    </div>
                </div>
            </form>
        </div>
    </>
  )
}

export default Login