import express from 'express'
import { requestInstructor } from '../../controllers/student/studentController.js'
import {
  getAllStudentCourses,
  getStudentCourseDetails,
} from '../../controllers/student/courseController.js'

const router = express.Router()

router.post('/:userId/request-instructor', requestInstructor)

router.get('/course/get', getAllStudentCourses)
router.get('/course/get/details/:id', getStudentCourseDetails)

export default router
