import React, { useEffect, useMemo, useState } from 'react'
import defaultImage from "../assets/default image.png"
import { FaEdit } from 'react-icons/fa';
import { createCar } from '../services/car.service';
import DisplayCars from '../components/DisplayCars';
import { toast } from 'react-toastify';

const Car = () => {

  const [addCar, setAddCar] = useState(false);
  
  const initialForm = useMemo(() => ({
    carName: "",
    description: "",
    fuelType: "",
    vehicleType: "",
    pricePerDay: "",
    carBrand: "",
    availabilityStatus: "",
  }), []);

  const [previewImg, setPreviewImg] = useState(defaultImage);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);

  const fields = [
    { name: "carName", label: "Car Name", type: "text", placeholder: "Enter Car Name"},
    { name: "description", label: "Description", type: "text", placeholder: "Enter Description"},
    { name: "fuelType", label: "Fuel Type", type: "text", placeholder: "Choose Fuel Type"},
    { name: "vehicleType", label: "Vehicle Type", type: "text", placeholder: "Choose Vehicle Type"},
    { name: "pricePerDay", label: "Price Per Day", type: "text", placeholder: "Enter Price Per Day"},
    { name: "carBrand", label: "Car Brand", type: "text", placeholder: "Enter Car Brand"},
    { name: "availabilityStatus", label: "Availability Status", type: "text", placeholder: "Choose Availability Status"},
  ]

  const toggleAddCar = () => {
    setAddCar(!addCar);
  }

  useEffect(() => {
    if(!addCar) return;
    
    const handleClickOutside = () => {
      setAddCar(false);
    }

    document.addEventListener('click', handleClickOutside);
    return() => document.removeEventListener('click', handleClickOutside)
  }, [addCar]);

  const uploadImage = (file) => {
    if(!file) return;
    setFile(file);
    const url = URL.createObjectURL(file);
    setPreviewImg(url);
  }

  const uploadCarImage = () => {
    document.getElementById("fileupload").click();
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value}));
  };

  const resetForm = () => {
    setForm(initialForm);
    setFile(null);
    setPreviewImg(defaultImage);
  }

  const handleCancel = (e) => {
    e.stopPropagation();
    setAddCar(false);
    resetForm();
  }

  // const isFormEmpty = () => {
  //   const allBlank = Object.values(form).every((v) => String(v).trim() === "");
  //   return allBlank && !file;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if(!form.carName || !form.description || !form.carBrand || !form.availabilityStatus || !form.fuelType || !form.pricePerDay || !form.vehicleType) {
      console.log("Missing required fields");
      return;
    }

    const fd = new FormData();
    fd.append("carName", form.carName);
    fd.append("description", form.description);
    fd.append("fuelType", form.fuelType);
    fd.append("vehicleType", form.vehicleType);
    fd.append("pricePerDay", form.pricePerDay);
    fd.append("brand", form.carBrand);
    fd.append("availabilityStatus", form.availabilityStatus);

    if(file) {
      fd.append("carImageUrl", file);
    }

    const response = await createCar(fd);

    if(response?.success === false) {
      console.log(response.message);
      return;
    }

    toast.success(response?.message || "A new car is successfully added!");
    resetForm();
    setAddCar(false);
  }

  return (
    <div className='relative'>
      <div 
      onClick={(e) => {
        e.stopPropagation();
        toggleAddCar();
      }}
      className='btn-border-reveal transition duration-300 px-3 py-2 bg-[#a4a4a4] w-1/13 font-bold select-none tracking-wide text-center rounded-lg shadow-md active:opacity-65 hover:opacity-85 cursor-pointer'>
        Add Car
      </div>

      {
        addCar &&
        <div 
        onClick={resetForm}
        className='fixed shadow-md inset-0 flex items-center justify-center bg-black/10 z-30'>
          <form 
          onSubmit={handleSubmit}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className='w-5/10 grid grid-cols-7 bg-[#434343] rounded-lg px-5 py-2'>
            <div className='relative col-span-3 h-8/10 mt-5'>
              {/* preview image */}
              <img src={previewImg} className='object-cover w-full h-full rounded-lg bg-[#a4a4a4]' />
              {
                addCar &&
                <div
                onClick={uploadCarImage}
                className='transition duration-300 absolute bottom-3 right-5 bg-[#434343] px-3 py-2 rounded-lg active:opacity-65 hover:opacity-80 cursor-pointer flex items-center gap-3'
                >
                  <FaEdit className='text-amber-50'/>
                  <div className='font-semibold text-amber-50 tracking-wide'>
                    Upload
                  </div>
                </div>
              }
              <input 
                type="file"
                id='fileupload'
                accept='image/*'
                onChange={(e) => uploadImage(e.target.files[0])}
                className='hidden'
                />
            </div>
            <div className='col-span-4'>
              <div className='flex flex-col gap-3 px-3 mt-3 justify-center'>
                {
                  fields.map((f) => (
                    <div key={f.name} className='flex gap-1 py-1 items-center'>
                      <label className='font-semibold text-amber-50 w-4/10'>
                        {f.label}
                      </label>
                      <input 
                      name={f.name}
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.name]}
                      onChange={handleChange}
                      className='py-1 outline-none border-none w-6/10 placeholder:font-semibold placeholder:text-sm rounded-lg px-2 bg-[#a4a4a4]'
                      />
                    </div>
                  ))
                }
              </div>
              <div className='flex w-full gap-3 justify-end px-3 pt-5'>
                <button 
                type='button'
                onClick={handleCancel}
                className='transition duration-300 px-3 py-2 bg-[#ff0000] w-3/10 font-bold tracking-wide text-center cursor-pointer active:opacity-65 hover:opacity-80 text-amber-50 rounded-lg'>
                  Cancel
                </button>
                <button
                type='submit'
                className='transition duration-300 px-3 py-2 bg-[#a4a4a4] w-3/10 font-bold tracking-wide text-center cursor-pointer active:opacity-65 hover:opacity-80 rounded-lg'>
                  Add Car
                </button>
              </div>
            </div>
          </form>
        </div>
      }

      {/* display cars */}
      <DisplayCars/>
    </div>
  )
}

export default Car