import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/auth/Auth'
import { InstructorProvider } from './context/instructor/Instructor'
import { StudentProvider } from './context/student/Student'
import { AdminProvider } from './context/admin/Admin'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <AdminProvider>
        <InstructorProvider>
          <StudentProvider>
            <App />
          </StudentProvider>
        </InstructorProvider>
      </AdminProvider>
    </AuthProvider>
  </BrowserRouter>
)
