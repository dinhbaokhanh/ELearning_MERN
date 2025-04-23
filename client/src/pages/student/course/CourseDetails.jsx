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
  addReviewToCourseService,
  createPaymentService,
  fetchStudentCoursesDetailsService,
  updateReviewInCourseService,
} from '@/services/service'
import { PlayCircle, Lock } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

const CourseDetails = () => {
  const {
    studentCourseDetails,
    setStudentCourseDetails,
    loadingState,
    setLoadingState,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
  } = useContext(StudentContext)

  const navigate = useNavigate()

  const { auth } = useContext(AuthContext)
  const { id } = useParams()
  const location = useLocation()
  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null)
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false)
  const [approvalUrl, setApprovalUrl] = useState('')
  const [isPurchased, setIsPurchased] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 3

  const reviews = studentCourseDetails?.rating?.reviews || []
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)
  const startIndex = (currentPage - 1) * reviewsPerPage
  const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage)

  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(0)

  const studentId = auth?.user?._id || ''
  const studentName = auth?.user?.username || ''

  const hasReviewed = studentCourseDetails?.rating?.reviews?.some(
    (r) => r.studentId === studentId
  )

  useEffect(() => {
    if (studentCourseDetails?.students && auth?.user?._id) {
      const isBought = studentCourseDetails.students.some(
        (student) => student.studentId === auth.user._id
      )
      setIsPurchased(isBought)
    }
  }, [studentCourseDetails, auth])

  useEffect(() => {
    if (hasReviewed) {
      const existingReview = studentCourseDetails.rating.reviews.find(
        (r) => r.studentId === studentId
      )
      if (existingReview) {
        setReviewText(existingReview.comment)
        setRating(existingReview.rating)
      }
    }
  }, [studentCourseDetails, studentId])

  const handleSubmitReview = async () => {
    const reviewData = {
      studentId,
      studentName,
      comment: reviewText,
      rating,
    }

    try {
      if (hasReviewed) {
        await updateReviewInCourseService(
          studentCourseDetails._id,
          studentId,
          reviewData
        )
      } else {
        await addReviewToCourseService(studentCourseDetails?._id, reviewData)
      }
      toast.success('Review submitted!')
    } catch (err) {
      toast.error('Failed to submit review')
      console.error(err)
    }
  }

  const fetchStudentCoursesDetails = async () => {
    const response = await fetchStudentCoursesDetailsService(
      currentCourseDetailsId
    )

    if (response?.success) {
      setStudentCourseDetails(response?.data)
      setLoadingState(false)
    } else {
      setStudentCourseDetails(null)
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
      if (response.data?.isFree) {
        toast.success('Registered Successfully')
        navigate(`/student-courses`)
      } else {
        sessionStorage.setItem(
          'currentOrderId',
          JSON.stringify(response?.data?.orderId)
        )
        setApprovalUrl(response?.data?.approveUrl)
      }
    } else {
      toast.error('There is some error')
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
                  <CardTitle className="text-xl font-bold">Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 text-2xl font-semibold text-gray-800">
                      <span>
                        {studentCourseDetails?.rating?.average?.toFixed(1) ||
                          '0.0'}
                      </span>
                      <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i <
                            Math.round(
                              studentCourseDetails?.rating?.average || 0
                            )
                              ? '★'
                              : '☆'}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      based on {studentCourseDetails?.rating?.totalRatings || 0}{' '}
                      ratings
                    </div>

                    {[5, 4, 3, 2, 1].map((star) => {
                      const count =
                        studentCourseDetails?.rating?.reviews?.filter(
                          (r) => r.rating === star
                        ).length || 0
                      const total =
                        studentCourseDetails?.rating?.totalRatings || 1
                      const percentage = Math.round((count / total) * 100)
                      return (
                        <div
                          key={star}
                          className="flex items-center text-sm mb-1"
                        >
                          <span className="w-6">{star}★</span>
                          <div className="w-full h-2 bg-gray-200 rounded mx-2">
                            <div
                              className="h-full bg-yellow-400 rounded"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span>{percentage}%</span>
                        </div>
                      )
                    })}
                  </div>

                  {reviews.length > 0 ? (
                    [...currentReviews]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((review, index) => (
                        <div key={index} className="mb-6 border-b pb-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={`https://ui-avatars.com/api/?name=${review.studentName}`}
                              alt="avatar"
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <div className="font-semibold">
                                {review.studentName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(review.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 flex text-yellow-500 text-sm">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>
                                {i < review.rating ? '★' : '☆'}
                              </span>
                            ))}
                          </div>
                          <p className="mt-2 text-gray-700 text-sm">
                            {review.comment}
                          </p>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500 italic">No reviews yet.</p>
                  )}

                  <div className="flex justify-center space-x-2 my-6">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-full border cursor-pointer ${
                            page === currentPage
                              ? 'bg-orange-500 text-white'
                              : 'bg-white text-gray-700'
                          }`}
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>

                  {isPurchased && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Leave A Comment
                      </h3>
                      <textarea
                        placeholder="Write your review here..."
                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                        rows={4}
                        onChange={(e) => setReviewText(e.target.value)}
                      />
                      <div className="flex items-center space-x-2 mt-3">
                        {[...Array(5)].map((_, idx) => (
                          <span
                            key={idx}
                            className={`cursor-pointer text-2xl ${
                              idx < rating ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                            onClick={() => setRating(idx + 1)}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center mt-4">
                        <input type="checkbox" className="mr-2" />
                        <label className="text-sm text-gray-500">
                          Save my name, email in this browser for the next time
                          I comment
                        </label>
                      </div>
                      <Button
                        onClick={handleSubmitReview}
                        className="mt-4 bg-orange-500 text-white py-2 px-6 rounded hover:bg-orange-600"
                      >
                        Post Comment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <div className="absolute right-4 top-[112px] w-full md:w-[360px] z-10 hidden md:block">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 transition-all duration-300 ease-in-out transform hover:scale-105">
            <img
              src={studentCourseDetails?.image}
              alt="Course"
              className="w-full h-[180px] object-cover rounded-lg mb-6 shadow-md"
            />
            {isPurchased ? (
              <p className="text-center text-lg font-medium text-orange-500">
                You have bought the course
              </p>
            ) : (
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <p className="text-xl font-semibold text-orange-500 mb-4 md:mb-0">
                  {studentCourseDetails?.pricing === 0
                    ? 'Free'
                    : `${studentCourseDetails?.pricing} VND`}
                </p>
                <Button
                  onClick={handleCreatePayment}
                  className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Start Now
                </Button>
              </div>
            )}
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
