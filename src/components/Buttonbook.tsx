import React, { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
}
const Button = ({ children }: ButtonProps) => {
  return (
    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>{children}</button>
  )
}

export default Button
