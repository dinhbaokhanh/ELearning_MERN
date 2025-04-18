import Dashboard from '@/pages/instructor/Dashboard'
import { BarChart, Book, TicketPercent, LogOut } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import Courses from '@/pages/instructor/Courses/Courses'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { AuthContext } from '@/context/auth/authContext'
import { useNavigate } from 'react-router-dom'
import { InstructorContext } from '@/context/instructor/instructorContext'
import { fetchInstructorCourseListService } from '@/services/service'
import DiscountLayout from './DiscountLayout'

const InstructorLayout = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const { auth } = useContext(AuthContext)
  const { resetCredentials } = useContext(AuthContext)
  const { instructorCourseList, setInstructorCourseList } =
    useContext(InstructorContext)

  const fetchAllCourses = async () => {
    const res = await fetchInstructorCourseListService()
    if (res?.success) setInstructorCourseList(res?.data)
  }

  useEffect(() => {
    fetchAllCourses()
  }, [])

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken')

    if (!token || !auth.authenticate) {
      navigate('/auth', { replace: true })
    }
  }, [auth.authenticate, navigate])

  const menuItems = [
    {
      icon: BarChart,
      label: 'Dashboard',
      value: 'dashboard',
      component: <Dashboard />,
    },
    {
      icon: Book,
      label: 'Courses',
      value: 'courses',
      component: <Courses courseList={instructorCourseList} />,
    },
    {
      icon: TicketPercent,
      label: 'Discounts',
      value: 'discounts',
      component: <DiscountLayout />,
    },
    {
      icon: LogOut,
      label: 'Logout',
      value: 'logout',
      component: null,
    },
  ]

  const handleLogout = () => {
    resetCredentials()
    sessionStorage.clear()
  }

  return (
    <div className="flex h-full min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-lg hidden md:block">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Instructor Dashboard
          </h2>
          <nav>
            {menuItems.map((menuItem) => (
              <Button
                variant="ghost"
                className={`w-full justify-start mb-4 text-left rounded-lg p-2 transition-all duration-300 ease-in-out hover:bg-gray-200 ${
                  activeTab === menuItem.value
                    ? 'bg-gray-200 text-gray-800'
                    : 'text-gray-500'
                }`}
                key={menuItem.value}
                onClick={
                  menuItem.value === 'logout'
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
              >
                <menuItem.icon
                  className={`mr-3 h-5 w-5 ${
                    activeTab === menuItem.value
                      ? 'text-primary'
                      : 'text-gray-400'
                  }`}
                />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-8">
            Dashboard
          </h1>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {menuItems.map((menuItem) => (
            <TabsContent key={menuItem.value} value={menuItem.value}>
              {menuItem.component !== null ? menuItem.component : null}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}

export default InstructorLayout
