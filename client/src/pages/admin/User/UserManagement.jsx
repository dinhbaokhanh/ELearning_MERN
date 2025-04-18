import React, { useEffect, useContext } from 'react'
import toast from 'react-hot-toast'
import { AdminContext } from '@/context/admin/adminContext'
import {
  changeUserRoleService,
  fetchUsersListService,
} from '@/services/service'
import { Shield, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'

const UserManagement = () => {
  const { users, setUsers } = useContext(AdminContext)

  const toggleRole = async (id) => {
    try {
      await changeUserRoleService(id)
      toast.success('Role changed successfully!')
      refreshUserList()
    } catch (err) {
      console.error(err)
      toast.error('Failed to change role.')
    }
  }

  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    })

    if (result.isConfirmed) {
      try {
        await deleteUserService(id)
        toast.success('User deleted successfully!')
        refreshUserList()
      } catch (err) {
        console.error(err)
        toast.error('Failed to delete user.')
      }
    }
  }

  const refreshUserList = async () => {
    const data = await fetchUsersListService()
    setUsers(data?.users)
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchUsersListService()
        setUsers(data?.users)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, [setUsers])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>

      {Array.isArray(users) && users.length > 0 ? (
        <table className="min-w-full bg-white shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4 capitalize">{user.role}</td>
                <td className="py-2 px-4 space-x-2 flex">
                  <Shield
                    className="text-yellow-500 cursor-pointer hover:scale-110 transition"
                    size={20}
                    title="Toggle Role"
                    onClick={() => toggleRole(user._id)}
                  />
                  <Trash2
                    className="text-red-500 cursor-pointer hover:scale-110 transition"
                    size={20}
                    title="Delete User"
                    onClick={() => deleteUser(user._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No users found.</p>
      )}
    </div>
  )
}

export default UserManagement
