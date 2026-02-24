import React, { useEffect, useState } from 'react'
import { getAllCar, updateCar, deleteCar } from '../services/car.service'
import { toast } from 'react-toastify';
import CarSkeletonLoading from './CarSkeletonLoading';

const DisplayCars = ({refreshTrigger}) => {

  const [allCars, setAllCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editableCars, setEditableCars] = useState({});
  const [actionLoadingById, setActionLoadingById] = useState({});
  const [editingCarId, setEditingCarId] = useState(null);
  const [previewImgById, setPreviewImgById] = useState({});
  const [fileById, setFileById] = useState({});

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
                    discount: car?.discount || '',
                    brand: car?.brand || '',
                    availabilityStatus: car?.availabilityStatus || ''
                }
                return acc
            }, {});

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
    fetchAllCars();
  }, [refreshTrigger]);

  const handleChange = (id, field, value) => {
    setEditableCars((prev) => ({
        ...prev,
        [id]: {
            ...prev[id],
            [field]: value
        }
    }));
  }

  const uploadImage = (carId, file) => {
    if(!file) return;
    setFileById((prev) => ({...prev, [carId]: file}));

    const url = URL.createObjectURL(file);
    setPreviewImgById((prev) => ({...prev, [carId]:url}));
  }

  const handleUpdate = async(id) => {
    try {
        setActionLoadingById((prev) => ({ ...prev, [id]: true}));
        const editableCar = editableCars[id]

        if(!editableCar) return

        const fd = new FormData();
        fd.append("carName", editableCar.carName);
        fd.append("description", editableCar.description);
        fd.append("fuelType", editableCar.fuelType);
        fd.append("vehicleType", editableCar.vehicleType);
        fd.append("pricePerDay", editableCar.pricePerDay);
        fd.append("discount", editableCar.discount);
        fd.append("brand", editableCar.brand);
        fd.append("availabilityStatus", editableCar.availabilityStatus);

        if(fileById[id]) {
            fd.append("carImageUrl", fileById[id]);
        }

        const response = await updateCar(id, fd);

        if(!response?.success) {
            toast.error(response?.message || 'Failed to update car');
            return;
        }

        const updatedCarFromServer = response?.data;
        if(updatedCarFromServer) {
            setAllCars((prev) => prev.map((c) => (c._id === id ? updatedCarFromServer : c)));
        } else {
            setAllCars((prev) => prev.map((c) => (c._id === id ? { ...c, ...editableCar} : c)));
        }

        setFileById((prev) => {
            const n = {...prev}; delete n[id]; return n;
        });

        setPreviewImgById((prev) => {
            const n = {...prev}; delete n[id]; return n;
        })

        setEditingCarId(null);
        toast.success(response?.message || "Car updated successfully!");
    } catch (error) {
        console.log("An Error Occurred at handleUpdate()", error);
        toast.error("Unable to update car");
    } finally {
        setActionLoadingById((prev) => ({...prev, [id]: false}));
    }
  }

  const handleDelete = async(id) => {
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

  const handleCancelUpdate = (carId) => {
    const originalCar = allCars.find(car => car._id === carId);
    if (!originalCar) return;
    setEditableCars(prev => ({
        ...prev,
        [carId]: { ...originalCar }
    }));
    setEditingCarId(null);
  };

  if(isLoading) {
      return <CarSkeletonLoading/>
  }

  if(!allCars.length) {
      return <div className='py-3 font-semibold'>No cars found.</div>
  }


  return (
    <div className='w-full gap-3 py-3'>
        <div className='w-full font-semibold tracking-wide text-center pb-2'>
            Total&nbsp;
            {allCars.length}
            {allCars.length > 1 ? " cars " : " car "}
            available in this platform.
        </div>
        {
            allCars.map((car) => {
                const isEdit = editingCarId === car._id;
                const editable = editableCars[car._id] || {}
                const discount = Number(editable.discount ?? car.discount ?? 0);
                const pricePerDay = Number(editable.pricePerDay ?? car.pricePerDay ?? 0);

                const discountedPrice = discount > 0 
                ? (pricePerDay - (pricePerDay * discount) / 100).toFixed(2)
                : null;

                const isActionLoading = actionLoadingById[car._id]
                const inputId = `fileupload-${car._id}`;

                return (
                    <div key={car._id} className='bg-[#a4a4a4] rounded-lg grid grid-cols-7 p-3 gap-3 mt-5'>
                        <div className='relative col-span-4'>
                            <img src={previewImgById[car._id] || car?.carImageUrl} className='w-full h-88 object-fit rounded-md' />
                            {
                                isEdit &&
                                <div>
                                    <div 
                                    onClick={() => document.getElementById(inputId)?.click()}
                                    className='absolute px-3 py-2 right-2 bottom-2 font-semibold rounded-lg text-amber-50 bg-[#434343] active:opacity-65 hover:opacity-90 cursor-pointer'>
                                        Upload
                                    </div>
                                    <input 
                                    type="file"
                                    multiple={false} 
                                    accept='image/*'
                                    id={inputId}
                                    className='hidden'
                                    onChange={(e) => uploadImage(car._id, e.target.files[0])}
                                    />
                                </div>
                            }
                        </div>
                        <div className='flex flex-col justify-center gap-3 col-span-3'>
                            {[
                                {label: 'Car Name', key: "carName"},
                                {label: 'Description', key: "description"},
                                {label: 'Fuel Type', key: "fuelType", options: ["Diesel", "Electric", "Petrol"]},
                                {label: 'Vehicle Type', key: "vehicleType", options: ["Crossover", "Sedan", "SUV", "MPV", "Hatchback", "Station Wagon"]},
                                {label: 'Price Per Day (SGD)', key: "pricePerDay"},
                                {label: 'Discount %', key: "discount", options: ["0", "10", "15", "20", "25", "30", "35", "40", "45", "50"]},
                                {label: 'Car Brand', key: "brand"},
                                {label: 'Availability Status', key: "availabilityStatus", options: ["Available", "Unavailable", "Maintenance"]},
                            ].map((field) => (
                                <div 
                                key={field.key}
                                className='flex gap-2 items-center'>
                                    <div className='w-3/7 font-bold tracking-wide'>
                                        {field.label}
                                    </div>
                                    {field.options ? 
                                    (
                                        isEdit ? 
                                        (
                                            <select
                                            value={editable[field.key] || ''}
                                            onChange={(e) => handleChange(car._id, field.key, e.target.value)}
                                            className='w-4/7 font-semibold px-2 py-1 cursor-pointer rounded-md outline-none bg-amber-50'
                                            >
                                                {field.options.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        ) 
                                        : 
                                        (
                                            <input 
                                            type='text'
                                            value={editable[field.key] || ''}
                                            readOnly={true}
                                            className='w-4/7 font-semibold px-2 py-1 rounded-md outline-none bg-amber-50'
                                            />
                                        )
                                    ) : 
                                    (
                                        <input 
                                        type='text'
                                        value={editable[field.key] || ''}
                                        readOnly={!isEdit}
                                        onChange={(e => handleChange(car._id, field.key, e.target.value))}
                                        className='w-4/7 font-semibold px-2 py-1 rounded-md outline-none bg-amber-50'
                                        />
                                    )}
                                </div>
                            ))}

                            {
                                discountedPrice && (
                                    <div className='flex gap-2 items-center'>
                                        <div className='w-3/7 font-bold tracking-wide'>
                                            Discounted Price
                                        </div>
                                        <input type="text"
                                        value={discountedPrice}
                                        readOnly
                                        className='w-4/7 font-semibold px-2 py-1 rounded-md outline-none bg-amber-50'
                                        />
                                    </div>
                                )
                            }

                            <div className='relative w-full flex gap-3 justify-end'>
                                <button
                                onClick={() => handleDelete(car._id)}
                                disabled={isActionLoading}
                                className='transition duration-300 px-3 py-2 bg-[#ff0000] text-amber-50 font-bold tracking-wide text-center cursor-pointer active:opacity-65 hover:opacity-80 rounded-lg disabled:opacity-50'
                                >
                                    Delete
                                </button>
                                <div 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingCarId(car._id);
                                }}
                                className={`absolute bottom-0 right-22 ${isEdit && "opacity-0 pointer-events-none"} transition duration-300 px-3 py-2 bg-[#434343] w-2/13 cursor-pointer active:opacity-65 hover:opacity-80 rounded-lg text-center font-bold tracking-wide text-amber-50`}>
                                    Edit
                                </div>
                                {
                                    isEdit &&
                                    <div className='relative flex gap-3 justify-end'>
                                        <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingCarId(null);
                                            handleCancelUpdate(car._id);
                                        }}
                                        className='absolute right-45 transition duration-300 px-3 py-2 bg-[#434343] text-amber-50 font-bold tracking-wide text-center cursor-pointer active:opacity-65 hover:opacity-80 rounded-lg disabled:opacity-50'
                                        >
                                            Cancel
                                        </button>
                                        <button
                                        onClick={() => handleUpdate(car._id)}
                                        disabled={isActionLoading}
                                        className='transition duration-300 px-3 py-2 bg-[#434343] text-amber-50 font-bold tracking-wide text-center cursor-pointer active:opacity-65 hover:opacity-80 rounded-lg disabled:opacity-50'
                                        >
                                            Update
                                        </button>
                                    </div>
                                }
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