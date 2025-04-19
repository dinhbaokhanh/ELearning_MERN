import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import VideoPlayer from '@/components/video/Video'
import { AuthContext } from '@/context/auth/authContext'
import { StudentContext } from '@/context/student/studentContext'
import {
  createPaymentService,
  fetchStudentCoursesDetailsService,
} from '@/services/service'
import { PlayCircle, Lock } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

const CourseDetails = () => {
  const {
    studentCourseDetails,
    setStudentCourseDetails,
    loadingState,
    setLoadingState,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
  } = useContext(StudentContext)

  const { auth } = useContext(AuthContext)
  const { id } = useParams()
  const location = useLocation()
  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null)
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false)
  const [approvalUrl, setApprovalUrl] = useState('')
  const [isPurchased, setIsPurchased] = useState(null)

  const fetchStudentCoursesDetails = async () => {
    const res = await fetchStudentCoursesDetailsService(
      currentCourseDetailsId,
      auth?.user?._id
    )
    if (res?.success) {
      setStudentCourseDetails(res?.data)
      setIsPurchased(res?.isPurchased)
      setLoadingState(false)
    } else {
      setStudentCourseDetails(null)
      setIsPurchased(false)
      setLoadingState(false)
    }
  }

  const handleSetFreePreview = (getCurrentVideoInfo) => {
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl)
  }

  const handleCreatePayment = async () => {
    const paymentPayload = {
      userId: auth?.user?._id,
      username: auth?.user?.username,
      email: auth?.user?.email,
      orderStatus: 'pending',
      paymentMethod: 'paypal',
      paymentStatus: 'initiated',
      orderDate: new Date(),
      paymentId: '',
      payerId: '',
      instructorId: studentCourseDetails?.instructorId,
      instructorName: studentCourseDetails?.instructorName,
      courseImage: studentCourseDetails?.image,
      courseTitle: studentCourseDetails?.title,
      courseId: studentCourseDetails?._id,
      coursePricing: studentCourseDetails?.pricing,
    }

    const response = await createPaymentService(paymentPayload)

    if (response.success) {
      sessionStorage.setItem(
        'currentOrderId',
        JSON.stringify(response?.data?.orderId)
      )
      setApprovalUrl(response?.data?.approveUrl)
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true)
  }, [displayCurrentVideoFreePreview])

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentCoursesDetails()
  }, [currentCourseDetailsId])

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id)
  }, [id])

  useEffect(() => {
    if (!location.pathname.includes('course/details')) {
      setStudentCourseDetails(null)
      setCurrentCourseDetailsId(null)
    }
  }, [location.pathname])

  if (loadingState) return <Skeleton />

  if (isPurchased !== null && isPurchased) {
  }

  if (approvalUrl !== '') {
    window.location.href = approvalUrl
  }

  return (
    <div className="container mx-auto px-4 max-w-7xl mt-6 relative">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">
          {studentCourseDetails?.title}
        </h1>
        <p className="text-xl mb-4">{studentCourseDetails?.subtitle}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span>Created By {studentCourseDetails?.instructorName}</span>
          <span>Created on {studentCourseDetails?.date.split('T')[0]}</span>
          <span>
            {studentCourseDetails?.students.length}{' '}
            {studentCourseDetails?.students.length <= 1
              ? 'Student'
              : 'Students'}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
          <Tabs defaultValue="overview" className="w-full md:w-[800px]">
            <TabsList className="bg-white dark:bg-gray-900 border  border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
              <TabsTrigger
                value="overview"
                className="px-6 py-2 cursor-pointer"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="curriculum"
                className="px-6 py-2 cursor-pointer"
              >
                Curriculum
              </TabsTrigger>
              <TabsTrigger value="reviews" className="px-6 py-2 cursor-pointer">
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>What you'll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {studentCourseDetails?.objectives
                      .split('.')
                      .map((obj, idx) => (
                        <span key={idx}>
                          {obj.trim()}
                          <br />
                        </span>
                      ))}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="curriculum">
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md overflow-hidden">
                    <details className="group" open>
                      <summary className="flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-800 cursor-pointer group-open:bg-orange-50 group-open:text-orange-600 transition-all">
                        <span className="font-medium">Course Content</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {studentCourseDetails?.outline?.length || 0} Lessons
                        </span>
                      </summary>
                      <div className="bg-white dark:bg-gray-900 divide-y px-4">
                        {studentCourseDetails?.outline?.map((lesson, index) => (
                          <div
                            key={lesson._id || index}
                            className="flex justify-between items-center py-3"
                          >
                            <div
                              className={`flex items-center ${
                                lesson.freePreview
                                  ? 'cursor-pointer hover:text-blue-500'
                                  : 'cursor-not-allowed text-gray-400'
                              }`}
                              onClick={
                                lesson.freePreview
                                  ? () => handleSetFreePreview(lesson)
                                  : undefined
                              }
                            >
                              {lesson.freePreview ? (
                                <PlayCircle className="h-4 w-4 mr-2 text-blue-500" />
                              ) : (
                                <Lock className="h-4 w-4 mr-2 text-gray-400" />
                              )}
                              <span>{lesson.title}</span>
                            </div>
                            {lesson.freePreview && (
                              <Button
                                size="sm"
                                className="text-sm px-3 py-1 cursor-pointer"
                                onClick={() => handleSetFreePreview(lesson)}
                              >
                                Preview
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 italic">No reviews yet.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <div className="absolute right-4 top-[112px] w-full md:w-[360px] z-10 hidden md:block">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6">
            <img
              src={studentCourseDetails?.image}
              alt="Course"
              className="w-full h-[180px] object-cover rounded-lg mb-4"
            />
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-semibold text-orange-500">
                {studentCourseDetails?.pricing === 0
                  ? 'Free'
                  : `${studentCourseDetails?.pricing} VND`}
              </p>
              <Button
                onClick={handleCreatePayment}
                className="cursor-pointer py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition"
              >
                Start Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false)
          setDisplayCurrentVideoFreePreview(null)
        }}
      >
        <DialogContent className="w-[800px] bg-white rounded-lg p-8 shadow-xl transition-transform transform duration-300 hover:scale-105">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-3xl font-semibold text-gray-800">
              Course Preview
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-xl overflow-hidden flex items-center justify-center mb-6">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="450px"
              height="200px"
              onProgressUpdate={() => {}}
            />
          </div>
          <div className="flex flex-col gap-4 text-gray-800">
            {studentCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filteredItem) => (
                <p
                  onClick={() => handleSetFreePreview(filteredItem)}
                  className="cursor-pointer text-xl font-medium transition-all duration-300 hover:text-white hover:bg-orange-500 px-3 py-2 rounded-lg hover:scale-105 transform"
                >
                  {filteredItem?.title}
                </p>
              ))}
          </div>
          <DialogFooter className="sm:justify-start mt-6">
            <DialogClose asChild>
              <Button
                className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transform transition-all duration-300 cursor-pointer"
                type="button"
                variant="secondary"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CourseDetails
