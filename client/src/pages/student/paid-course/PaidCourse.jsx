import React, { useContext, useEffect } from 'react'
import { StudentContext } from '@/context/student/studentContext'
import { fetchStudentBoughtCoursesService } from '@/services/service'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '@/context/auth/authContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Eye } from 'lucide-react'

const PaidCourse = () => {
  const { auth } = useContext(AuthContext)
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext)
  const navigate = useNavigate()

  const fetchStudentBoughtCourses = async () => {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id)
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data)
    }
  }
  useEffect(() => {
    fetchStudentBoughtCourses()
  }, [])

  return (
    <div className="p-4 sm:p-6 bg-white">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">My Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          studentBoughtCoursesList.map((course) => (
            <Card
              key={course._id}
              className="flex flex-col bg-white border border-orange-300 hover:shadow-lg transition-shadow duration-300 rounded-xl"
            >
              <CardContent className="p-3 flex-grow">
                <img
                  src={course?.courseImage}
                  alt={course?.title}
                  className="h-40 w-full object-cover rounded-xl mb-4"
                />
                <h3 className="font-semibold text-base text-gray-900 mb-1 truncate">
                  {course?.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {course?.instructorName}
                </p>
              </CardContent>
              <CardFooter className="p-3">
                <Button
                  onClick={() =>
                    navigate(`/continuing-course/${course?.courseId}`)
                  }
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Start Watching
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">
            <h2 className="text-xl font-semibold">No Courses Found</h2>
            <p className="text-sm mt-2">
              You haven’t enrolled in any courses yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaidCourse
