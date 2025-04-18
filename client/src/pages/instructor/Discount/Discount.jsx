import React, { useState, useEffect, useContext } from 'react'
import {
  getDiscountService,
  deleteDiscountService,
} from '@/services/service.js'
import { Edit, Trash } from 'lucide-react'
import { AuthContext } from '@/context/auth/authContext'

const Discount = () => {
  const { auth } = useContext(AuthContext)
  const [discounts, setDiscounts] = useState([])
  const [formData, setFormData] = useState({
    courseId: '',
    code: '',
    percentage: 0,
    expiryDate: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  const instructorId = auth?.user?.role === 'instructor' ? auth.user._id : null

  useEffect(() => {
    if (instructorId) {
      getDiscountService(instructorId).then((data) => {
        setDiscounts(data)
      })
    }
  }, [instructorId])

  const handleEdit = (id) => {
    const discount = discounts.find((d) => d._id === id)
    setFormData({
      courseId: discount.courseId,
      code: discount.code,
      percentage: discount.percentage,
      expiryDate: discount.expiryDate,
    })
    setIsEditing(true)
    setEditId(id)
  }

  const handleDelete = async (id) => {
    await deleteDiscountService(instructorId, id)
    getDiscountService(instructorId).then((data) => {
      setDiscounts(data)
    })
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Discounts List</h2>
        <table className="min-w-full table-auto bg-white shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Percentage</th>
              <th className="px-4 py-2 text-left">Expiry Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount._id}>
                <td className="px-4 py-2">{discount.code}</td>
                <td className="px-4 py-2">{discount.percentage}%</td>
                <td className="px-4 py-2">
                  {new Date(discount.expiryDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(discount._id)}
                    className="text-blue-500 mr-2"
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={() => handleDelete(discount._id)}
                    className="text-red-500"
                  >
                    <Trash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Discount
