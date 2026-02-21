import React, { useState } from 'react'
import DisplayUser from '../components/DisplayUser'
import CreateUser from '../components/CreateUser'

const ManageUsers = () => {

  const[addUser, setAddUser] = useState(false);

  const toggleAddUser = () => {
    setAddUser(true);
  }

  return (
    <div className='relative'>
      <div 
      onClick={(e) => {
        e.stopPropagation();
        toggleAddUser();
      }}
      className='btn-border-reveal bg-[#a4a4a4] transition duration-300 px-3 shadow-md py-2 w-1/13 font-bold select-none tracking-wide text-center rounded-lg active:opacity-65 hover:opacity-85 cursor-pointer'>
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
          />
        </div>
      }
      <DisplayUser/>
    </div>
  )
}

export default ManageUsers