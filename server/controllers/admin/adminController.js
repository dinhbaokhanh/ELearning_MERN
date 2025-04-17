import User from '../../models/User.js'
import Course from '../../models/Course.js'

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
    res.status(200).json({ success: true, users })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const deleteUser = async (req, res) => {
  const { id } = req.params
  try {
    await User.findByIdAndDelete(id)
    res.status(200).json({ success: true, message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const acceptProviderRequest = async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (!user.isProviderRequested) {
      return res.status(400).json({
        success: false,
        message: 'User did not request to be a provider',
      })
    }

    user.isProvider = true
    user.isProviderRequested = false
    await user.save()

    res
      .status(200)
      .json({ success: true, message: 'User is now a provider', user })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('creator', 'username email')
    res.status(200).json({ success: true, courses })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const acceptCourse = async (req, res) => {
  const { id } = req.params
  try {
    const course = await Course.findByIdAndUpdate(
      id,
      { status: 'Accepted' },
      { new: true }
    )
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: 'Course not found' })
    }
    res.status(200).json({ success: true, message: 'Course accepted', course })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const rejectCourse = async (req, res) => {
  const { id } = req.params
  try {
    const course = await Course.findByIdAndUpdate(
      id,
      { status: 'Rejected' },
      { new: true }
    )
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: 'Course not found' })
    }
    res.status(200).json({ success: true, message: 'Course rejected', course })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export {
  getAllUsers,
  deleteUser,
  acceptProviderRequest,
  getAllCourses,
  acceptCourse,
  rejectCourse,
}
