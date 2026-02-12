import React from 'react'

const CreateUser = () => {
  return (
    <div 
    onClick={(e) => {
        e.stopPropagation();
    }}
    className='bg-[#a4a4a4] rounded-lg'>
        <div>Add User</div>
    </div>
  )
}

export default CreateUser