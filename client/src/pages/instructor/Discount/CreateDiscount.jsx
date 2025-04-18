import React, { useState, useEffect, useContext } from 'react'
import {
  createDiscountService,
  getDiscountService,
} from '@/services/service.js'
import { AuthContext } from '@/context/auth/authContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const CreateDiscount = () => {
  const { auth } = useContext(AuthContext)

  const [discounts, setDiscounts] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    percentage: 0,
    expiryDate: '',
  })
  const instructorId = auth?.user?.role === 'instructor' ? auth.user._id : null

  useEffect(() => {
    if (instructorId) {
      getDiscountService(instructorId).then((data) => {
        setDiscounts(data)
      })
    }
  }, [instructorId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!instructorId) return

    const payload = {
      title: formData.title,
      code: formData.code,
      percentage: Number(formData.percentage),
      ...(formData.expiryDate && { expiryDate: formData.expiryDate }),
    }

    await createDiscountService(instructorId, payload)

    setFormData({
      title: '',
      code: '',
      percentage: 0,
      expiryDate: '',
    })

    const data = await getDiscountService(instructorId)
    setDiscounts(data)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg p-6 rounded-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Course Title
            </label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Discount Code
            </label>
            <Input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="percentage"
              className="block text-sm font-medium text-gray-700"
            >
              Percentage
            </label>
            <Input
              type="number"
              id="percentage"
              name="percentage"
              value={formData.percentage}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700"
            >
              Expiry Date (optional)
            </label>
            <Input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
            />
          </div>

          <Button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Create
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CreateDiscount
