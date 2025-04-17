import express from 'express'
import {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
} from '../../controllers/instructor/courseController.js'

const router = express.Router()

router.post('/add', addNewCourse)
router.get('/get', getAllCourses)
router.get('/details/:id', getCourseDetailsByID)
router.put('/update/:id', updateCourseByID)

export default router
