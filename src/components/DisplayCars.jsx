import React, { useEffect, useState } from 'react'
import { getAllCar, updateCar, deleteCar } from '../services/car.service'
import { toast } from 'react-toastify';

const DisplayCars = () => {

  const [allCars, setAllCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editableCars, setEditableCars] = useState(false);
  const [actionLoadingById, setActionLoadingById] = useState({});

  const fetchAllCars = async () => {
    try {
        setIsLoading(true);
        const response = await getAllCar();

        if(response?.success) {
            const fetchedCars = response?.data || [];
            //toast.success(response?.message);
            setAllCars(fetchedCars);

            const initialEditableCars = fetchedCars.reduce((acc, car) => {
                acc[car._id] = {
                    carName: car?.carName || '',
                    description: car?.description || '',
                    fuelType: car?.fuelType || '',
                    vehicleType: car?.vehicleType || '',
                    pricePerDay: car?.pricePerDay || '',
                    brand: car?.brand || '',
                    availabilityStatus: car?.availabilityStatus || ''
                }
                return acc
            }, []);

            setEditableCars(initialEditableCars);
        }
    } catch (error) {
        console.log("An Error Occurred at fetchAllCars()", error);
        toast.error("Unable to fetch cars");
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAllCars()
  }, []);

  const handleChange = (id, field, value) => {
    setEditableCars((prev) => ({
        ...prev,
        [id]: {
            ...prev[id],
            [field]: value
        }
    }));
  }

  const handleUpdate = async(id) => {
    const editableCar = editableCars[id]

    if(!editableCar) return

    if(
        !editableCar.carName ||
        !editableCar.description ||
        !editableCar.fuelType ||
        !editableCar.vehicleType ||
        !editableCar.pricePerDay ||
        !editableCar.brand ||
        !editableCar.availabilityStatus
    ) {
        toast.error("Please complete all fields before updating");
        return
    }

    try {
        setActionLoadingById((prev) => ({ ...prev, [id]: true}));
        const response = await updateCar(id, editableCar);

        if(!response?.success) {
            toast.error(response?.message || 'Failed to update car');
            return
        }

        setAllCars((prev) => prev.map((car) => car._id === id ? {...car, ...editableCar} : car));
        toast.success(response?.message || "Car updated successfully");
    } catch (error) {
        console.log("An Error Occurred at handleUpdate()", error);
        toast.error("Unable to update car");
    } finally {
        setActionLoadingById((prev) => ({...prev, [id]: false}));
    }

    const handleDelete = async (id) => {
        try {
            setActionLoadingById((prev) => ({...prev, [id]: true}));
            const response = await deleteCar(id);

            if(!response?.success) {
                toast.error(response?.message || 'Failed to delete car');
                return
            }

            setAllCars((prev) => prev.filter((car) => car._id !== id));
            setEditableCars((prev) => {
                const next = {...prev}
                delete next[id]
                return next
            });

            toast.success(response?.message || "Car deleted successfully");
        } catch (error) {
            console.log("An Error Occurred at handleDelete()", error);
            toast.error("Unable to delete car");
        } finally {
            setActionLoadingById((prev) => ({...prev, [id]: false}));
        }
    }

    if(isLoading) {
        return <div className='py-3 font-semibold'>Loading cars...</div>
    }

    if(!allCars.length) {
        return <div className='py-3 font-semibold'>No cars found.</div>
    }
  }


  return (
    <div className='grid grid-cols-2 gap-3 py-3'>
        {
            allCars.map((car) => {
                const editable = editableCars[car._id] || {}
                const isActionLoading = actionLoadingById[car._id]

                return (
                    <div key={car._id} className='bg-[#a4a4a4] rounded-lg flex p-3 gap-3'>
                        <div className='w-3/7 h-full'>
                            <img src={car?.carImageUrl} className='w-full h-full object-cover rounded-md' />
                        </div>
                        <div className='flex flex-col justify-center gap-3 w-4/7'>
                            {[
                                {label: 'Car Name', key: "carName"},
                                {label: 'Description', key: "description"},
                                {label: 'Fuel Type', key: "fuelType"},
                                {label: 'Vehicle Type', key: "vehicleType"},
                                {label: 'Price Per Day', key: "pricePerDay"},
                                {label: 'Car Brand', key: "brand"},
                                {label: 'Availability Status', key: "availabilityStatus"},
                            ].map((field) => (
                                <div 
                                key={field.key}
                                className='flex gap-2 items-center'>
                                    <div className='w-3/7 font-bold tracking-wide'>
                                        {field.label}
                                    </div>
                                    <input 
                                    type='text'
                                    value={editable[field.key] || ''}
                                    onChange={(e => handleChange(car._id, field.key, e.target.value))}
                                    className='w-4/7 font-semibold px-2 py-1 rounded-md bg-amber-50'
                                    />
                                </div>
                            ))}

                            <div className='flex gap-2 justify-end'>
                                <button
                                onClick={() => handleUpdate(car._id)}
                                disabled={isActionLoading}
                                className='transition duration-300 px-3 py-2 bg-[#434343] text-amber-50 font-bold tracking-wide text-center cursor-pointer active:opacity-65 hover:opacity-80 rounded-lg disabled:opacity-50'
                                >
                                    Update
                                </button>
                                <button
                                onClick={() => handleDelete(car._id)}
                                disabled={isActionLoading}
                                className='transition duration-300 px-3 py-2 bg-[#434343] text-amber-50 font-bold tracking-wide text-center cursor-pointer active:opacity-65 hover:opacity-80 rounded-lg disabled:opacity-50'
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })
        }
    </div>
  )
}

export default DisplayCars