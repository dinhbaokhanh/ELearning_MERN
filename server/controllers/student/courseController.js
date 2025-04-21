import Course from '../../models/Course.js'
import StudentCourses from '../../models/StudentCourses.js'

const getAllStudentCourses = async (req, res) => {
  try {
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = 'price-lowtohigh',
    } = req.query

    console.log(req.query, 'req.query')

    let filters = {}
    if (category.length) {
      filters.category = { $in: category.split(',') }
    }
    if (level.length) {
      filters.level = { $in: level.split(',') }
    }
    if (primaryLanguage.length) {
      filters.primaryLanguage = { $in: primaryLanguage.split(',') }
    }

    let sortParam = {}
    switch (sortBy) {
      case 'price-lowtohigh':
        sortParam.pricing = 1

        break
      case 'price-hightolow':
        sortParam.pricing = -1

        break
      case 'title-atoz':
        sortParam.title = 1

        break
      case 'title-ztoa':
        sortParam.title = -1

        break

      default:
        sortParam.pricing = 1
        break
    }

    const coursesList = await Course.find(filters).sort(sortParam)

    res.status(200).json({
      success: true,
      data: coursesList,
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      success: false,
      message: 'Some error occurred!',
    })
  }
}

const getStudentCourseDetails = async (req, res) => {
  try {
    const { id, studentId } = req.params
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

const checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params
    const studentCourses = await StudentCourses.findOne({
      userId: studentId,
    })

    const ifStudentAlreadyBoughtCurrentCourse =
      studentCourses.courses.findIndex((item) => item.courseId === id) > -1
    res.status(200).json({
      success: true,
      data: ifStudentAlreadyBoughtCurrentCourse,
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      success: false,
      message: 'Some error occurred!',
    })
  }
}

const calculateAverageRating = (reviews) => {
  if (reviews.length === 0) return 0
  const total = reviews.reduce((sum, r) => sum + r.rating, 0)
  return parseFloat((total / reviews.length).toFixed(1))
}

const addReviewToCourse = async (req, res) => {
  const { courseId } = req.params
  const { studentId, studentName, rating, comment } = req.body

  if (!studentId || !studentName || !rating || !comment) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' })
  }

  if (!comment.trim()) {
    return res.status(400).json({ message: 'Comment cannot be empty' })
  }

  try {
    const course = await Course.findById(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const existing = course.rating.reviews.find(
      (r) => r.studentId === studentId
    )
    if (existing) {
      return res
        .status(400)
        .json({ message: 'You already reviewed this course' })
    }

    course.rating.reviews.push({ studentId, studentName, rating, comment })

    const total = course.rating.reviews.reduce((sum, r) => sum + r.rating, 0)
    course.rating.totalRatings = course.rating.reviews.length
    course.rating.average = total / course.rating.totalRatings

    await course.save()

    res.status(200).json({
      message: 'Review added successfully',
      averageRating: course.rating.average,
    })
  } catch (err) {
    console.error('Error adding review:', err)
    res.status(500).json({ message: 'Error adding review', error: err.message })
  }
}

const updateReviewInCourse = async (req, res) => {
  const { courseId, studentId } = req.params
  const { rating, comment } = req.body

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' })
  }

  if (!comment.trim()) {
    return res.status(400).json({ message: 'Comment cannot be empty' })
  }

  try {
    const course = await Course.findById(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const review = course.rating.reviews.find((r) => r.studentId === studentId)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    review.rating = rating
    review.comment = comment
    review.date = new Date()

    const total = course.rating.reviews.reduce((sum, r) => sum + r.rating, 0)
    course.rating.totalRatings = course.rating.reviews.length
    course.rating.average = total / course.rating.totalRatings

    await course.save()

    res.status(200).json({
      message: 'Review updated successfully',
      averageRating: course.rating.average,
    })
  } catch (err) {
    console.error('Error updating review:', err)
    res.status(500).json({
      message: 'Error updating review',
      error: err.message,
    })
  }
}

export {
  getAllStudentCourses,
  getStudentCourseDetails,
  checkCoursePurchaseInfo,
  addReviewToCourse,
  updateReviewInCourse,
}
