import React from 'react'
import Logo from './Logo'

const Navbar = () => {
  return (
    
    <div className='w-full shadow-navbarShadow h-20 lg:h-[12vh] sticky top-0 z-50 bg-bodyColor px-4'>
        <Logo/>
    </div>
  )
}

export default Navbar