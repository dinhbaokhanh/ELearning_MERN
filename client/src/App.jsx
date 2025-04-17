import { Route, Routes } from 'react-router-dom'
import './App.css'
import Auth from './pages/auth/auth'
import RouteGuard from './components/route-guard/guard'
import { useContext } from 'react'
import { AuthContext } from './context/auth/authContext'
import CommonLayout from './components/layout/student/CommonLayout'
import Home from './pages/student/home/Home'
import NotFound from './pages/not-found/NotFound'
import InstructorLayout from './components/layout/instructor/InstructorLayout'
import AddNewCourseLayout from './components/layout/instructor/AddCourseLayout'
import AdminLayout from './components/layout/admin/AdminLayout'

function App() {
  const { auth } = useContext(AuthContext)

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <RouteGuard
            element={<Auth />}
            authenticated={auth.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/admin"
        element={
          <RouteGuard
            element={<AdminLayout />}
            authenticated={auth.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorLayout />}
            authenticated={auth.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/create-course"
        element={
          <RouteGuard
            element={<AddNewCourseLayout />}
            authenticated={auth.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/edit-course/:courseId"
        element={
          <RouteGuard
            element={<AddNewCourseLayout />}
            authenticated={auth.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/"
        element={
          <RouteGuard
            element={<CommonLayout />}
            authenticated={auth.authenticate}
            user={auth?.user}
          />
        }
      >
        <Route path="" element={<Home />} />
        <Route path="/home" element={<Home />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
