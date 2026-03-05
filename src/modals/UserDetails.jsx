import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import UserInputField from '../components/UserInputField'
import { IoClose } from 'react-icons/io5';
import defaultImage from '../assets/default image.png';
import DeleteConfirm from '../components/DeleteConfirm';
import UserDetailsLoadingSkeleton from '../components/UserDetailsLoadingSkeleton'

const UserDetails = ({userId, user, setIsClick, fetchUser, onDelete, onUpdate}) => {

  const [ userData, setUserData ] = useState({});
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
    if((fieldName === 'createdAt' || fieldName === 'updatedAt' || fieldName === 'dateOfBirth') && value) {
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

  useEffect(() => {
    if (user) {
      const c = user?.customer || user?.customerId || user?.customerProfile || null;

      const merged = {
        ...user,
        phoneNumber: user?.phoneNumber ?? c?.phoneNumber ?? "",
        dateOfBirth: user?.dateOfBirth ?? c?.dateOfBirth ?? "",
        verificationStatus: user?.verificationStatus ?? c?.verificationStatus ?? "pending",
        licenseImageUrl: user?.licenseImageUrl ?? c?.licenseImageUrl ?? "",
      };

      setUserData(merged);
      setInitialUserData(merged);

      setPreviewProfileImageById(merged?.profileImageUrl || null);
      setPreviewLicenseImageById(merged?.licenseImageUrl || null);

      setProfileImageFile(null);
      setLicenseImageFile(null);
    }
  }, [user]);

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
    try {
      setIsLoading(true);

      if (!id) {
        toast.error("Unable to update user. User ID not found.");
        return;
      }

      if (userData?.userName === "Admin One") {
        toast.error("This user cannot be edited");
        return;
      }

      const formData = new FormData();
      formData.append("userName", userData?.userName || "");
      formData.append("email", userData?.email || "");

      if (userData?.password?.trim()) {
        formData.append("password", userData?.password.trim());
      }

      formData.append("role", userData?.role);

      if (profileImageFile) {
        formData.append("profileImageUrl", profileImageFile);
      }

      formData.append("accountStatus", userData?.accountStatus);

      if (userData?.role === "Customer") {
        const phoneNumber = userData?.phoneNumber ?? initialUserData?.phoneNumber;
        const dob = userData?.dateOfBirth ?? initialUserData?.dateOfBirth;
        const vs = userData?.verificationStatus ?? initialUserData?.verificationStatus;

        if (phoneNumber) formData.append("phoneNumber", phoneNumber);
        if (dob) formData.append("dateOfBirth", dob);
        if (vs) formData.append("verificationStatus", vs);

        if (licenseImageFile) formData.append("licenseImageUrl", licenseImageFile);
      }

      const updatedUser = await onUpdate(id, formData);
      if (!updatedUser) return;

      const c =
        updatedUser?.customerProfile ||
        updatedUser?.customer ||
        updatedUser?.customerId ||
        null;

      setUserData((prev) => ({
        ...prev,
        ...updatedUser,
        licenseImageUrl:
          c?.licenseImageUrl ??
          updatedUser?.licenseImageUrl ??
          prev?.licenseImageUrl ??
          "",
        verificationStatus:
          c?.verificationStatus ??
          updatedUser?.verificationStatus ??
          prev?.verificationStatus ??
          "pending",
      }));

      setInitialUserData((prev) => ({
        ...prev,
        ...updatedUser,
        licenseImageUrl:
          c?.licenseImageUrl ??
          updatedUser?.licenseImageUrl ??
          prev?.licenseImageUrl ??
          "",
        verificationStatus:
          c?.verificationStatus ??
          updatedUser?.verificationStatus ??
          prev?.verificationStatus ??
          "pending",
      }));

      setPreviewProfileImageById(
        updatedUser?.profileImageUrl || previewProfileImageById || null
      );

      setPreviewLicenseImageById(
        c?.licenseImageUrl ??
          updatedUser?.licenseImageUrl ??
          previewLicenseImageById ??
          null
      );

      setProfileImageFile(null);
      setLicenseImageFile(null);
      setIsEdit(false);
    } catch (error) {
      console.log("An Error Occurred at handleUpdateUser() in UserDetails.jsx", error);
      toast.error("Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

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
    className='bg-[#a4a4a4] shadow-lg rounded-lg mt-10 py-2 px-5 w-1/2 h-8/11'>
      <div className='flex justify-between items-center'>
        <div className='font-bold text-2xl'>
          {isEdit ? "Edit User" : "User Details"}
        </div>
        <IoClose 
        onClick={() => {
          setIsEdit(false);
          setIsClick(false);
        }}
        className='text-3xl cursor-pointer hover:opacity-80 active:opacity-65 font-bold'/>
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
              readOnly={!isEdit}
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
              className='absolute right-27 border-2 border-[#434343]  mt-5 rounded-lg px-3 py-1.5 w-2/15 font-semibold tracking-wide text-center active:opacity-65 hover:opacity-80 cursor-pointer'>
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