import React, { useEffect, useState } from 'react'
import {getAllUser} from '../services/user.service';
import { toast } from 'react-toastify';
import UserDetails from "./UserDetails"

const DisplayUser = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [isClick, setIsClick] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  console.log("isClick: ", isClick);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUser();

      if(response.success) {
        const fetchedData = response?.data || [];
        setAllUsers(fetchedData);
        toast.success(response?.message);
      }
    } catch (error) {
      console.log("An Error Occurred at fetchUsers()", error);
      return;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  if(isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div 
      onClick={(e) => {
        e.stopPropagation();
        setIsClick(true);
      }}
      className='grid grid-cols-4 gap-3 pt-5 cursor-pointer'>
        {
          allUsers.map((u) => (
            <div 
            key={u._id}
            onClick={(e) => {
              setSelectedUserId(u._id);
            }}
            className='grid grid-cols-5 hover:bg-[#434343] transition hover:-translate-y-1 hover:rounded-full hover:text-amber-50 duration-500 shadow-lg justify-center items-center rounded-full px-1 bg-[#a4a4a4]'>
              <div className='col-span-1'>
                <img
                src={u.profileImageUrl}
                className='rounded-full w-16 h-16 object-fit'
                />
              </div>
              <div className='px-2 col-span-4 w-full'>
                <div className='grid grid-cols-5 gap-3'>
                  <div className='font-semibold'>
                    Name: 
                  </div>
                  <div className='col-span-4 pr-1'>
                    {u.userName}
                  </div>
                </div>
                <div className='grid grid-cols-5 gap-3'>
                  <div className='font-semibold'>
                    Email:
                  </div>
                  <div className='col-span-4'>
                    {u.email}
                  </div>
                </div>
                <div className='grid grid-cols-5 gap-3'>
                  <div className='font-semibold'>
                    Role:
                  </div>
                  <div className='col-span-4'>
                    {u.role}
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
      {
        isClick &&
        <div 
        onClick={(e) => {
          e.stopPropagation();
          if(!isLoading) {
            setIsClick(false);
            setSelectedUserId(null);
          }
        }}
        className='fixed shadow-md inset-0 flex items-center justify-center bg-black/10 z-30'>
          <UserDetails userId={selectedUserId}/>
        </div>
      }
    </div>
  )
}

export default DisplayUser