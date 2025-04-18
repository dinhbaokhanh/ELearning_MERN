import React, { useState } from 'react'
import { StudentContext } from './studentContext'

export const StudentProvider = ({ children }) => {
  const [studentCourseList, setStudentCourseList] = useState([])
  const [loadingState, setLoadingState] = useState(true)

  return (
    <StudentContext.Provider
      value={{
        studentCourseList,
        setStudentCourseList,
        loadingState,
        setLoadingState,
      }}
    >
      {children}
    </StudentContext.Provider>
  )
}
