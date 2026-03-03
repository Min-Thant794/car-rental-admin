import React from 'react'

const DashboardTable = ({allUsers, allCars, allBookings}) => {

  const countAdmin = allUsers.filter(user => user.role === "Admin").length;
  const countCustomer = allUsers.filter(user => user.role === "Customer").length;
  const availableVehicle = allCars.filter(car => car.availabilityStatus === "Available").length;
  const unavailableVehicle = allCars.filter(car => car.availabilityStatus === "Unavailable").length;
  const maintenanceVehicle = allCars.filter(car => car.availabilityStatus === "Maintenance").length;
  const verifiedCustomer = allUsers.filter(user => user?.customerProfile?.verificationStatus === "verified").length;
  const verifiedCustomerPercent = countCustomer > 0 ? Number(((verifiedCustomer / countCustomer) * 100)).toFixed(2) : 0;
  const pendingCustomer = allUsers.filter(user => user?.customerProfile?.verificationStatus === "pending").length;
  const pendingCustomerPercent = countCustomer > 0 ? Number(((pendingCustomer / countCustomer) * 100)).toFixed(2) : 0;
  const rejectedCustomer = allUsers.filter(user => user?.customerProfile?.verificationStatus === "rejected").length;
  const rejectedCustomerPercent = countCustomer > 0 ? Number(((rejectedCustomer / countCustomer) * 100)).toFixed(2) : 0;
  const availablePercent =  allCars.length > 0 ? Number(((availableVehicle / allCars.length) * 100)).toFixed(2) : 0;
  const unavailablePercent = allCars.length > 0 ? Number(((unavailableVehicle / allCars.length) * 100)).toFixed(2) : 0;
  const maintenancePercent = allCars.length > 0 ? Number(((maintenanceVehicle / allCars.length) * 100)).toFixed(2) : 0;
  const completedBooking = allBookings.filter(booking => booking.bookingStatus === "Completed").length;
  const confirmedBooking = allBookings.filter(booking => booking.bookingStatus === "Confirmed").length;
  const pendingBooking = allBookings.filter(booking => booking.bookingStatus === "Pending").length;
  const cancelledBooking = allBookings.filter(booking => booking.bookingStatus === "Cancelled").length;
  const expiredBooking = allBookings.filter(booking => booking.bookingStatus === "Expired").length;
  const completedPercent = allBookings.length > 0 ? Number(((completedBooking / allBookings.length) * 100)).toFixed(2): 0;
  const confirmedPercent = allBookings.length > 0 ? Number(((confirmedBooking / allBookings.length) * 100)).toFixed(2): 0;
  const pendingPercent = allBookings.length > 0 ? Number(((pendingBooking / allBookings.length) * 100)).toFixed(2): 0;
  const cancelledPercent = allBookings.length > 0 ? Number(((cancelledBooking / allBookings.length) * 100)).toFixed(2): 0;
  const expiredPercent = allBookings.length > 0 ? Number(((expiredBooking / allBookings.length) * 100)).toFixed(2): 0;

  const ProgressBar = ({ value, maxValue }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    return (
        <div style={{ width: '100%', backgroundColor: '#a4a4a4', borderRadius: '20px', overflow: 'hidden', margin: '7px 0px' }}>
            <div
                style={{
                width: `${percentage}%`,
                height: '8px',
                backgroundColor: '#434343',
                borderRadius: '8px',
                transition: 'width 0.3s ease',
                }}
            />
        </div>
    );
  }

  return (
    <div className='w-full'>
        <div className='grid grid-cols-3 bg-[#434343] text-amber-50'>
            <div className='flex flex-col justify-center border-r-2 px-7 py-5'>
                <div className='text-4xl font-bold font-serif'>{allUsers.length}</div>
                <div className='text-sm'>TOTAL USERS</div>
            </div>
            <div className='flex flex-col justify-center border-r-2 px-7 py-5'>
                <div className='text-4xl font-bold font-serif'>{allCars.length}</div>
                <div className='text-sm'>FLEET SIZE</div>
            </div>
            <div className='flex flex-col justify-center px-7 py-5'>
                <div className='text-4xl font-bold font-serif'>{allBookings.length}</div>
                <div className='text-sm'>All Bookings</div>
            </div>
        </div>
        <div className='grid grid-cols-3 bg-[#eaeaea]'>
            <div className='px-7 border-r-2 py-5'>
                <div className='flex'>
                    <span className='px-0.5 mr-3 bg-[#434343]'></span>
                    <div className='font-serif text-lg font-semibold'>
                        Users
                    </div>
                </div>
                <div className='flex gap-1 w-full py-5'>
                    <div className='bg-[#d4d4d4] w-1/2 px-3 py-5 flex flex-col gap-3 justify-center items-center font-semibold'>
                        <div className='font-bold font-serif text-3xl tracking-wide'>{countCustomer || 0}</div>
                        <div>CUSTOMERS</div>
                    </div>
                    <div className='bg-[#434343] w-1/2 px-3 py-5 flex flex-col gap-3 justify-center items-center text-amber-50 font-semibold'>
                        <div className='font-bold font-serif text-3xl tracking-wide'>{countAdmin || 0}</div>
                        <div>ADMINS</div>
                    </div>
                </div>
                <div>
                    <div className='text-xs font-semibold tracking-wide pb-3'>
                        CUSTOMER VERIFICATION
                    </div>
                    <div className='text-sm w-full font-bold tracking-wide flex flex-col gap-2'>
                        <div className='w-full flex flex-col'>
                            <div className='w-full flex justify-between'>
                                <div className='w-1/2'>VERIFIED</div>
                                <div className='flex gap-3 w-1/2'>
                                    <div className='w-3/5 text-end'>
                                        {verifiedCustomer}
                                    </div>
                                    <div className='w-2/5 text-end text-gray-600'>
                                        {verifiedCustomerPercent}%
                                    </div>
                                </div>
                            </div>
                            <div>
                                <ProgressBar value={verifiedCustomer} maxValue={countCustomer}/>
                            </div>
                        </div>
                        <div className='w-full flex flex-col'>
                            <div className='w-full flex justify-between'>
                                <div className='w-1/2'>PENDING</div>
                                <div className='flex gap-3 w-1/2'>
                                    <div className='w-3/5 text-end'>
                                        {pendingCustomer}
                                    </div>
                                    <div className='w-2/5 text-end text-gray-600'>
                                        {pendingCustomerPercent}%
                                    </div>
                                </div>
                            </div>
                            <div>
                                <ProgressBar value={pendingCustomer} maxValue={countCustomer}/>
                            </div>
                        </div>
                        <div className='w-full flex flex-col'>
                            <div className='w-full flex justify-between'>
                                <div className='w-1/2'>REJECTED</div>
                                <div className='flex gap-3 w-1/2'>
                                    <div className='w-3/5 text-end'>
                                        {rejectedCustomer}
                                    </div>
                                    <div className='w-2/5 text-end text-gray-600'>
                                        {rejectedCustomerPercent}%
                                    </div>
                                </div>
                            </div>
                            <div>
                                <ProgressBar value={rejectedCustomer} maxValue={countCustomer}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='px-7 border-r-2 py-5'>
                <div className='flex'>
                    <span className='px-0.5 mr-3 bg-[#434343]'></span>
                    <div className='font-serif text-lg font-semibold'>
                        Fleet
                    </div>
                </div>
                <div className='flex flex-col gap-1 justify-center items-center py-7 text-center w-full'>
                    <div className='font-bold font-serif text-5xl tracking-wide w-full'>
                        {allCars.length}
                    </div>
                    <div className='w-full text-lg font-semibold'>
                        TOTAL VEHICLES
                    </div>
                </div>
                <div className='flex gap-1 w-full'>
                    <div className='bg-[#d4d4d4] w-1/3 px-3 py-5 flex flex-col gap-3 justify-center items-center font-semibold'>
                        <div className='font-bold font-serif text-3xl tracking-wide'>{availableVehicle || 0}</div>
                        <div className='text-sm'>AVAILABLE</div>
                    </div>
                    <div className='bg-[#434343] w-1/3 px-3 py-5 flex flex-col gap-3 justify-center items-center text-amber-50 font-semibold'>
                        <div className='font-bold font-serif text-3xl tracking-wide'>{unavailableVehicle || 0}</div>
                        <div className='text-sm'>UNAVAILABLE</div>
                    </div>
                    <div className='bg-[#434343] w-1/3 px-3 py-5 flex flex-col gap-3 justify-center items-center text-amber-50 font-semibold'>
                        <div className='font-bold font-serif text-3xl tracking-wide'>{maintenanceVehicle || 0}</div>
                        <div className='text-sm'>MAINTENANCE</div>
                    </div>
                </div>
                <div className='text-sm font-bold tracking-wide flex flex-col gap-2 py-3'>
                    <div className='w-full flex flex-col'>
                        <div className='w-full flex justify-between'>
                            <div className='w-1/2'>AVAILABLE</div>
                            <div className='flex gap-3 w-1/2'>
                                <div className='w-3/5 text-end'>
                                    {availableVehicle}
                                </div>
                                <div className='w-2/5 text-end text-gray-600'>
                                    {availablePercent}%
                                </div>
                            </div>
                        </div>
                        <div>
                            <ProgressBar value={availableVehicle} maxValue={allCars.length}/>
                        </div>
                    </div>
                    <div className='w-full flex flex-col'>
                        <div className='w-full flex justify-between'>
                            <div className='w-1/2'>UNAVAILABLE</div>
                            <div className='flex gap-3 w-1/2'>
                                <div className='w-3/5 text-end'>
                                    {unavailableVehicle}
                                </div>
                                <div className='w-2/5 text-end text-gray-600'>
                                    {unavailablePercent}%
                                </div>
                            </div>
                        </div>
                        <div>
                            <ProgressBar value={unavailableVehicle} maxValue={allCars.length}/>
                        </div>
                    </div>
                    <div className='w-full flex flex-col'>
                        <div className='w-full flex justify-between'>
                            <div className='w-1/2'>MAINTENANCE</div>
                            <div className='flex gap-3 w-1/2'>
                                <div className='w-3/5 text-end'>
                                    {maintenanceVehicle}
                                </div>
                                <div className='w-2/5 text-end text-gray-600'>
                                    {maintenancePercent}%
                                </div>
                            </div>
                        </div>
                        <div>
                            <ProgressBar value={maintenanceVehicle} maxValue={allCars.length}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className='px-7 py-5'>
                <div className='flex'>
                    <span className='px-0.5 mr-3 bg-[#434343]'></span>
                    <div className='font-serif text-lg font-semibold'>
                        Bookings
                    </div>
                </div>
                <div className='flex flex-col gap-1 justify-center items-center py-7 text-center w-full'>
                    <div className='font-bold font-serif text-5xl tracking-wide w-full'>
                        {allBookings.length}
                    </div>
                    <div className='w-full text-lg font-semibold'>
                        TOTAL BOOKINGS
                    </div>
                </div>
                <div className='text-sm font-bold tracking-wide flex flex-col gap-2'>
                    <div className='flex flex-col'>
                        <div className='flex justify-between'>
                            <div>COMPLETED</div>
                            <div className='flex gap-3'>
                                <div>
                                    {completedBooking || 0}
                                </div>
                                <div className='text-gray-600'>
                                    {completedPercent}%
                                </div>
                            </div>
                        </div>
                        <div>
                            <ProgressBar value={completedBooking} maxValue={allBookings.length}/>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex justify-between'>
                            <div>CONFIRMED</div>
                            <div className='flex gap-3'>
                                <div>
                                    {confirmedBooking || 0}
                                </div>
                                <div className='text-gray-600'>
                                    {confirmedPercent}%
                                </div>
                            </div>
                        </div>
                        <div>
                            <ProgressBar value={confirmedBooking} maxValue={allBookings.length}/>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex justify-between'>
                            <div>PENDING</div>
                            <div className='flex gap-3'>
                                <div>
                                    {pendingBooking || 0}
                                </div>
                                <div className='text-gray-600'>
                                    {pendingPercent}%
                                </div>
                            </div>
                        </div>
                        <div>
                            <ProgressBar value={pendingBooking} maxValue={allBookings.length}/>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex justify-between'>
                            <div>CANCELLED</div>
                            <div className='flex gap-3'>
                                <div>
                                    {cancelledBooking || 0}
                                </div>
                                <div className='text-gray-600'>
                                    {cancelledPercent}%
                                </div>
                            </div>
                        </div>
                        <div>
                            <ProgressBar value={cancelledBooking} maxValue={allBookings.length}/>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex justify-between'>
                            <div>EXPIRED</div>
                            <div className='flex gap-3'>
                                <div>
                                    {expiredBooking || 0}
                                </div>
                                <div className='text-gray-600'>
                                    {expiredPercent}%
                                </div>
                            </div>
                        </div>
                        <div>
                            <ProgressBar value={expiredBooking} maxValue={allBookings.length}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DashboardTable