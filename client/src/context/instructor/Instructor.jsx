import React, { useState } from 'react'
import { InstructorContext } from './instructorContext'
import {
  courseLandingInitialFormData,
  courseOutlineInitialFormData,
} from '@/config/config'

export const InstructorProvider = ({ children }) => {
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  )

  const [courseOutlineFormData, setCourseOutlineFormData] = useState(
    courseOutlineInitialFormData
  )

  const [mediaUploadProgress, setMediaUploadProgress] = useState(false)
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
    useState(0)

  const [instructorCourseList, setInstructorCourseList] = useState([])
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null)

  return (
    <InstructorContext.Provider
      value={{
        courseLandingFormData,
        setCourseLandingFormData,
        courseOutlineFormData,
        setCourseOutlineFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
        instructorCourseList,
        setInstructorCourseList,
        currentEditedCourseId,
        setCurrentEditedCourseId,
      }}
    >
      {children}
    </InstructorContext.Provider>
  )
}
