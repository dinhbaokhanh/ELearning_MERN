import express from 'express'
import { requestInstructor } from '../../controllers/student/studentController.js'
import {
  addReviewToCourse,
  checkCoursePurchaseInfo,
  getAllStudentCourses,
  getStudentCourseDetails,
  updateReviewInCourse,
} from '../../controllers/student/courseController.js'

const router = express.Router()

router.post('/:userId/request-instructor', requestInstructor)

router.get('/course/get', getAllStudentCourses)
router.get('/course/get/details/:id/:studentId', getStudentCourseDetails)
router.get('/course/purchase-info/:id/:studentId', checkCoursePurchaseInfo)
router.post('/:courseId/reviews', addReviewToCourse)
router.put('/:courseId/reviews/:studentId', updateReviewInCourse)

export default router
