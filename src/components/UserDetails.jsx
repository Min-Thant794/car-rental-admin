import React, { useEffect, useState } from 'react'
import { getAllUser, updateUserData } from '../services/user.service'
import { toast } from 'react-toastify';
import UserInputField from './UserInputField'
import { IoClose } from 'react-icons/io5';
import defaultImage from '../assets/default image.png';
import DeleteConfirm from './DeleteConfirm';
import UserDetailsLoadingSkeleton from './UserDetailsLoadingSkeleton'

const UserDetails = ({userId, setIsClick, onDelete}) => {

  const [ userData, setUserData ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isShowPassword, setIsShowPassword ] = useState(false);
  const [ previewProfileImageById, setPreviewProfileImageById] = useState(null);
  const [ previewLicenseImageById, setPreviewLicenseImageById] = useState(null);
  const [ profileImageFile, setProfileImageFile ] = useState(null);
  const [ licenseImageFile, setLicenseImageFile ] = useState(null);
  const [ initialUserData, setInitialUserData ] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // console.log("user data: ", userData);

  const fields = [
    { name: 'userName', label: 'Username: ', type: 'text'},
    { name: 'email', label: 'Email: ', type: 'email'},
    { name: 'password', label: 'Password: ', type: 'text', placeholder: '•••••••••', showPasswordToggle: true},
    { name: 'phoneNumber', label: 'Phone Number: ', type: 'text'},
    { name: 'dateOfBirth', label: 'Date of Birth: ', type: 'text'},
    { name: 'verificationStatus', label: 'Verification Status: ', type: 'text', options: ["pending", "verified", "rejected"]},
    { name: 'role', label: 'Role: ', type: 'text', options: ["Admin", "Customer"]},
    { name: 'accountStatus', label: 'Account Status: ', type: 'text', options: ["active", "suspended", "deleted"]},
    { name: 'createdAt', label: 'Created At: ', type: 'text'},
    { name: 'updatedAt', label: 'Updated At: ', type: 'text'}
  ];

  const formatDateField = (fieldName, value) => {
    if((fieldName === 'createdAt' || fieldName === 'updatedAt') && value) {
      return value.slice(0, 10);
    }

    return value;
  }

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
        setInitialUserData(userData);
        setPreviewProfileImageById(userData?.profileImageUrl);
        setPreviewLicenseImageById(userData?.licenseImageUrl);
        setProfileImageFile(null);
        setLicenseImageFile(null);
        toast.success(response?.message);
      }

      console.log("response after fetch", response);
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

  const uploadProfileImg = (file) => {
    if(!file) return;
    
    setProfileImageFile(file);
    setPreviewProfileImageById(URL.createObjectURL(file));
  }

  const uploadLicenseImg = (file) => {
    if(!file) return;

    setLicenseImageFile(file);
    setPreviewLicenseImageById((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  const handleUpdateUser = async (id) => {
    // Capture previews BEFORE any async calls to avoid stale closure issues
    const currentProfilePreview = previewProfileImageById;
    const currentLicensePreview = previewLicenseImageById;

    try {
      setIsLoading(true);

      if(!id) {
        toast.error("Unable to update user. User ID not found.");
        return;
      }

      const formData = new FormData();
      formData.append("userName", userData?.userName || "");
      formData.append("email", userData?.email || "");
      formData.append("phoneNumber", userData?.phoneNumber || "");
      formData.append("dateOfBirth", userData?.dateOfBirth || "");
      formData.append("role", userData?.role);
      formData.append("accountStatus", userData?.accountStatus);

      if(userData?.password?.trim()) {
        formData.append("password", userData.password.trim());
      }

      if(profileImageFile) {
        formData.append("profileImageUrl", profileImageFile);
      }

      if(licenseImageFile) {
        formData.append("licenseImageUrl", licenseImageFile);
      }

      if(userData?.userName === "Admin One") {
        toast.error("This user cannot be edited");
        return;
      }

      const response = await updateUserData(id, formData);

      if(!response.success) {
        toast.error(response?.message || "Failed to update user.");
        return;
      }

      if(response?.data) {
        setUserData((prev) => ({
          ...prev,
          ...response.data,
          licenseImageUrl: response.data.licenseImageUrl || prev?.licenseImageUrl
        }));

        setInitialUserData((prev) => ({
          ...prev,
          ...response.data,
          licenseImageUrl: response.data.licenseImageUrl || prev?.licenseImageUrl
        }));

        setProfileImageFile(null);
        setLicenseImageFile(null);

        setPreviewProfileImageById(response.data?.profileImageUrl || currentProfilePreview || null);
        setPreviewLicenseImageById(response.data?.licenseImageUrl || currentLicensePreview || null);

        toast.success(response?.message || "User updated successfully!");
        setIsEdit(false);
      }

      console.log("response after update: ", response);
    } catch (error) {
      console.log("An Error Occurred at handleUpdateUser()", error);
      toast.error("Unable to update user.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteUser = async (id) => {
    try {
      setIsLoading(true);

      if(userData?.userName === "Admin One") {
        toast.error("This user cannot be deleted");
        return;
      }

      await onDelete(id);

    } catch (error) {
      console.log("An Error Occurred at handleDeleteUser()", error);
      toast.error("Failed to delete user.");
    } finally {
      setIsLoading(false);
    }
  }

  const clearForm = () => {
    setUserData(initialUserData);
    setIsEdit(false);
    setPreviewProfileImageById(initialUserData?.profileImageUrl || null);
    setPreviewLicenseImageById(initialUserData?.licenseImageUrl || null);
    setProfileImageFile(null);
    setLicenseImageFile(null);
  }

  const handleSubmit = (id) => {
    if(!isEdit) return;
    handleUpdateUser(id);
  }

  if(isLoading) {
    return (
      <UserDetailsLoadingSkeleton />
    )
  }

  //console.log("isDelete", isDelete);

  return (
    <div 
    onClick={(e) => {
      e.stopPropagation();
      setIsDelete(false);
    }}
    className='bg-[#a4a4a4] shadow-lg rounded-lg mt-10 py-2 px-5 w-5/10 h-8/10'>
      <div className='flex justify-between items-center'>
        <div className='font-bold text-2xl'>
          {isEdit ? "Edit User" : "User Details"}
        </div>
        <IoClose 
        onClick={() => {
          setIsEdit(false);
          setIsClick(false);
        }}
        className='text-2xl cursor-pointer hover:opacity-80 active:opacity-65 font-bold'/>
      </div>
      <form 
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(userId);
      }}
      className='relative w-full h-full justify-center items-center'
      >
        <div className='w-full h-fit grid grid-cols-2 py-5 gap-5 col-span-3 rounded-lg'>
          <div className='relative w-full'>
            <img src={previewProfileImageById || defaultImage} className='w-full rounded-lg h-65' />
            {
              isEdit &&
              <div>
                <div 
                onClick={()=> document.getElementById("profileImg").click()}
                className='absolute right-3 rounded-lg px-3 py-2 text-amber-50 cursor-pointer active:opacity-65 hover:opacity-80 bottom-3 bg-[#434343]'>
                  Upload Profile Picture
                </div>
                <input 
                type="file"
                accept='image/*'
                id='profileImg'
                className='hidden'
                onChange={(e) => {
                  e.stopPropagation();
                  uploadProfileImg(e.target.files[0]);
                }}
                />
              </div>
            }
          </div>
          <div className='relative w-full'>
            <img src={previewLicenseImageById || defaultImage} className='w-full rounded-lg h-65' />
            {
              (isEdit && userData?.role === "Customer")  &&
              <div>
                <div 
                onClick={() => document.getElementById("licenseImg").click()}
                className='absolute right-3 rounded-lg px-3 py-2 text-amber-50 cursor-pointer active:opacity-65 hover:opacity-80 bottom-3 bg-[#434343]'>
                  Upload License Image
                </div>
                <input 
                type="file"
                accept="image/*"
                id="licenseImg"
                className="hidden"
                onChange={(e) => {
                  e.stopPropagation();
                  const file = e.target.files?.[0];
                  if (!file) return;
                  uploadLicenseImg(file);
                  e.target.value = "";
                }}
                  />
              </div>
            }
          </div>
        </div>
        <div className='grid gap-3 md:grid-flow-col md:grid-rows-5 md:gap-x-10 w-full h-fit'>
          {fields.map((field) => (
            <UserInputField
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type}
              value={formatDateField(field.name, userData?.[field.name])}
              placeholder={field.placeholder}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              disabled={!isEdit}
              showPasswordToggle={field.showPasswordToggle}
              onTogglePassword={() => setIsShowPassword(!isShowPassword)}
              showPassword={isShowPassword}
              options={field.options}
            />
          ))}
        </div>
        <div className='flex gap-3 w-full justify-between'>
          <div 
          onClick={(e) => {
            e.stopPropagation();
            //handleDeleteUser(userId);
            setIsDelete(true);
          }}
          className='bg-[#ff0000]  mt-5 text-amber-50 rounded-lg px-3 py-2 w-2/15 font-semibold tracking-wide text-center active:opacity-65 hover:opacity-80 cursor-pointer'>
            Delete
          </div>
          <div className='relative flex gap-3 w-full justify-end'>
            {
              isEdit &&
              <div 
              onClick={(e) => {
                e.stopPropagation();
                clearForm();
              }}
              className='absolute right-25 border-2 border-[#434343]  mt-5 rounded-lg px-3 py-2 w-2/15 font-semibold tracking-wide text-center active:opacity-65 hover:opacity-80 cursor-pointer'>
                Cancel
              </div>
            }
            <div 
            onClick={(e) => {
              e.stopPropagation();
              setIsEdit(true)
            }}
            className={`bg-[#434343]  mt-5 text-amber-50 rounded-lg ${isEdit ? "opacity-0  pointer-events-none" : "opacity-100"} px-3 py-2 w-2/15 font-semibold tracking-wide text-center active:opacity-65 hover:opacity-80 cursor-pointer`}>
              Edit
            </div>
            {
              isEdit &&
              <button
              type='submit'
              className={`bg-[#434343]  mt-5 text-amber-50 rounded-lg px-3 py-2 w-2/15 font-semibold tracking-wide text-center active:opacity-65 hover:opacity-80 cursor-pointer`}>
                Save
              </button>
            }
          </div>
        </div>
        {
          isDelete &&
          <DeleteConfirm
          setIsClick={setIsClick}
          userId={userId}
          setIsDelete={setIsDelete}
          handleDeleteUser={handleDeleteUser}
          setIsEdit={setIsEdit}
          />
        }
      </form>
    </div>
  )
}

export default UserDetails