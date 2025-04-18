import React, { useEffect, useState } from 'react'
import {
  fetchUsersListService,
  acceptInstructorService,
  rejectInstructorService,
} from '../../../services/service.js'
import { CheckCircle, XCircle } from 'lucide-react'

const ProviderManagement = () => {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchUsersListService()
        const filteredRequests = data.users.filter(
          (user) => user.isInstructorRequested
        )
        setRequests(filteredRequests)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  const acceptRequest = async (id) => {
    try {
      const data = await acceptInstructorService(id)
      console.log(data)
      setRequests(requests.filter((request) => request._id !== id))
    } catch (error) {
      console.error('Error accepting request:', error)
    }
  }

  const rejectRequest = async (id) => {
    try {
      const data = await rejectInstructorService(id)
      console.log(data)
      setRequests(requests.filter((request) => request._id !== id))
    } catch (error) {
      console.error('Error rejecting request:', error)
    }
  }

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-2xl font-semibold mb-6">Instructor Requests</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white text-left text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 text-gray-600">Username</th>
              <th className="py-3 px-4 text-gray-600">Email</th>
              <th className="py-3 px-4 text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-3 px-4 text-center text-gray-500">
                  No requests found
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{request.username}</td>
                  <td className="py-3 px-4">{request.email}</td>
                  <td className="py-3 px-4 flex space-x-4">
                    <CheckCircle
                      className="text-green-500 cursor-pointer hover:scale-110 transition"
                      size={20}
                      title="Accept"
                      onClick={() => acceptRequest(request._id)}
                    />
                    <XCircle
                      className="text-red-500 cursor-pointer hover:scale-110 transition"
                      size={20}
                      title="Reject"
                      onClick={() => rejectRequest(request._id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProviderManagement
