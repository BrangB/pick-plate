import React from 'react'
import Signout from "@/components/Buttons/Signout"

const Page = () => {
  return (
    <div className='bg-waikawa-gray-600 text-waikawa-gray-100 w-screen h-screen flex items-center justify-center'>
      <h1>Home Page</h1>
      <Signout />
    </div>
  )
}

export default Page