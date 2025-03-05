import React from 'react'

const Title = ({text1,text2}) => {
  return (
    <div className='inline-flex gap-2 items-center mb-3 '>
       {/* <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-orange-900'></p> */}
        <p className='text-black text-3xl lg:text-5xl teko font-medium'>{text1} <span className='text-black font-medium text-3xl lg:text-5xl teko'>{text2}</span></p>
        {/* <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-orange-900'></p> */}
    </div>
  )
}

export default Title