import React from 'react'

const DeleteConfirm = ({handleDeleteUser, setIsEdit, setIsDelete, userId, setIsClick}) => {
  return (
    <div 
    key={userId}
    className='z-50 flex justify-center items-center absolute top-50 right-50 w-4/9 h-2/7'>
        <div className='text-center px-3 py-2 rounded-lg bg-[#434343] text-amber-50'>
            <div className='font-bold tracking-wide text-2xl'>
                Delete User
            </div>
            <div>
                Are you sure you want to delete this user?
            </div>
            <div>
                This action cannot be undone.
            </div>
            <div className='flex justify-between gap-5 pt-5 pb-3'>
                <div 
                onClick={() => {
                    setIsDelete(false)
                    setIsEdit(false)
                }}
                className='bg-[#a4a4a4] w-1/2 py-2 cursor-pointer active:opacity-65 hover:opacity-85 rounded-lg shadow-lg'>
                    Cancel
                </div>
                <div 
                onClick={async () => {
                    setIsClick(false);
                    await handleDeleteUser(userId);
                    setIsDelete(false);
                    setIsEdit(false);
                    
                }}
                className='bg-[#ff0000] w-1/2 py-2 cursor-pointer active:opacity-65 hover:opacity-85 rounded-lg shadow-lg'>
                    Delete
                </div>
            </div>
        </div>
    </div>
  )
}

export default DeleteConfirm