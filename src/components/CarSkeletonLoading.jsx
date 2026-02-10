import React from 'react'

const CarSkeletonLoading = () => {
  return (
    <div className='w-full overflow-hidden gap-3 py-3'>
      {[...Array(4)].map((_, index) => (
        <div key={index} className='bg-[#a4a4a4] rounded-lg grid grid-cols-7 p-3 gap-3 animate-pulse mb-3'>
          {/* Image skeleton */}
          <div className='relative col-span-4'>
            <div className='w-full h-88 bg-[#8a8a8a] rounded-md relative overflow-hidden'>
              <div className='absolute inset-0 shimmer'></div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className='flex flex-col justify-center gap-3 col-span-3'>
            {/* Form fields skeleton */}
            {[...Array(7)].map((_, fieldIndex) => (
              <div key={fieldIndex} className='flex gap-2 items-center'>
                {/* Label skeleton */}
                <div className='w-3/7 h-5 bg-[#8a8a8a] rounded relative overflow-hidden'>
                  <div className='absolute inset-0 shimmer'></div>
                </div>
                {/* Input skeleton */}
                <div className='w-4/7 h-9 bg-[#8a8a8a] rounded-md relative overflow-hidden'>
                  <div className='absolute inset-0 shimmer'></div>
                </div>
              </div>
            ))}

            {/* Buttons skeleton */}
            <div className='relative w-full flex gap-3 justify-end'>
              <div className='w-20 h-10 bg-[#8a8a8a] rounded-lg relative overflow-hidden'>
                <div className='absolute inset-0 shimmer'></div>
              </div>
              <div className='w-24 h-10 bg-[#8a8a8a] rounded-lg relative overflow-hidden'>
                <div className='absolute inset-0 shimmer'></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CarSkeletonLoading