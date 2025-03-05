// import React from "react";

// const Button = ({ children, className, ...props }) => {
//   return (
//     <button className={`p-[3px] relative ${className}`} {...props}>
//       {/* Gradient border */}
//       <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-950 " />
      
//       {/* Inner content with hover effect */}
//       <div className="px-8 py-2 bg-blue-950  relative group transition duration-200 text-white hover:bg-transparent">
//         {children}
//       </div>
//     </button>
//   );
// };

// export default Button;


// import React from "react";

// const Button = ({ children, className, ...props }) => {
//   return (
//     <button
//       className={` relative overflow-hidden rounded ${className}`}
//       {...props}
//     >
//       {/* Gradient border */}
//       {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-950"></div> */}

//       {/* Inner content with new hover transition */}
//       <div className="px-8 py-2 bg-black text-white relative group  hover:text-orange-600 hover:bg-white transition-transform duration-300 ease-in-out teko border border-black hover:border-white rounded-full text-md ">
//         {children}
//       </div>
//     </button>
//   );
// };

// export default Button;



import React from "react";

const Button = ({ children, className,icon, ...props }) => {
  return (
    <button
      className={`relative overflow-hidden rounded ${className}`}
      {...props}
    >
      {/* Inner content with fill effect on hover */}
      <div className="relative px-6 py-2 lg:px-8 lg:py-4 bg-black text-white overflow-hidden rounded-full text-md teko border border-black group">
        {/* The fill effect element */}
        <span className="absolute inset-0 bg-white w-0 group-hover:w-full transition-all duration-300 ease-in-out"></span>
        
        {/* Text that changes color on hover */}
        <span className="relative z-10 group-hover:text-black font-semibold transition-colors duration-300 ease-in-out flex justify-center items-center gap-2">
          {children}
          {icon}
        </span>
      </div>
    </button>
  );
};

export default Button;
