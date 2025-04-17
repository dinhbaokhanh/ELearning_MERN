import React, { useContext } from 'react'
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

const Home = () => {
  const { studentCourseList, setStudentCourseList } = useContext(StudentContext)

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
              <Button className="px-8 py-5 bg-orange-400 hover:bg-orange-800 text-white font-medium rounded-lg transition-colors duration-300 cursor-pointer">
                Start Learning Today
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Course Categories
            </h2>
          </div>
          <p className="text-gray-500 text-sm mb-6">Explore our categories</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {courseCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleNavigateToCoursesPage(category.id)}
                className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3 text-orange-500">
                  {category.id === 'software-engineer' && <Code size={24} />}
                  {category.id === 'data-engineer' && <Database size={24} />}
                  {category.id === 'ui-ux-design' && <Palette size={24} />}
                  {category.id === 'devops' && <Terminal size={24} />}
                  {category.id === 'blockchain' && <Link size={24} />}
                  {category.id === 'robotics' && <Radio size={24} />}
                  {category.id === 'digital-marketing' && (
                    <MessageSquare size={24} />
                  )}
                  {category.id === 'startup-business' && <Rocket size={24} />}
                  {category.id === 'product-management' && (
                    <Clipboard size={24} />
                  )}
                  {category.id === 'ai-ethics' && <Brain size={24} />}
                </div>
                <h3 className="text-gray-800 font-medium text-center text-sm">
                  {category.label}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
