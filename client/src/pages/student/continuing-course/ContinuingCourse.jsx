import React, { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import VideoPlayer from '@/components/video/Video'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '@/context/auth/authContext'
import { StudentContext } from '@/context/student/studentContext'
import { Check, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from '@/services/service'

const ContinuingCourse = () => {
  const navigate = useNavigate()
  const { auth } = useContext(AuthContext)
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext)
  const [lockCourse, setLockCourse] = useState(false)
  const [currentLecture, setCurrentLecture] = useState(null)
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isSideBarOpen, setIsSideBarOpen] = useState(true)
  const { id } = useParams()

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id)
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true)
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        })

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.outline[0])
          setShowCourseCompleteDialog(true)
          setShowConfetti(true)

          return
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.outline[0])
        } else {
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc
            },
            -1
          )

          setCurrentLecture(
            response?.data?.courseDetails?.outline[lastIndexOfViewedAsTrue + 1]
          )
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      )

      if (response?.success) {
        fetchCurrentCourseProgress()
      }
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    )

    if (response?.success) {
      setCurrentLecture(null)
      setShowConfetti(false)
      setShowCourseCompleteDialog(false)
      fetchCurrentCourseProgress()
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress()
  }, [id])

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress()
  }, [currentLecture])

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000)
  }, [showConfetti])

  return (
    <div className="flex flex-col h-screen bg-white text-[#1f2937]">
      {showConfetti && <Confetti />}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate('/student-courses')}
            className="text-[#f97316] hover:bg-orange-100"
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses Page
          </Button>
          <h1 className="text-lg font-semibold hidden md:block">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <Button
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="text-[#f97316] hover:bg-orange-100"
          size="icon"
        >
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex-1 ${
            isSideBarOpen ? 'mr-[400px]' : ''
          } transition-all duration-300`}
        >
          <VideoPlayer
            width="100%"
            height="500px"
            url={currentLecture?.videoUrl}
            onProgressUpdate={setCurrentLecture}
            progressData={currentLecture}
          />
          <div className="p-6 bg-white">
            <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
          </div>
        </div>

        <div
          className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-white border-l border-gray-200 transition-all duration-300 ${
            isSideBarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 h-14 bg-gray-100">
              <TabsTrigger
                value="content"
                className="text-[#f97316] hover:bg-orange-100 rounded-none h-full"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="text-[#f97316] hover:bg-orange-100 rounded-none h-full"
              >
                Overview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {studentCurrentCourseProgress?.courseDetails?.outline.map(
                    (item) => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-2 text-sm font-medium text-[#1f2937] hover:text-orange-500 cursor-pointer"
                      >
                        {studentCurrentCourseProgress?.progress?.find(
                          (progressItem) => progressItem.lectureId === item._id
                        )?.viewed ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Play className="h-4 w-4 text-gray-400" />
                        )}
                        <span>{item?.title}</span>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-4">About this course</h2>
                  <p className="text-gray-600">
                    {studentCurrentCourseProgress?.courseDetails?.description}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px] bg-white text-[#1f2937]">
          <DialogHeader>
            <DialogTitle className="text-red-500">
              You can't view this page
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Please purchase this course to get access
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showCourseCompleteDialog}>
        <DialogContent className="sm:w-[425px] bg-white text-[#1f2937]">
          <DialogHeader>
            <DialogTitle className="text-[#f97316]">
              Congratulations!
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <Label>You have completed the course</Label>
              <div className="flex flex-row gap-3">
                <Button
                  className="bg-[#f97316] text-white hover:bg-orange-600"
                  onClick={() => navigate('/student-courses')}
                >
                  My Courses Page
                </Button>
                <Button variant="outline" onClick={handleRewatchCourse}>
                  Rewatch Course
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ContinuingCourse
