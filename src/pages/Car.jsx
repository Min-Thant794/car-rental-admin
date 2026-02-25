import React, { useEffect, useMemo, useState } from 'react'
import defaultImage from "../assets/default image.png"
import { FaEdit } from 'react-icons/fa';
import { createCar } from '../services/car.service';
import DisplayCars from '../components/DisplayCars';
import { toast } from 'react-toastify';

const Car = () => {

  const [addCar, setAddCar] = useState(false);
  const [carListVersion, setCarListVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const initialForm = useMemo(() => ({
    carName: "",
    description: "",
    fuelType: "",
    vehicleType: "",
    pricePerDay: "",
    discount: "",
    carBrand: "",
    availabilityStatus: "",
  }), []);

  const [previewImg, setPreviewImg] = useState(defaultImage);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);

  const fields = [
    { name: "carName", label: "Car Name", type: "text", placeholder: "Enter Car Name" },
    { name: "description", label: "Description", type: "text", placeholder: "Enter Description" },

    { name: "fuelType", label: "Fuel Type", type: "select", placeholder: "Choose Fuel Type",
      options: ["Diesel", "Electric", "Petrol"] },

    { name: "vehicleType", label: "Vehicle Type", type: "select", placeholder: "Choose Vehicle Type",
      options: ["Crossover", "Sedan", "SUV", "MPV", "Hatchback", "Station Wagon"] },

    { name: "pricePerDay", label: "Price Per Day", type: "text", placeholder: "Enter Price Per Day" },

    { name: "discount", label: "Discount", type: "select", placeholder: "Select Discount",
      options: ["0", "10", "15", "20", "25", "30", "35", "40", "45", "50"] },

    { name: "carBrand", label: "Car Brand", type: "text", placeholder: "Enter Car Brand" },

    { name: "availabilityStatus", label: "Availability Status", type: "select", placeholder: "Choose Availability Status",
      options: ["Available", "Unavailable", "Maintenance"] },
  ];

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

  const handleSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLoading(true);

    try {
      if(!form.carName || !form.description || !form.carBrand || !form.availabilityStatus || !form.fuelType || !form.pricePerDay || !form.vehicleType) {
        toast.error("Please fill all required fields");
        return;
      }

      const fd = new FormData();
      fd.append("carName", form.carName);
      fd.append("description", form.description);
      fd.append("fuelType", form.fuelType);
      fd.append("vehicleType", form.vehicleType);
      fd.append("pricePerDay", form.pricePerDay);
      fd.append("discount", form.discount || "0");
      fd.append("brand", form.carBrand);
      fd.append("availabilityStatus", form.availabilityStatus);

      if(file) {
        fd.append("carImageUrl", file);
      }

      const response = await createCar(fd);

      if(response?.success === false) {
        toast.error(response.message || "Failed to add car");
        return;
      }

      toast.success(response?.message || "A new car is successfully added!");
      setCarListVersion((prev) => prev + 1);
      resetForm();
      setAddCar(false);
    } catch (error) {
      console.log("An Error Occurred at handleSubmit()", error);
      toast.error("Unable to Add New Car");
      return
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='relative'>
      <div 
      onClick={(e) => {
        e.stopPropagation();
        toggleAddCar();
      }}
      className='btn-border-reveal bg-[#a4a4a4] transition duration-300 px-3 shadow-md py-2 w-1/13 font-bold select-none tracking-wide text-center rounded-lg active:opacity-65 hover:opacity-85 cursor-pointer'>
        Add Car
      </div>

      {
        addCar &&
        <div 
        onClick={() => {
          if(!isLoading) {
            setAddCar(false);
            resetForm();
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
              {/* preview image */}
              <img src={previewImg} className='object-cover w-full h-full rounded-lg bg-[#a4a4a4]' />
              {
                addCar &&
                <div
                onClick={uploadCarImage}
                className={`transition duration-300 absolute bottom-3 right-5 bg-[#434343] px-3 py-2 rounded-lg cursor-pointer flex items-center gap-3 ${isLoading ? 'opacity-50 pointer-events-none' : 'active:opacity-65 hover:opacity-80'}`}
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
                disabled={isLoading}
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
                      {
                        f.type === "select" ? (
                          <select
                            name={f.name}
                            value={form[f.name] ?? ""}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="py-1 outline-none border-none w-6/10 rounded-lg px-2 bg-[#a4a4a4] disabled:opacity-50"
                          >
                            <option value="" disabled>
                              {f.placeholder}
                            </option>

                            {f.options?.map((opt) => (
                              <option className="text-black" key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        )
                        :
                        (
                          <input
                          name={f.name}
                          type={f.type}
                          placeholder={f.placeholder}
                          value={form[f.name]}
                          onChange={handleChange}
                          disabled={isLoading}
                          className='py-1 outline-none border-none w-6/10 placeholder:font-semibold placeholder:text-sm rounded-lg px-2 bg-[#a4a4a4] disabled:opacity-50'
                          />
                        )
                      }
                    </div>
                  ))
                }
              </div>
              <div className='flex w-full gap-3 justify-end px-3 pt-5'>
                <button 
                type='button'
                onClick={handleCancel}
                disabled={isLoading}
                className='transition duration-300 px-3 py-2 bg-[#ff0000] w-3/10 font-bold tracking-wide text-center cursor-pointer active:opacity-65 hover:opacity-80 text-amber-50 rounded-lg disabled:opacity-50'>
                  Cancel
                </button>
                <button
                type='submit'
                disabled={isLoading}
                className='transition duration-300 px-3 py-2 bg-[#a4a4a4] w-3/10 font-bold tracking-wide text-center cursor-pointer active:opacity-65 hover:opacity-80 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2'>
                  {isLoading && <div className="spinner"></div>}
                  {isLoading ? 'Adding...' : 'Add Car'}
                </button>
              </div>
            </div>
          </form>
        </div>
      }

      {/* display cars */}
      <DisplayCars refreshTrigger={carListVersion}/>
    </div>
  )
}

export default Car