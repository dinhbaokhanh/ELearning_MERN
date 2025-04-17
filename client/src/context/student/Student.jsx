import React, { useState } from 'react'
import { StudentContext } from './studentContext'

export const StudentProvider = ({ children }) => {
  const [studentCourseList, setStudentCourseList] = useState([])

  return (
    <StudentContext.Provider
      value={{ studentCourseList, setStudentCourseList }}
    >
      {children}
    </StudentContext.Provider>
  )
}
