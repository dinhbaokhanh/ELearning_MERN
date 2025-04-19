import express from 'express'
import { requestInstructor } from '../../controllers/student/studentController.js'
import {
  checkCoursePurchaseInfo,
  getAllStudentCourses,
  getStudentCourseDetails,
} from '../../controllers/student/courseController.js'

const router = express.Router()

router.post('/:userId/request-instructor', requestInstructor)

router.get('/course/get', getAllStudentCourses)
router.get('/course/get/details/:id/:studentId', getStudentCourseDetails)
router.get('/course/purchase-info/:id/:studentId', checkCoursePurchaseInfo)

export default router
