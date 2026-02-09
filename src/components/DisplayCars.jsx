import React, { useEffect, useState } from 'react'
import { getAllCar } from '../services/car.service'
import AutoResizeTextarea from './AutoResizeTextarea';

const DisplayCars = () => {

  const [allCars, setAllCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");

  const fetchAllCars = async () => {
    try {
        setIsLoading(true);
        const response = await getAllCar();
        console.log("fetchALlCars() response: ", response?.data)
        if(response.success) {
            setAllCars(response.data);
        }
    } catch (error) {
        console.log("An Error Occurred at fetchAllCars()", error);
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error",
            error
        }
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAllCars();
  }, []);


  const [ carName, setCarName ] = useState(response?.carName);
  useEffect(() => setCarName(allCars.car))

  return (
    <div className='grid grid-cols-2 gap-3 py-3'>
        {allCars.map((car) => (
            <div key={car._id}
            className='bg-[#a4a4a4] rounded-lg flex p-3 gap-3'
            >
                <div className='w-3/7 h-full'>
                    <img src={car?.carImageUrl} className='w-full h-full object-cover rounded-md' />
                </div>
                <div className='flex flex-col justify-center gap-3 w-4/7'>
                    <div className='flex'>
                        <div className='w-3/7 font-bold tracking-wide'>
                            Car Name
                        </div>
                        <input
                        type='text'
                        value={car?.carName}
                        className='w-4/7 font-semibold'/>
                    </div>

                    <div className='flex'>
                        <div className='w-3/7 font-bold tracking-wide'>
                            Description
                        </div>
                        <div className='w-4/7 font-semibold'>
                            {car?.description}
                        </div>
                    </div>

                    <div className='flex'>
                        <div className='w-3/7 font-bold tracking-wide'>
                            Fuel Type
                        </div>
                        <div className='w-4/7 font-semibold'>
                            {car?.fuelType}
                        </div>
                    </div>

                    <div className='flex'>
                        <div className='w-3/7 font-bold tracking-wide'>
                            Vehicle Type
                        </div>
                        <div className='w-4/7 font-semibold'>
                            {car?.vehicleType}
                        </div>
                    </div>

                    <div className='flex'>
                        <div className='w-3/7 font-bold tracking-wide'>
                            Price Per Day (SGD)
                        </div>
                        <div className='w-4/7 font-semibold'>
                            {car?.pricePerDay}
                        </div>
                    </div>

                    <div className='flex'>
                        <div className='w-3/7 font-bold tracking-wide'>
                            Car Brand
                        </div>
                        <div className='w-4/7 font-semibold'>
                            {car?.brand}
                        </div>
                    </div>

                    <div className='flex'>
                        <div className='w-3/7 font-bold tracking-wide'>
                            Availability Status
                        </div>
                        <div className='w-4/7 font-semibold'>
                            {car?.availabilityStatus}
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
  )
}

export default DisplayCars