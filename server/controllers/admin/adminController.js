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

const changeRoleUser = async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (user.role === 'student') {
      user.role = 'instructor'
      user.isInstructorRequested = false
    } else if (user.role === 'instructor') {
      user.role = 'student'
      user.isInstructorRequested = false
    } else {
      return res
        .status(400)
        .json({ success: false, message: 'Cannot change this user role' })
    }

    await user.save()

    return res.status(200).json({
      success: true,
      message: `User role changed to ${user.role}`,
      updatedUser: user,
    })
  } catch (error) {
    console.error('Change role error:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

const acceptInstructorRequest = async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (!user.isInstructorRequested) {
      return res.status(400).json({
        success: false,
        message: 'User did not request to be a instructor',
      })
    }

    user.isInstructorRequested = false
    user.role = 'instructor'
    await user.save()

    res
      .status(200)
      .json({ success: true, message: 'User is now a instructor', user })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const rejectInstructorRequest = async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (!user.isInstructorRequested) {
      return res.status(400).json({
        success: false,
        message: 'User did not request to be an instructor',
      })
    }

    user.isInstructorRequested = false
    await user.save()

    res
      .status(200)
      .json({ success: true, message: 'Instructor request rejected', user })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
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
  acceptInstructorRequest,
  rejectInstructorRequest,
  getAllCourses,
  acceptCourse,
  rejectCourse,
  changeRoleUser,
}
