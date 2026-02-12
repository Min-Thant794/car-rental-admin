import React from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const UserInputField = ({ label, name, type, value, onChange, readOnly, showPasswordToggle, onTogglePassword, showPassword, placeholder, options}) => {
  return (
    <div className='grid grid-cols-[160px_1fr] gap-3'>
        <label htmlFor={name} className='font-semibold tracking-wide'>{label}</label>
        <div className='flex bg-[#d6d6d6] p-1 rounded-lg'>
            {
                options ? (
                    <select
                        id={name}
                        name={name}
                        value={value ?? ""}
                        onChange={onChange}
                        disabled={readOnly}
                        className='outline-none cursor-pointer w-full'
                    >
                        {options.map((opt) => (
                            <option
                            key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}  
                    </select>
                )
                :
                (
                    <>
                        <input
                            id={name}
                            type={showPasswordToggle && !showPassword ? 'password' : type}
                            value={value ?? ""}
                            onChange={onChange}
                            readOnly={readOnly}
                            placeholder={placeholder ?? "Not Provided"}
                            className='outline-none w-full'
                        />
                        {showPasswordToggle && (
                        <button 
                        type="button" 
                        onClick={onTogglePassword}
                        className='w-2/10'
                        >
                        {showPassword ? <FaEye className='cursor-pointer active:opacity-65'/> : <FaEyeSlash className='cursor-pointer active:opacity-65'/>}
                        </button>
                    )}
                    </>
                )
            }
        </div>
    </div>
  )
}

export default UserInputField