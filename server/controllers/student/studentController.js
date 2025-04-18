import User from '../../models/User.js'

const requestInstructor = async (req, res) => {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (user.role === 'instructor') {
      return res.status(400).json({ message: 'You are already an instructor' })
    }

    if (user.isInstructorRequested) {
      return res.status(400).json({ message: 'Request already submitted' })
    }

    user.isInstructorRequested = true
    await user.save()

    res.status(200).json({ message: 'Request submitted successfully' })
  } catch (error) {
    console.error('Error in requestInstructorById:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export { requestInstructor }
