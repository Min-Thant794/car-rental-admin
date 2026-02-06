import React, { useState } from 'react'
import loginVideo from '../assets/loginVideo.mp4';
import { useUser } from '../context/UserContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosInstance';
import { API_ROUTES } from '../config/config';
import { toast } from 'react-toastify';

const Login = () => {
  
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [errorUserNameMsg, setErrorUserNameMsg] = useState('');
    const [errorPasswordMsg, setErrorPasswordMsg] = useState('');

    const navigate = useNavigate();
    const { changeUserData } = useUser();

    const handleSubmit = async () => {
        if(isLoading) return;
        setIsLoading(true);
        try {
            if(userName.trim() === "") {
                return setErrorUserNameMsg("Please Enter Username");
            }

            if(password.trim() === "") {
                return setErrorPasswordMsg("Please Enter Password");
            }

            const response = await axiosInstance.post(API_ROUTES.ADMIN_LOGIN,
                {
                userName: userName,
                password: password
            });

            console.log("response: ", response.data.message);

            if(response.data.success) {
                try {
                    const userResponse = await axiosInstance.get(API_ROUTES.GET_AUTH_USER);
                    const payload = userResponse?.data;
                    const user = payload?.data?.user ?? payload?.user ?? null;

                    changeUserData(user && !Array.isArray(user) ? user : null);
                } catch (error) {
                    
                }
                navigate("/dashboard");
                toast.success(response.data.message);
            }
            
        } catch (error) {
            const message = error?.response?.data?.message || "Wrong Credentials";
            toast.error(message);
            console.error("An Error Occurred!", error);
        } finally {
            setIsLoading(false);
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
                    Sign in to continue
                </div>
                <div className='flex flex-col w-full pb-5'>
                    <label htmlFor="username" className='w-full font-semibold text-amber-50'>Username</label>
                    <input required type="text" id='username' value={userName} 
                    autoComplete='username'
                    placeholder='Enter Your Username' 
                    onChange={(e) => setUserName(e.target.value)}
                    className='rounded-md text-amber-50 placeholder:font-semibold  border-none outline-none'/>

                    {errorUserNameMsg && <p className="text-red-300 text-sm">{errorUserNameMsg}</p>}
                </div>
                <div className='flex flex-col w-full'>
                    <label htmlFor="password" className='w-full font-semibold text-amber-50'>Password</label>
                    <div className='flex  items-center w-full'>
                        <input type={isShowPassword ? 'text' : 'password'} 
                        autoComplete='current-password'
                        required
                        id='password'
                        value={password}
                        placeholder='Enter Your Password' 
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-9/10 border-none outline-none text-amber-50 placeholder:font-semibold' />
                        <div
                        type="button"
                        onClick={() => setIsShowPassword(!isShowPassword)}
                        className='flex items-center justify-center w-1/10 cursor-pointer active:opacity-60'>
                            {
                                isShowPassword ?
                                <FaEye className='text-amber-50'/>
                                :
                                <FaEyeSlash className='text-amber-50'/>
                            }
                        </div>
                    </div>
                    {errorPasswordMsg && <p className="text-red-300 text-sm">{errorPasswordMsg}</p>}
                </div>
                <button 
                type='submit'
                disabled={isLoading}
                className='w-full bg-[#222222] text-center py-2 cursor-pointer rounded-md font-bold active:opacity-65 text-amber-50 tracking-wider mt-5'>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    </div>
  )
}

export default Login