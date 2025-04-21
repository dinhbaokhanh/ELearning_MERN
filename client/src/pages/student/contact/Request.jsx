import React, { useContext, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { AuthContext } from '@/context/auth/authContext'
import { requestToBeInstructorService } from '@/services/service'
import banner from '../../../assets/teacher-online-learning-illustration.jpg'

const Request = () => {
  const { user } = useContext(AuthContext)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleRequest = async () => {
    try {
      setLoading(true)
      await requestToBeInstructorService(user._id)
      setStatus('success')
    } catch (error) {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-px flex flex-col items-center justify-center bg-white px-6 py-16">
      <div className="max-w-3xl text-center">
        <img
          src={banner}
          alt="Become Instructor"
          className="w-72 mx-auto mb-10"
        />

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Do you want to start your career as an instructor?
        </h1>
        <p className="text-gray-600 text-base md:text-lg mb-6">
          Tell us your qualifications, show us your passion, and begin teaching
          with us!
        </p>

        {status === 'success' && (
          <div className="flex items-center justify-center gap-2 mb-4 text-green-700 bg-green-100 py-2 px-4 rounded-xl">
            <CheckCircle className="w-5 h-5" /> Request sent successfully!
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center justify-center gap-2 mb-4 text-red-700 bg-red-100 py-2 px-4 rounded-xl">
            <AlertTriangle className="w-5 h-5" /> Something went wrong!
          </div>
        )}

        <Button
          onClick={handleRequest}
          disabled={loading || status === 'success'}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl text-base md:text-lg cursor-pointer"
        >
          {loading
            ? 'Sending...'
            : status === 'success'
            ? 'Requested'
            : 'Apply Now'}
        </Button>
      </div>
    </div>
  )
}

export default Request
