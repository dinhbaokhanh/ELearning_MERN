import React, { useEffect, useContext, useState } from 'react'
import { AdminContext } from '@/context/admin/adminContext'
import {
  fetchAllCoursesService,
  acceptCourseService,
  rejectCourseService,
  mediaDeleteService,
} from '@/services/service'
import { CheckCircle, XCircle, X, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const CourseManagement = () => {
  const { courses, setCourses } = useContext(AdminContext)
  const [loading, setLoading] = useState(false)

  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleViewDetails = (course) => {
    setSelectedCourse(course)
    setShowModal(true)
  }

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const data = await fetchAllCoursesService()
      console.log(data)
      setCourses(data?.courses)
    } catch (error) {
      toast.error('Error fetching courses:', error)
    }
    setLoading(false)
  }

  const acceptCourse = async (id) => {
    try {
      await acceptCourseService(id)
      toast.success('Course accepted successfully!')
      fetchCourses()
    } catch (error) {
      console.error('Error accepting course:', error)
      toast.error('Failed to accept course.')
    }
  }

  const rejectCourse = async (id) => {
    try {
      const rejectedCourse = courses.find((course) => course._id === id)
      const imageUrl = rejectedCourse?.image
      const imageFilename = imageUrl?.split('/').pop()
      const imagePublicId = imageFilename?.split('.')[0]
      if (imagePublicId) {
        await mediaDeleteService(imagePublicId)
      }
      const outlineVideos = rejectedCourse?.outline || []
      console.log(outlineVideos)

      for (const video of outlineVideos) {
        if (video?.public_id) {
          await mediaDeleteService(video.public_id)
        }
      }
      await rejectCourseService(id)
      setCourses(courses.filter((course) => course._id !== id))

      toast.success('Course rejected and all media deleted successfully!')
    } catch (error) {
      console.error('Error rejecting course:', error)
      toast.error('Failed to reject course or delete media.')
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Course Management</h2>

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">No courses found.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Instructor</th>
              <th className="py-3 px-4">Pricing</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Details</th>
              <th className="py-3 px-4">Approval</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={course._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="p-3">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-20 h-12 object-cover rounded-md"
                  />
                </td>
                <td className="py-2 px-4">{course.title}</td>
                <td className="py-2 px-4">{course.instructorName}</td>
                <td className="py-2 px-4">${course.pricing}</td>
                <td className="py-2 px-4 capitalize">{course.status}</td>
                <td className="py-2 px-4">
                  <Button
                    className="cursor-pointer"
                    onClick={() => handleViewDetails(course)}
                    title="View Details"
                  >
                    <Eye size={20} />
                  </Button>
                </td>

                <td className="py-2 px-4">
                  {course.status === 'Pending' && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle
                        className="text-green-600 cursor-pointer hover:scale-110 transition"
                        size={20}
                        title="Accept Course"
                        onClick={() => acceptCourse(course._id)}
                      />
                      <XCircle
                        className="text-red-600 cursor-pointer hover:scale-110 transition"
                        size={20}
                        title="Reject Course"
                        onClick={() => rejectCourse(course._id)}
                      />
                    </div>
                  )}
                  {course.status === 'Accepted' && (
                    <span className="text-green-600">Accepted</span>
                  )}
                  {course.status === 'Rejected' && (
                    <span className="text-red-600">Rejected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

          {showModal && selectedCourse && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl relative overflow-y-auto max-h-[90vh]">
                <Button
                  className="absolute top-4 right-4 cursor-pointer"
                  onClick={() => setShowModal(false)}
                  title="Close"
                >
                  <X size={24} />
                </Button>

                <h3 className="text-2xl font-bold mb-4">
                  {selectedCourse.title}
                </h3>

                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />

                <div className="space-y-2">
                  <p>
                    <strong>Subtitle:</strong> {selectedCourse.subtitle}
                  </p>
                  <p>
                    <strong>Instructor:</strong> {selectedCourse.instructorName}
                  </p>
                  <p>
                    <strong>Category:</strong> {selectedCourse.category}
                  </p>
                  <p>
                    <strong>Level:</strong> {selectedCourse.level}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedCourse.status}
                  </p>
                  <p>
                    <strong>Pricing:</strong> ${selectedCourse.pricing}
                  </p>
                  <p>
                    <strong>Created at:</strong>{' '}
                    {new Date(selectedCourse.date).toLocaleString()}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="font-semibold mb-1">Welcome Message:</p>
                  <p className="bg-gray-100 p-2 rounded">
                    {selectedCourse.welcomeMessage}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="font-semibold mb-1">Description:</p>
                  <p className="bg-gray-100 p-2 rounded">
                    {selectedCourse.description}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="font-semibold mb-1">Objectives:</p>
                  <ul className="list-disc list-inside bg-gray-100 p-3 rounded space-y-1">
                    {selectedCourse.objectives.split('\n').map((obj, idx) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <p className="font-semibold mb-1">Outline:</p>
                  <ul className="list-decimal list-inside bg-gray-100 p-3 rounded space-y-1">
                    {selectedCourse.outline?.map((item, idx) => (
                      <li key={idx}>
                        <strong>{item.title}</strong> {item.content}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </table>
      )}
    </div>
  )
}

export default CourseManagement
