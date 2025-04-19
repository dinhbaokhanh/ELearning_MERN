import React, { useContext, useEffect } from 'react'
import banner from '../../../assets/BG_Home.jpg'
import {
  Code,
  Database,
  Palette,
  Terminal,
  Link,
  Radio,
  MessageSquare,
  Rocket,
  Clipboard,
  Brain,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { courseCategories } from '@/config/config'
import { StudentContext } from '@/context/student/studentContext'
import {
  checkCoursePurchaseInfoService,
  fetchStudentCoursesService,
} from '@/services/service'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '@/context/auth/authContext'

const Home = () => {
  const { studentCourseList, setStudentCourseList } = useContext(StudentContext)
  const navigate = useNavigate()

  const { auth } = useContext(AuthContext)

  const handleNavigateToCoursesPage = (getCurrentId) => {
    console.log(getCurrentId)
    sessionStorage.removeItem('filters')
    const currentFilter = {
      category: [getCurrentId],
    }

    sessionStorage.setItem('filters', JSON.stringify(currentFilter))

    navigate('/courses')
  }

  const handleCourseNavigate = async (getCurrentCourseId) => {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    )

    if (response?.success) {
      if (response?.data) {
        navigate(`/continuing-course/${getCurrentCourseId}`)
      } else {
        navigate(`/course/details/${getCurrentCourseId}`)
      }
    }
  }

  const fetchAllStudentCourse = async () => {
    const res = await fetchStudentCoursesService()
    if (res?.success) setStudentCourseList(res?.data)
    console.log(res)
  }

  useEffect(() => {
    fetchAllStudentCourse()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <section className="relative">
        <div className="w-full h-96 md:h-96 lg:h-160 overflow-hidden">
          <img
            src={banner}
            className="w-full h-full object-cover"
            alt="Banner image"
          />
        </div>

        <div className="absolute top-0 left-0 h-full w-full">
          <div className="container mx-auto px-4 lg:px-8 h-full flex items-center">
            <div className="lg:w-1/2 p-6 rounded-lg">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
                Unlock Your Potential
              </h1>
              <p className="text-xl text-white drop-shadow-lg mb-6">
                Transform your future with in-demand skills and expert-led
                courses that empower your career journey.
              </p>
              <Button
                onClick={() => {
                  navigate('/courses')
                }}
                className="px-8 py-5 bg-orange-400 hover:bg-orange-800 text-white font-medium rounded-lg transition-colors duration-300 cursor-pointer"
              >
                Start Learning Today
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 mt-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Course Categories
            </h2>
          </div>
          <p className="text-gray-500 text-base mb-8">Explore our categories</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {courseCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleNavigateToCoursesPage(category.id)}
                className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-500">
                  {category.id === 'software-engineer' && <Code size={32} />}
                  {category.id === 'data-engineer' && <Database size={32} />}
                  {category.id === 'ui-ux-design' && <Palette size={32} />}
                  {category.id === 'devops' && <Terminal size={32} />}
                  {category.id === 'blockchain' && <Link size={32} />}
                  {category.id === 'robotics' && <Radio size={32} />}
                  {category.id === 'digital-marketing' && (
                    <MessageSquare size={32} />
                  )}
                  {category.id === 'startup-business' && <Rocket size={32} />}
                  {category.id === 'product-management' && (
                    <Clipboard size={32} />
                  )}
                  {category.id === 'ai-ethics' && <Brain size={32} />}
                </div>
                <h3 className="text-gray-800 font-medium text-center text-base">
                  {category.label}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Courses</h2>
            <Button
              onClick={() => {
                navigate('/courses')
              }}
              className="cursor-pointer text-sm font-semibold text-orange-600 border border-orange-600 bg-white rounded-full px-4 py-1 hover:bg-orange-600 hover:text-white transition"
            >
              All Courses
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {studentCourseList && studentCourseList.length > 0 ? (
              studentCourseList.map((courseItem) => (
                <div
                  key={courseItem?._id}
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={courseItem?.image}
                      alt={courseItem?.title}
                      className="w-full h-40 object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full opacity-90">
                      {courseItem?.category || 'Course'}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                      {courseItem?.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      By {courseItem?.instructorName}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 gap-4 mb-2">
                      <span>👥 {courseItem?.students?.length} Students</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-base font-bold text-primary">
                        {courseItem?.salePrice ? (
                          <>
                            <span className="text-gray-400 line-through mr-2">
                              {courseItem?.pricing}đ
                            </span>
                            <span>{courseItem?.salePrice}đ</span>
                          </>
                        ) : (
                          <span>
                            {courseItem?.pricing === 0
                              ? 'Free'
                              : `${courseItem?.pricing}đ`}
                          </span>
                        )}
                      </div>
                      <Button className="cursor-pointer text-sm font-semibold text-orange-600 border border-orange-600 bg-white rounded-full px-3 py-1 hover:bg-orange-600 hover:text-white transition">
                        View More
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h1>No Courses Found</h1>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
