import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const CommonLayout = () => {
  const location = useLocation()
  return (
    <div>
      {!location.pathname.includes('course-progress') ? <Header /> : null}
      <Outlet />
      {!location.pathname.includes('course-progress') ? <Footer /> : null}
    </div>
  )
}

export default CommonLayout
