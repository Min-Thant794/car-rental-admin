import React, { useEffect, useState } from 'react'
import { deleteBooking, getAllBooking, updateBooking } from '../services/booking.service';
import { toast } from 'react-toastify';
import { FaPencil } from 'react-icons/fa6';
import { MdDeleteOutline } from "react-icons/md";
import DeleteBookingConfirm from '../components/DeleteBookingConfirm';

const Booking = () => {

  const [allBookings, setAllBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [newBookingStatus, setNewBookingStatus] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [deleteBookingId, setDeleteBookingId] = useState(null);

  const fetchAllBookings = async () => {
    try {
      setIsLoading(true);
      const response = await getAllBooking();

      if(!response?.success) {
        toast.error(response?.message || "Failed to fetch booking");
        console.log("Failed to fetch booking");
        return;
      }

      toast.success(response?.data?.message);
      setAllBookings(response?.data);
      console.log("fetchAllBookings response:", response.data);
    } catch (error) {
      console.log("An Error Occurred at fetchAllBookings()", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdateBooking = async (bookingId) => {
    try {
      setIsLoading(true);
      const response = await updateBooking(bookingId, {bookingStatus: newBookingStatus});
      if(!response?.success) {
        toast.error(response?.message || "Failed to update booking");
        console.log("Failed to update booking");
        return;
      }
      toast.success(response?.message || `Booking ID ${bookingId} is successfully updated!`);
      await fetchAllBookings();
      setNewBookingStatus("");
    } catch (error) {
      console.log("An Error Occurred at handleUpdateBooking()", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteBooking = async (bookingId) => {
    try {
      setIsLoading(true);
      const response = await deleteBooking(bookingId);

      if(!response?.success) {
        toast.error(response?.message || "Failed to delete booking");
        console.log("Failed to delete booking");
        return;
      }

      toast.success(response?.message || "Booking ID is deleted successfully");
      console.log("Booking ID is successfully deleted");
      await fetchAllBookings();
      setNewBookingStatus("");
    } catch (error) {
      console.log("An Error Occurred at handleDeleteBooking()", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAllBookings();
  }, []);

  return (
    <div>
      <div className='w-full text-center font-bold pb-5'>
        Total {allBookings.length} Bookings Found!
      </div>
      <table className='w-full text-left'>
        <thead className='bg-[#434343] text-amber-50'>
            <tr>
              <th className='p-3 border-r-2 border-[#eaeaea] text-left'>Booking ID</th>
              <th className='p-3 border-r-2 border-[#eaeaea] text-center'>Customer Name</th>
              <th className='p-3 border-r-2 border-[#eaeaea] text-center'>Car Name</th>
              <th className='p-3 border-r-2 border-[#eaeaea] text-center'>Start Date</th>
              <th className='p-3 border-r-2 border-[#eaeaea] text-center'>End Date</th>
              <th className='p-3 border-r-2 border-[#eaeaea] text-center w-30'>Status</th>
              <th className='p-3 text-center w-45'>Actions</th>
            </tr>
        </thead>
        <tbody>
          {
            allBookings.map((booking) => (
              <tr 
              key={booking?._id}
              className='font-semibold bg-[#a4a4a4]'>
                <td className='p-3 border-r-2 border-[#eaeaea]'>{booking?._id}</td>
                <td className='p-3 border-r-2 border-[#eaeaea] text-center'>{booking?.customerId?.userId?.userName}</td>
                <td className='p-3 border-r-2 border-[#eaeaea] text-center'>{booking?.carId?.carName}</td>
                <td className='p-3 border-r-2 border-[#eaeaea] text-center'>{booking?.startDate.slice(0,10)}</td>
                <td className='p-3 border-r-2 border-[#eaeaea] text-center'>{booking?.endDate.slice(0, 10)}</td>
                <td className='p-3 border-r-2 border-[#eaeaea] text-center'>
                  {selectedBookingId === booking?._id && booking?.bookingStatus === "Pending" ?
                    <select 
                    onChange={(e) => setNewBookingStatus(e.target.value)}
                    name={booking?.bookingStatus} className='outline-none'>
                      <option>{booking?.bookingStatus}</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    :
                    <div>
                      {booking?.bookingStatus}
                    </div>
                  }
                </td>
                <td className='flex w-full'>
                  {
                    selectedBookingId === booking?._id && booking?.bookingStatus === "Pending" ?
                    <div className='flex w-full gap-2 justify-center items-center py-2'>
                      <div
                      onClick={() => setSelectedBookingId(null)}
                      className='flex justify-start m-2 items-center gap-1 px-2 py-1 rounded-md bg-[#ff0000] active:opacity-65 hover:opacity-90 cursor-pointer text-amber-50 font-semibold shadow-gray-700 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]'
                      >
                        Cancel
                      </div>
                      <div
                        onClick={() => handleUpdateBooking(booking?._id)}
                        className='flex justify-center items-center gap-1 px-2 py-1 rounded-md bg-[#434343] active:opacity-65 hover:opacity-90 cursor-pointer text-amber-50 font-semibold shadow-gray-700 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]'
                      >
                        Update
                      </div>
                    </div>
                    :
                    <div className='flex w-full justify-between px-5 items-center py-2'>
                      {
                        booking?.bookingStatus === "Pending" &&
                        <div 
                        onClick={() => {
                          setSelectedBookingId(booking?._id);
                          setNewBookingStatus(booking?.bookingStatus);
                        }}
                        className='flex justify-start my-2 items-center gap-1 px-2 py-1 rounded-md bg-blue-600 active:opacity-65 hover:opacity-90 cursor-pointer text-amber-50 font-semibold shadow-gray-700 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]'>
                          <div>
                            Edit
                          </div>
                          <FaPencil/>
                        </div>
                      }
                      <div
                      onClick={() => {
                        setIsDelete(true);
                        setDeleteBookingId(booking?._id)
                      }}
                      className='flex justify-end my-2 items-center px-2 py-1 rounded-md bg-[#ff0000] active:opacity-65 hover:opacity-90 cursor-pointer text-amber-50 font-semibold shadow-gray-700 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]'>
                        <div>
                          Delete
                        </div>
                      </div>
                    </div>
                  }
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      {
        isDelete &&
        <DeleteBookingConfirm
        deleteBookingId={deleteBookingId}
        setDeleteBookingId={setDeleteBookingId}
        handleDeleteBooking={handleDeleteBooking}
        setIsDelete={setIsDelete}
        />
      }
    </div>
  )
}

export default Booking