import React from 'react'

const AllMessages = () => {
  return (
    <div>
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className='rounded-full h-12 w-12 bg-green-900'></div>
                <div>
                    <div className='flex gap-2'><h1 className='font-semibold'>Muna Jamaji</h1> <span className='text-gray-500 text-xs'>@munajamaji</span></div>
                    <span className='text-gray-500 text-xs'>💼 I'm considering a job offer, but I'm torn between </span>
                </div>
            </div>
            <div className='flex flex-col items-center justify-end'>
                <span className='text-gray-500 text-xs'>1:58 PM</span>
                <div className='flex justify-center items-center bg-[#B475CC] text-white rounded-full h-4 w-4 text-center'>
                    <span className='text-xs text-center'>3</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AllMessages