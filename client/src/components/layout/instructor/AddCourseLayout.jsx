import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import CoursePage from '@/pages/instructor/Courses/AddCourse/CoursePage'
import Outline from '@/pages/instructor/Courses/AddCourse/Outline'
import Settings from '@/pages/instructor/Courses/AddCourse/Settings'

import {
  courseLandingInitialFormData,
  courseOutlineInitialFormData,
} from '@/config/config.js'

import { AuthContext } from '@/context/auth/authContext'
import { InstructorContext } from '@/context/instructor/instructorContext'

import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from '@/services/service'

const AddNewCourseLayout = () => {
  const navigate = useNavigate()
  const params = useParams()
  const { auth } = useContext(AuthContext)

  const {
    courseLandingFormData,
    courseOutlineFormData,
    setCourseLandingFormData,
    setCourseOutlineFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext)

  const [loading, setLoading] = useState(false)

  const isEmpty = (value) => {
    if (Array.isArray(value)) return value.length === 0
    return value === '' || value === null || value === undefined
  }

  const validateFormData = () => {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) return false
    }

    let hasFreePreview = false
    for (const item of courseOutlineFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      )
        return false

      if (item.freePreview) hasFreePreview = true
    }

    return hasFreePreview
  }

  const handleCreateOrUpdateCourse = async () => {
    const finalCourseData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.username,
      date: new Date(),
      ...courseLandingFormData,
      status: 'Pending',
      students: [],
      outline: courseOutlineFormData,
      isPublished: true,
    }

    const response = currentEditedCourseId
      ? await updateCourseByIdService(currentEditedCourseId, finalCourseData)
      : await addNewCourseService(finalCourseData)

    if (response?.success) {
      setCourseLandingFormData(courseLandingInitialFormData)
      setCourseOutlineFormData(courseOutlineInitialFormData)
      setCurrentEditedCourseId(null)
      navigate(-1)
    }
  }

  const fetchCourseDetails = async () => {
    setLoading(true)
    const res = await fetchInstructorCourseDetailsService(currentEditedCourseId)
    if (res?.success) {
      const landingData = Object.keys(courseLandingInitialFormData).reduce(
        (acc, key) => {
          acc[key] = res.data[key] || courseLandingInitialFormData[key]
          return acc
        },
        {}
      )
      setCourseLandingFormData(landingData)
      setCourseOutlineFormData(res.data.outline || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (params?.courseId) {
      setCurrentEditedCourseId(params.courseId)
    } else {
      setCourseLandingFormData(courseLandingInitialFormData)
      setCourseOutlineFormData(courseOutlineInitialFormData)
      setCurrentEditedCourseId(null)
    }
  }, [params.courseId])

  useEffect(() => {
    if (currentEditedCourseId) fetchCourseDetails()
  }, [currentEditedCourseId])

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold mb-5">
          {currentEditedCourseId ? 'Edit Course' : 'Create New Course'}
        </h1>
        <Button
          onClick={handleCreateOrUpdateCourse}
          disabled={!validateFormData()}
          className="text-sm tracking-wider font-bold px-8"
        >
          {currentEditedCourseId ? 'Update' : 'Create'}
        </Button>
      </div>

      <Card>
        <CardContent>
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">
              Loading course data...
            </div>
          ) : (
            <Tabs
              defaultValue={currentEditedCourseId ? 'outline' : 'course-page'}
              className="space-y-4"
            >
              <TabsList>
                <TabsTrigger value="outline">Course Outline</TabsTrigger>
                <TabsTrigger value="course-page">Course Page</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="outline">
                <Outline />
              </TabsContent>
              <TabsContent value="course-page">
                <CoursePage />
              </TabsContent>
              <TabsContent value="settings">
                <Settings />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AddNewCourseLayout
