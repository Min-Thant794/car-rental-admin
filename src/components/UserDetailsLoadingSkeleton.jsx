import React from 'react'

const UserDetailsLoadingSkeleton = () => {
  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      className='bg-[#a4a4a4] shadow-lg rounded-lg mt-10 py-2 px-5 w-5/10 h-7/10'
    >
      {/* Header */}
      <div className='flex items-center'>
        <div className='skeleton-shimmer h-8 w-32 bg-[#8a8a8a] rounded'></div>
      </div>

      {/* Images Section */}
      <div className='w-full h-fit grid grid-cols-2 py-5 gap-5 col-span-3 rounded-lg'>
        {/* Profile Image Skeleton */}
        <div className='relative w-full'>
          <div className='skeleton-pulse w-full rounded-lg h-65 bg-[#8a8a8a] flex items-center justify-center'>
            <div className='w-24 h-14 rounded-lg'></div>
          </div>
        </div>
        
        {/* License Image Skeleton */}
        <div className='relative w-full'>
          <div className='skeleton-pulse w-full rounded-lg h-65 bg-[#8a8a8a] flex items-center justify-center'>
            <div className='w-24 h-14 rounded-lg'></div>
          </div>
        </div>
      </div>

      {/* Form Fields - 2 columns, 5 rows */}
      <div className='grid gap-3 md:grid-flow-col md:grid-rows-5 md:gap-x-10 w-full'>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className='flex gap-2'>
            {/* Label */}
            <div className='skeleton-shimmer h-7 w-1/2 bg-[#8a8a8a] rounded'></div>
            {/* Input Field */}
            <div className='skeleton-shimmer h-7 w-1/2 bg-[#8a8a8a] rounded-lg'></div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className='flex gap-3 w-full justify-between'>
        {/* Delete Button */}
        <div className='skeleton-shimmer h-10 w-24 bg-[#434343] rounded-lg'></div>
        
        {/* Edit Button */}
        <div className='skeleton-shimmer h-10 w-20 bg-[#434343] rounded-lg'></div>
      </div>
    </div>
  )
}

export default UserDetailsLoadingSkeleton