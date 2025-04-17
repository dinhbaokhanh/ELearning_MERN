import Course from '../../models/Course.js'

const getAllStudentCourses = async (req, res) => {
  try {
    const courseList = await Course.find({ status: 'Accepted' })

    if (courseList.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No Course Found',
        data: [],
      })
    }

    res.status(200).json({
      success: true,
      data: courseList,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Some error occurred',
    })
  }
}

const getStudentCourseDetails = async (res, res) => {
  try {
    const { id } = req.params
    const courseDetails = await Course.findById(id)

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: 'No Course Found',
        data: null,
      })
    }
    res.status(200).json({
      success: true,
      data: courseDetails,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Some error occurred',
    })
  }
}

export { getAllStudentCourses, getStudentCourseDetails }
