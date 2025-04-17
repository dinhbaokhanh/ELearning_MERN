import Course from '../../models/Course.js'

const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body
    const newCreatedCourse = new Course(courseData)
    const saveCourse = await newCreatedCourse.save()

    if (saveCourse) {
      res.status(201).json({
        success: true,
        message: 'Course is created successfully',
        data: {
          course: saveCourse,
        },
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Something is wrong',
    })
  }
}

const getAllCourses = async (req, res) => {
  try {
    const courseList = await Course.find({})

    res.status(200).json({
      success: true,
      data: courseList,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: true,
      message: 'Something is wrong',
    })
  }
}

const getCourseDetailsByID = async (req, res) => {
  try {
    const { id } = req.params
    const courseDetails = await Course.findById(id)
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      })
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: true,
      message: 'Something is wrong',
    })
  }
}

const updateCourseByID = async (req, res) => {
  try {
    const { id } = req.params
    const updatedCourseData = req.body

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updatedCourseData,
      {
        new: true,
      }
    )

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: true,
      message: 'Something is wrong',
    })
  }
}

export { addNewCourse, getAllCourses, getCourseDetailsByID, updateCourseByID }
