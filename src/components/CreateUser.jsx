import React, { useMemo, useRef, useState } from 'react'
import { IoClose } from 'react-icons/io5';
import defaultImage from '../assets/default image.png'
import {createUser} from '../services/user.service'
import { toast } from 'react-toastify';

const CreateUser = ({setAddUser}) => {

  const [isLoading, setIsLoading] = useState(false);

  const [uploadProfileImg, setUploadProfileImg] = useState(defaultImage);
  const [fileForProfileImg, setFileForProfileImg] = useState(null);

  const [uploadLicenseImg, setUploadLicenseImg] = useState(defaultImage);
  const [fileForLicenseImg, setFileForLicenseImg] = useState(null);

  const initialForm = useMemo(() => ({
    userName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "",
    dateOfBirth: "",
    verificationStatus: ""
  }), []);

  const profileInputRef = useRef(null);
  const licenseInputRef = useRef(null);

  const [form, setForm] = useState(initialForm);

  const fields = [
    { name: 'userName', label: 'Enter username: ', type: 'text'},
    { name: 'email', label: 'Enter email: ', type: 'email'},
    { name: 'password', label: 'Enter password: ', type: 'text'},
    { name: 'phoneNumber', label: 'Phone Number: ', type: 'text'},
    { name: 'role', label: 'Role: ', type: 'text', options: ["Admin", "Customer"]},
    { name: 'dateOfBirth', label: 'Date of Birth: ', type: 'text'},
    { name: 'verificationStatus', label: 'Verification Status: ', type: 'text', options: ["pending", "verified", "rejected"]},
  ];

  const uploadProfileImage = (file) => {
    if(!file) {
      return
    }

    setFileForProfileImg(file);
    const url = URL.createObjectURL(file);
    setUploadProfileImg(url);
  }

  const uploadLicenseImage = (file) => {
    if(!file) {
      return;
    }

    setFileForLicenseImg(file);
    const url = URL.createObjectURL(file);
    setUploadLicenseImg(url);
  }

  const handleOnChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  const handleCreateUser = async () => {
    try {
      setIsLoading(true);
      const requiredField = ["userName", "email", "password", "phoneNumber", "role", "dateOfBirth", "verificationStatus"]

      console.log("Submit form", form);

      const missingField = requiredField.filter((k) => {
        const v = form[k];
        return typeof v === "string" ?  !v.trim() : !v;
      });

      if(missingField.length) {
        toast.warn(`Missing: ${missingField.join(", ")}`);
        return;
      }

      const fd = new FormData();
      fd.append("userName", form.userName);
      fd.append("email", form.email);
      if(form.password.trim()) {
        fd.append("password", form.password);
      }
      fd.append("phoneNumber", form.phoneNumber);
      fd.append("role", form.role);
      fd.append("dateOfBirth", form.dateOfBirth);
      fd.append("verificationStatus", form.verificationStatus);

      if(fileForProfileImg) {
        fd.append("profileImageUrl", fileForProfileImg);
      }

      if(fileForLicenseImg) {
        fd.append("licenseImageUrl", fileForLicenseImg);
      }

      const response = await createUser(fd);

      if(response.success === false) {
        toast.error(response?.message || "Failed to create car");
        return;
      }

      toast.success(response?.message || "A new user is successfully created!");
      setAddUser(false);
    } catch (error) {
      console.log("An Error Occurred at handleCreateUser()", error);
      toast.error("Failed to create car!");
      return
    } finally {
      setIsLoading(false);
    }
  }

  const resetForm = () => {
    setForm(initialForm);
    setAddUser(false);
  }

  if(isLoading) return  <div>Loading...</div>

  return (
    <div 
    onClick={(e) => {e.stopPropagation()}}
    className='bg-[#a4a4a4] shadow-lg rounded-lg mt-10 pt-2 px-5 w-5/10 h-8/10'>
        <div className='flex text-2xl px-5 font-bold items-center tracking-wide justify-between'>
          <div>Create User</div>
          <div 
          onClick={() => setAddUser(false)}
          className='cursor-pointer active:opacity-65 hover:opacity-80'><IoClose/></div>
        </div>
        <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateUser();
        }}
        >
          <div className='w-full h-fit grid grid-cols-2 py-5 gap-5 col-span-3 rounded-lg'>
              <div className='relative w-full'>
                <img src={uploadProfileImg} className='w-full rounded-lg h-65' />
                    <div 
                    onClick={()=> profileInputRef.current?.click()}
                    className='absolute right-3 rounded-lg px-3 py-2 text-amber-50 cursor-pointer active:opacity-65 hover:opacity-80 bottom-3 bg-[#434343]'>
                      Upload Profile Picture
                    </div>
                    <input 
                    ref={profileInputRef}
                    type="file"
                    accept='image/*'
                    id='profileImg'
                    className='hidden'
                    onChange={(e) => {
                      uploadProfileImage(e.target.files[0]);
                    }}
                    />
              </div>
              <div className='relative w-full'>
                <img src={uploadLicenseImg} className='w-full rounded-lg h-65' />
                  <div>
                    <div 
                    onClick={() => licenseInputRef.current?.click()}
                    className='absolute right-3 rounded-lg px-3 py-2 text-amber-50 cursor-pointer active:opacity-65 hover:opacity-80 bottom-3 bg-[#434343]'>
                      Upload License Image
                    </div>
                    <input 
                    ref={licenseInputRef}
                    type="file"
                    accept="image/*"
                    id="licenseImg"
                    className="hidden"
                    onChange={(e) => {
                      uploadLicenseImage(e.target.files[0]);
                    }}
                      />
                  </div>
              </div>
            </div>
            <div className='w-full grid grid-cols-2 gap-2 mt-5 px-5 font-semibold tracking-wide'>
              {
                fields.map((field) => (
                  <div 
                  key={field.name}
                  className='flex w-full'>
                    <label className='w-3/7 py-1' htmlFor={field.name}>{field.label}</label>
                    <div className='flex w-4/7 rounded-md border-2 border-[#434343] items-center'>
                      {
                        field.options ? 
                        <div className='w-full'>
                          <label htmlFor={field.name}></label>
                          <select 
                          id={field.name} 
                          name={field.name} 
                          value={form[field.name] || ""}
                          onChange={(e) => handleOnChange(field.name, e.target.value)}
                          className='outline-none cursor-pointer w-full px-2 py-1 flex items-center'>
                            <option value="">Choose </option>
                            {
                              field.options.map((option) => (
                                <option 
                                key={option} value={option}>
                                  {option}
                                </option>
                              ))
                            }
                          </select>
                        </div>
                        :
                        <input
                        type={field.type}
                        value={form[field.name] || ""}
                        onChange={(e) => handleOnChange(field.name, e.target.value)}
                        className='outline-none px-2 py-1'
                        />
                      }
                    </div>
                  </div>
                ))
              }
            </div>
            <div className='flex justify-end items-center gap-3'>
              <button 
              type='button'
              onClick={resetForm}
              className='w-2/15 px-3 py-2 rounded-lg font-semibold text-center cursor-pointer active:opacity-65 hover:opacity-80 tracking-wide text-amber-50 bg-[#ff0000]'>Cancel</button>
              <button 
              type='submit'
              className='w-2/15 px-3 py-2 rounded-lg font-semibold text-center cursor-pointer active:opacity-65 hover:opacity-80 tracking-wide text-amber-50 bg-[#434343]'>Create</button>
            </div>
        </form>
    </div>
  )
}

export default CreateUser