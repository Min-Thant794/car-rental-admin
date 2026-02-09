// import React from 'react'
// import { useRef } from 'react'

// const AutoResizeTextarea = (value, onChange, placeholder, rows = 3, ...props) => {

//   const textAreaRef = useRef(null);

//   const handleInput = (e) => {
//     const el = textAreaRef.current;

//     el.style.height = "auto";
//     el.style.height = el.scrollHeight + "px";

//     if(onChange) onChange(e);
//   };

//   return (
//     <textarea 
//     ref={textAreaRef}
//     rows={rows}
//     placeholder={placeholder}
//     value={value}
//     onChange={handleInput}
//     className='w-full
//         rounded-lg
//         border border-gray-300
//         px-4 py-2
//         focus:outline-none
//         focus:ring-2 focus:ring-indigo-500
//         resize-none
//         overflow-hidden
//         transition-all'
//     />
//   )
// }

// export default AutoResizeTextarea