import React, { useState } from 'react'
import defaultImage from '../assets/default image.png'
import { FaEdit } from 'react-icons/fa';
import DisplayUser from '../components/DisplayUser'

const ManageUsers = () => {

  const[addUser, setAddUser] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  const [previewProfileImage, setPreviewProfileImage] = useState(defaultImage);
  const [previewLicenseImage, setPreviewLicenseImage] = useState(defaultImage);

  const toggleAddUser = () => {
    setAddUser(true);
  }

  const handleSubmit = () => {

  };

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
        onClick={() => {
          if(!isLoading) {
            setAddUser(false);
          }
        }}
        className='fixed shadow-md inset-0 flex items-center justify-center bg-black/10 z-30'>
          <form
          onSubmit={handleSubmit}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className='w-5/10 grid grid-cols-7 bg-[#434343] rounded-lg px-5 py-2'>
            <div className='relative col-span-3 h-8/10 mt-5'>
              <img src={previewProfileImage} className='object-cover w-full h-full rounded-lg bg-[#a4a4a4]' />
              <div>
                <FaEdit className='text-amber-50' />
                <div className='font-semibold text-amber-50 tracking-wide'>
                  Upload Profile Image
                </div>
              </div>
            </div>
            <div className='relative col-span-3 h-8/10 mt-5'>
              <img src={previewProfileImage} className='object-cover w-full h-full rounded-lg bg-[#a4a4a4]' />
              <div>
                <FaEdit className='text-amber-50' />
                <div className='font-semibold text-amber-50 tracking-wide'>
                  Upload License Image
                </div>
              </div>
            </div>
          </form>
        </div>
      }
      <DisplayUser/>
    </div>
  )
}

export default ManageUsers