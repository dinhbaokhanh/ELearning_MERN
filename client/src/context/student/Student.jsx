import React, { useState } from 'react'
import { StudentContext } from './studentContext'

export const StudentProvider = ({ children }) => {
  const [studentCourseList, setStudentCourseList] = useState([])
  const [loadingState, setLoadingState] = useState(true)
  const [studentCourseDetails, setStudentCourseDetails] = useState(null)
  const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null)
  const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([])
  const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] =
    useState({})

  return (
    <StudentContext.Provider
      value={{
        studentCourseList,
        setStudentCourseList,
        loadingState,
        setLoadingState,
        studentCourseDetails,
        setStudentCourseDetails,
        currentCourseDetailsId,
        setCurrentCourseDetailsId,
        studentBoughtCoursesList,
        setStudentBoughtCoursesList,
        studentCurrentCourseProgress,
        setStudentCurrentCourseProgress,
      }}
    >
      {children}
    </StudentContext.Provider>
  )
}
