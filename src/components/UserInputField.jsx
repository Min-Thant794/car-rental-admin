import React from 'react'

const UserInputField = ({ label, name, type, value, onChange, disabled, showPasswordToggle, onTogglePassword, showPassword}) => {
  return (
    <div>
        <label htmlFor={name} className='font-semibold'>{label}</label>
        <div className='flex items-center gap-2'>
        <input
            id={name}
            type={showPasswordToggle && !showPassword ? 'password' : type}
            value={value || ''}
            onChange={onChange}
            disabled={disabled}
            className='outline-none px-2 py-1'
        />
        {showPasswordToggle && (
            <button type="button" onClick={onTogglePassword}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
        )}
        </div>
    </div>
  )
}

export default UserInputField