import React, { useEffect, useState } from 'react'
import DashboardTable from '../components/DashboardTable'
import { getAllUser } from '../services/user.service'
import { toast } from 'react-toastify'
import { getAllCar } from '../services/car.service'
import { getAllBooking } from '../services/booking.service'

const Dashboard = () => {

  const [allUsers, setAllUsers] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUser();

      if(!response?.success) {
        toast.error("Failed to fetch user");
        console.log("Failed to fetch user");
      }

      console.log("fetchUsers() response: ", response?.data);
      setAllUsers(response?.data);
      console.log("admin:", countAdmin);
    } catch (error) {
      console.log("An Error Occurred at fetchUsers()", error);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      
      const limit = 15;
      let page = 1;
      let all = [];
      let totalPages = 1;

      do {
        const response = await getAllCar(page, limit);

        if(!response?.success) {
          toast.error(response?.message || "Failed to fetch cars");
          return;
        }

        all = all.concat(response?.data || []);
        totalPages = response?.pagination?.totalPages || 1;
        page += 1;
      } while (page <= totalPages);

      setAllCars(all);
    } catch (error) {
      console.log("An Error Occurred at fetchCars()", error);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchBookings = async () => {
    try {
      setIsLoading(true);

      const response = await getAllBooking();

      if(!response?.success) {
        toast.error("Failed to fetch bookings");
        console.log("Failed to fetch bookings");
      }

      console.log("fetchBookings() response:", response?.data);
      setAllBookings(response?.data);
    } catch (error) {
      console.log("An Error Occurred at fetchBookings()", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
    fetchCars();
    fetchBookings();
  }, []);

  return (
    <div className='p-5'>
      <DashboardTable
      allUsers={allUsers}
      allCars={allCars}
      allBookings={allBookings}
      />
    </div>
  )
}

export default Dashboard