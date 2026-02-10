import React, { useEffect, useState } from 'react'
import { getAllUser, updateUserData, deleteUser } from '../services/user.service'
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import UserInputField from './UserInputField'

const UserDetails = ({userId}) => {

  const [ userData, setUserData ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isShowPassword, setIsShowPassword ] = useState(false);
  const [previewProfileImageById, setPreviewProfileImageById] = useState(null);
  const [previewLicenseImageById, setPreviewLicenseImageById] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // console.log("user data: ", userData);

  const fields = [
    { name: 'userName', label: 'Username: ', type: 'text'},
    { name: 'email', label: 'Email: ', type: 'email'},
    { name: 'password', label: 'Password: ', type: 'text'},
    { name: 'phoneNumber', label: 'Phone Number', type: 'text'},
    { name: 'dateOfBirth', label: 'Date of Birth', type: 'text'},
    { name: 'verificationStatus', label: 'Verification Status', type: 'text'},
    { name: 'role', label: 'Role:', type: 'text'},
    { name: 'accountStatus', label: 'Account Status:', type: 'text'},
    { name: 'createdAt', label: 'Created At: ', type: 'text'},
    { name: 'updatedAt', label: 'Updated At: ', type: 'text'}
  ];

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({
      ...prev, 
      [field]: value
    }));
  }

  const fetchUserById = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUser();

      if(response.success) {
        const fetchedUsers = response?.data || [];

        const userData = fetchedUsers.find((u) => u._id === userId);

        setUserData(userData);
        toast.success(response?.message);
      }
    } catch (error) {
      console.log("An Error Occurred at fetchAllUser()", error);
      toast.error("Failed to fetch data");
      return;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if(userId) {
      fetchUserById();
    }
  }, [userId]);

  const handleUpdateUser = () => {

  }

  const handleDeleteUser = () => {

  }

  const handleSubmit = () => {
    
  }

  if(isLoading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className='bg-[#a4a4a4] rounded-lg py-2 px-5 w-7/10'>
      <div className='font-bold text-2xl'>
        Update User
      </div>
      <form 
      onClick={(e) => {
        e.stopPropagation();
        handleSubmit();
      }}
      className='flex flex-col'
      >
        <div className='w-full grid grid-cols-2'>
          <img src={userData.profileImageUrl} className='w-full' />
          <img src={userData.licenseImageUrl} className='w-full' />
        </div>
        <UserInputField
        label="Username:"
        name="userName"
        type="text"
        value={userData?.userName}
        onChange={(e) => handleInputChange('userName', e.target.value)}
        readOnly={!isEdit}
        />
      </form>
    </div>
  )
}

export default UserDetails