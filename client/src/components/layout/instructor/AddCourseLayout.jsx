import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  courseLandingInitialFormData,
  courseOutlineInitialFormData,
} from '@/config/config.js'
import { AuthContext } from '@/context/auth/authContext'
import { InstructorContext } from '@/context/instructor/instructorContext'
import CoursePage from '@/pages/instructor/Courses/AddCourse/CoursePage'
import Outline from '@/pages/instructor/Courses/AddCourse/Outline'
import Settings from '@/pages/instructor/Courses/AddCourse/Settings'
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from '@/services/service'
import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const AddNewCourseLayout = () => {
  const {
    courseLandingFormData,
    courseOutlineFormData,
    setCourseLandingFormData,
    setCourseOutlineFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext)

  const { auth } = useContext(AuthContext)
  const navigate = useNavigate()
  const params = useParams()

  const isEmpty = (value) => {
    if (Array.isArray(value)) {
      return value.length === 0
    }
    return value === '' || value === null || value === undefined
  }

  const validateFormData = () => {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false
      }
    }

    let hasFreePreview = false
    for (const item of courseOutlineFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false
      }

      if (item.freePreview) {
        hasFreePreview = true
      }
    }

    return hasFreePreview
  }

  const handleCreateCourse = async () => {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.username,
      date: new Date(),
      ...courseLandingFormData,
      status: 'Pending',
      students: [],
      outline: courseOutlineFormData,
      isPublished: true,
    }

    const response =
      currentEditedCourseId !== null
        ? await updateCourseByIdService(
            currentEditedCourseId,
            courseFinalFormData
          )
        : await addNewCourseService(courseFinalFormData)

    if (response?.success) {
      setCourseLandingFormData(courseLandingInitialFormData)
      setCourseOutlineFormData(courseOutlineInitialFormData)
      navigate(-1)
      setCurrentEditedCourseId(null)
    }
  }

  const fetchCurrentCourseDetails = async () => {
    const res = await fetchInstructorCourseDetailsService(currentEditedCourseId)

    if (res?.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = res?.data[key] || courseLandingInitialFormData[key]
        return acc
      }, {})

      console.log(setCourseFormData)
      setCourseLandingFormData(setCourseFormData)
      setCourseOutlineFormData(res?.data?.outline)
    }
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails()
  }, [currentEditedCourseId])

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId)
  }, [params?.courseId])

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-extrabold mb-5">Create New Course</h1>
        <Button
          disabled={!validateFormData()}
          className="text-sm tracking-wider font-bold px-8"
          onClick={handleCreateCourse}
        >
          Create
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="outline" className="space-y-4">
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddNewCourseLayout
