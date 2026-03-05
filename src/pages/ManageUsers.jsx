import React, { useEffect, useState } from 'react'
import DisplayUser from '../modals/DisplayUser'
import CreateUser from '../components/CreateUser'

const ManageUsers = () => {

  const[addUser, setAddUser] = useState(false);  
  const [refreshUsers, setRefreshUsers] = useState(0);

  const triggerRefreshUsers = () => setRefreshUsers((prev) => prev + 1);

  const toggleAddUser = () => {
    setAddUser(true);
  }

  useEffect(() => {
    if(addUser) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [addUser]);

  return (
    <div className='relative'>
      <div 
      onClick={(e) => {
        e.stopPropagation();
        toggleAddUser();
      }}
      className='btn-border-reveal bg-[#a4a4a4] transition duration-300 px-3 shadow-gray-700 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] py-2 w-1/13 font-bold select-none tracking-wide text-center rounded-lg active:opacity-65 hover:opacity-85 cursor-pointer'>
        Add User
      </div>

      {
        addUser &&
        <div 
        onClick={(e) => {
          e.stopPropagation();
          setAddUser(false);
        }}
        className={`fixed shadow-md ${addUser ? "opacity-100 translate-y-1" : "opacity-0 -translate-y-1 pointer-events-none"} inset-0 flex items-center justify-center bg-black/10 z-30`}>
          <CreateUser
          setAddUser={setAddUser}
          triggerRefreshUsers = {triggerRefreshUsers}
          />
        </div>
      }
      <DisplayUser refreshUsers={refreshUsers}/>
    </div>
  )
}

export default ManageUsers