import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BadgeCheck,
  LogOut,
} from 'lucide-react'
import Dashboard from '@/pages/admin/Dashboard'
import UserManagement from '@/pages/admin/User/UserManagement'
import CourseManagement from '@/pages/admin/CourseManagement'
import ProviderManagement from '@/pages/admin/User/ProviderManagement'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { AuthContext } from '@/context/auth/authContext'

const AdminLayout = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const { auth } = useContext(AuthContext)
  const { resetCredentials } = useContext(AuthContext)

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken')

    if (!token || !auth.authenticate) {
      navigate('/auth', { replace: true })
    }
  }, [auth.authenticate, navigate])

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      value: 'dashboard',
      component: <Dashboard />,
    },
    {
      icon: Users,
      label: 'Users',
      value: 'users',
      component: <UserManagement />,
    },
    {
      icon: BookOpen,
      label: 'Courses',
      value: 'courses',
      component: <CourseManagement />,
    },
    {
      icon: BadgeCheck,
      label: 'Provider Request',
      value: 'provider-request',
      component: <ProviderManagement />,
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
            Admin Dashboard
          </h2>
          <nav>
            {menuItems.map((menuItem) => (
              <Button
                variant="ghost"
                className={`w-full justify-start mb-4 text-left rounded-lg p-2 transition-all duration-300 ease-in-out hover:bg-gray-200 cursor-pointer ${
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

export default AdminLayout
