import React from 'react'
import { IoClose } from 'react-icons/io5'

const DeleteBookingConfirm = ({deleteBookingId, setDeleteBookingId, setIsDelete, handleDeleteBooking}) => {
  return (
    <div 
    onClick={() => setIsDelete(false)}
    className='absolute inset-0 h-full bg-black/10 flex justify-center items-center'>
        <div 
        onClick={(e) => {
            e.stopPropagation();
        }}
        className='bg-[#434343] rounded-md text-amber-50 w-1/3 p-5 shadow-gray-700 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]'>
            <div className='flex text-2xl font-bold pb-5 border-b-2 border-[#a4a4a4] justify-between items-center'>
                <div>
                    Confirm Delete
                </div>
                <IoClose
                onClick={() => setIsDelete(false)}
                />
            </div>
            <div className='font-semibold py-5 border-b-2 border-[#a4a4a4]'>
                Are you sure you want to delete this booking (ID: <span className='font-bold'>{deleteBookingId}</span>)?
                This cannot be undone.
            </div>
            <div className='flex justify-end items-center gap-2 pt-5'>
                <div
                onClick={() => {
                    setDeleteBookingId(null);
                    setIsDelete(false);
                }}
                className='px-3 py-2 rounded-md bg-[#eaeaea] text-black font-bold cursor-pointer active:opacity-65 hover:opacity-90 shadow-gray-700 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]'
                >
                    Cancel
                </div>
                <div
                onClick={() => {
                    handleDeleteBooking(deleteBookingId);
                    setIsDelete(false);
                }}
                className='px-3 py-2 rounded-md bg-[#ff0000] font-bold cursor-pointer active:opacity-65 hover:opacity-90 shadow-gray-700 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]'
                >
                    Delete
                </div>
            </div>
        </div>
    </div>
  )
}

export default DeleteBookingConfirm