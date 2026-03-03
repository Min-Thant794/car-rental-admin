import React, { useEffect, useState, useCallback } from 'react'
import {getAllUser, updateUserData, deleteUser} from '../services/user.service';
import { toast } from 'react-toastify';
import UserDetails from "./UserDetails"

const DisplayUser = ({ refreshUsers }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [isClick, setIsClick] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const selectedUser = allUsers.find((user) => user._id === selectedUserId) || null;

  console.log("isClick: ", isClick);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllUser();

      if(response.success) {
        const fetchedData = response?.data || [];
        const normalizeUser = (u) => {
        const c = u?.customer || u?.customerId || u?.customerProfile || null;

        return {
          ...u,

          phoneNumber: u?.phoneNumber ?? c?.phoneNumber ?? "",
          dateOfBirth: u?.dateOfBirth ?? c?.dateOfBirth ?? "",
          verificationStatus: u?.verificationStatus ?? c?.verificationStatus ?? "pending",
          licenseImageUrl: u?.licenseImageUrl ?? c?.licenseImageUrl ?? "",
        };
      };

      const normalized = fetchedData.map(normalizeUser);
        setAllUsers(normalized);
        if(refreshUsers > 0) {
          toast.success(response?.message || "Users list refreshed.");
        }
      }
    } catch (error) {
      console.log("An Error Occurred at fetchUsers()", error);
      return;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUsers]);

  const handleUpdateUser = async (id, payload) => {
    const previousUser = allUsers;

    try {
      setIsLoading(true);
      const response = await updateUserData(id, payload);
      
      if(!response?.success || !response?.data) {
        toast.error(response?.message || "Failed to update user.");
        return null;
      }

      const updatedUser = response.data;
      const c = updatedUser?.customerProfile;

      setAllUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user._id !== id) return user;

          return {
            ...user,
            ...updatedUser,

            licenseImageUrl: c?.licenseImageUrl ?? updatedUser?.licenseImageUrl ?? user?.licenseImageUrl ?? "",
            verificationStatus: c?.verificationStatus ?? updatedUser?.verificationStatus ?? user?.verificationStatus ?? "pending",

            customerProfile: c ?? user?.customerProfile ?? null,
          };
        })
      );

      toast.success(response?.message || "User updated successfully!");
      return updatedUser;
    } catch (error) {
      setAllUsers(previousUser);
      toast.error("Unable to update user.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteUser = async (id) => {
    const prev = allUsers;
    setAllUsers((p) => p.filter((u) => u._id !== id));

    setIsClick(false);
    setSelectedUserId(null);

    try {
      setIsLoading(true)
      const response = await deleteUser(id);
      
      if(!response?.success) {
        setAllUsers(prev);
        toast.error(response?.message || "Failed to delete user");
        return;
      }

      toast.success(response?.message || "User is deleted successfully");

    } catch (error) {
      console.log("An Error Occurred at handleDeleteUser()", error);
      setAllUsers(prev);
      toast.error("An Error Occurred! Failed to delete user");
      return;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  if(isLoading) {
    return <div className='grid grid-cols-4 gap-3 pt-5'>
        {Array.from({ length: 28 }).map((_, index) => (
          <div 
            key={index}
            className='grid grid-cols-5 justify-center items-center rounded-full px-1 bg-[#a4a4a4] animate-pulse'
          >
            <div className='col-span-1'>
              <div className='rounded-full w-16 h-16 bg-[#a4a4a4]'></div>
            </div>
            <div className='px-2 col-span-4 w-full space-y-2 py-3'>
              <div className='grid grid-cols-5 gap-3'>
                <div className='h-4 bg-[#898888] rounded col-span-1'></div>
                <div className='h-4 bg-[#a4a4a4] rounded col-span-4'></div>
              </div>
              <div className='grid grid-cols-5 gap-3'>
                <div className='h-4 bg-[#898888] rounded col-span-1'></div>
                <div className='h-4 bg-[#a4a4a4] rounded col-span-4'></div>
              </div>
              <div className='grid grid-cols-5 gap-3'>
                <div className='h-4 bg-[#898888] rounded col-span-1'></div>
                <div className='h-4 bg-[#a4a4a4] rounded col-span-4'></div>
              </div>
            </div>
          </div>
        ))}
      </div>
  }

  return (
    <div>
      <div 
      onClick={(e) => {
        e.stopPropagation();
      }}
      className='grid grid-cols-4 gap-3 pt-5'>
        {
          allUsers.map((u) => (
            <div 
            key={u._id}
            onClick={() => {
              setSelectedUserId(u._id);
              setIsClick(true);
            }}
            className='grid grid-cols-5 hover:bg-[#434343] overflow-hidden shadow-gray-700 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] cursor-pointer transition hover:-translate-y-1 hover:rounded-full hover:text-amber-50 duration-500 justify-center items-center rounded-full px-1 bg-[#a4a4a4]'>
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
          className={`fixed shadow-md ${isClick ? "opacity-100 translate-y-1" : "opacity-0 -translate-y-1 pointer-events-none"} inset-0 flex items-center justify-center bg-black/10 z-30`}>
            <UserDetails 
            setIsClick = {setIsClick}
            userId={selectedUserId}
            user={selectedUser}
            fetchUser = {fetchUsers}
            onDelete={handleDeleteUser}
            onUpdate = {handleUpdateUser}
            />
          </div>
        }
      </div>
    </div>
  )
}

export default DisplayUser