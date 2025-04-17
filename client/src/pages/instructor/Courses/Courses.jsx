import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  courseLandingInitialFormData,
  courseOutlineInitialFormData,
} from '@/config/config'
import { InstructorContext } from '@/context/instructor/instructorContext'
import { Delete, Edit } from 'lucide-react'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

const Courses = ({ courseList }) => {
  const navigate = useNavigate()
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseOutlineFormData,
  } = useContext(InstructorContext)

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-200 text-yellow-700'
      case 'Accepted':
        return 'bg-green-200 text-green-700'
      case 'Rejected':
        return 'bg-red-200 text-red-700'
      default:
        return 'bg-gray-200 text-gray-700'
    }
  }

  return (
    <Card>
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-3xl font-extrabold"> All Courses</CardTitle>
        <Button
          onClick={() => {
            setCurrentEditedCourseId(null)
            navigate('/instructor/create-course')
            setCourseLandingFormData(courseLandingInitialFormData)
            setCourseOutlineFormData(courseOutlineInitialFormData)
          }}
          className="p-6"
        >
          Create New Course
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue (VND)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseList && courseList.length > 0
                ? courseList.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell className="font-medium">
                        {course?.title}
                      </TableCell>
                      <TableCell>{course?.students?.length}</TableCell>
                      <TableCell>{course?.pricing}</TableCell>
                      <TableCell>
                        <div
                          className={`p-4 rounded-lg ${getStatusStyle(
                            course.status
                          )}`}
                        >
                          {course.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => {
                            navigate(`/instructor/edit-course/${course?._id}`)
                          }}
                          variant="ghost"
                          size="sm"
                        >
                          <Edit className="h-6 w-6" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Delete className="h-6 w-6" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default Courses
