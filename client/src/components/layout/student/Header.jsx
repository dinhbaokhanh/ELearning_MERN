import { Button } from '@/components/ui/button'
import { AuthContext } from '@/context/auth/authContext'
import { SwatchBook, TvMinimalPlay, Search } from 'lucide-react'
import React, { useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  const { resetCredentials } = useContext(AuthContext)

  const location = useLocation()
  const pathname = location.pathname

  function handleLogout() {
    resetCredentials()
    sessionStorage.clear()
    navigate('/login')
  }

  return (
    <header className="w-full border-b bg-white shadow-sm px-6 py-4">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link
            to="/home"
            className="flex items-center text-orange-500 font-extrabold text-xl gap-2 hover:text-orange-600 transition"
          >
            <SwatchBook className="w-7 h-7" />
            <span>EduPress</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link
              to="/home"
              className={`hover:text-orange-500 transition ${
                pathname === '/home' ? 'text-orange-600 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/courses"
              className={`hover:text-orange-500 transition ${
                pathname === '/courses' ? 'text-orange-600 font-semibold' : ''
              }`}
            >
              Courses
            </Link>
            <Link
              to="/blog"
              className={`hover:text-orange-500 transition ${
                pathname === '/blog' ? 'text-orange-600 font-semibold' : ''
              }`}
            >
              Blog
            </Link>
            <div className="relative group cursor-pointer">
              <span
                className={`hover:text-orange-500 flex items-center gap-1 transition ${
                  pathname === '/contact' ? 'text-orange-600 font-semibold' : ''
                }`}
              >
                Contact
              </span>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/student-courses"
            className="hidden md:flex items-center gap-2 font-semibold text-sm hover:text-orange-500 transition"
          >
            My Courses
            <TvMinimalPlay className="w-5 h-5" />
          </Link>

          <Button
            variant="ghost"
            className="text-sm cursor-pointer"
            onClick={handleLogout}
          >
            Log Out
          </Button>

          <button className="border border-orange-500 rounded-full p-2 hover:bg-orange-100 transition">
            <Search className="w-4 h-4 text-orange-500" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
