import React, { useState } from 'react'
import { AdminContext } from './adminContext'

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [providerRequests, setProviderRequests] = useState([])

  const [courses, setCourses] = useState([])
  const [courseDetails, setCourseDetails] = useState(null)

  return (
    <AdminContext.Provider
      value={{
        users,
        setUsers,
        providerRequests,
        setProviderRequests,
        courses,
        setCourses,
        courseDetails,
        setCourseDetails,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}
