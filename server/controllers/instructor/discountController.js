import Course from '../../models/Course.js'
import Discount from '../../models/Discount.js'

const createDiscount = async (req, res) => {
  try {
    const { title, code, percentage, expiryDate } = req.body
    const { instructorId } = req.params

    const course = await Course.findOne({ title, instructorId })
    if (!course) {
      return res
        .status(404)
        .json({ message: 'Course not found with given title and instructor' })
    }

    const existing = await Discount.findOne({ code })
    if (existing) {
      return res.status(400).json({ message: 'Discount code already exists' })
    }

    const newDiscount = await Discount.create({
      courseId: course._id,
      code,
      percentage: Number(percentage),
      ...(expiryDate ? { expiryDate: new Date(expiryDate) } : {}), // Nếu có expiryDate thì truyền vào
      createdBy: instructorId,
    })

    res.status(201).json(newDiscount)
  } catch (err) {
    console.error('Error creating discount:', err)
    res
      .status(500)
      .json({ message: 'Error creating discount', error: err.message })
  }
}

const updateDiscount = async (req, res) => {
  try {
    const { id, instructorId } = req.params
    const { code, percentage, expiryDate } = req.body

    const discount = await Discount.findById(id)
    if (!discount)
      return res.status(404).json({ message: 'Discount not found' })

    if (discount.createdBy !== instructorId) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    discount.code = code || discount.code
    discount.percentage = percentage || discount.percentage
    discount.expiryDate = expiryDate || discount.expiryDate

    await discount.save()
    res.json(discount)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error updating discount' })
  }
}

const getDiscounts = async (req, res) => {
  try {
    const { instructorId } = req.params
    const discounts = await Discount.find({ createdBy: instructorId })

    if (!discounts) {
      return res.status(404).json({ message: 'No discounts found' })
    }

    res.status(200).json(discounts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching discounts' })
  }
}

const deleteDiscount = async (req, res) => {
  try {
    const { id, instructorId } = req.params

    const discount = await Discount.findById(id)
    if (!discount)
      return res.status(404).json({ message: 'Discount not found' })

    if (discount.createdBy !== instructorId) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    await discount.deleteOne()
    res.json({ message: 'Discount deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error deleting discount' })
  }
}

export { createDiscount, getDiscounts, updateDiscount, deleteDiscount }
