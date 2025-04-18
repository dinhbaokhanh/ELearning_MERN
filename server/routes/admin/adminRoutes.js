import express from 'express'
import {
  getAllUsers,
  deleteUser,
  getAllCourses,
  acceptCourse,
  rejectCourse,
  acceptInstructorRequest,
  changeRoleUser,
  rejectInstructorRequest,
} from '../../controllers/admin/adminController.js'
import { authenticate, verifyAdmin } from '../../middleware/auth.js'

const router = express.Router()

router.get('/users', authenticate, verifyAdmin, getAllUsers)

router.delete('/users/:id', authenticate, verifyAdmin, deleteUser)

router.put('/users/change-role/:id', authenticate, verifyAdmin, changeRoleUser)

router.put(
  '/users/accept-provider/:id',
  authenticate,
  verifyAdmin,
  acceptInstructorRequest
)

router.put(
  '/users/reject-provider/:id',
  authenticate,
  verifyAdmin,
  rejectInstructorRequest
)

router.get('/courses', authenticate, verifyAdmin, getAllCourses)

router.put('/courses/accept/:id', authenticate, verifyAdmin, acceptCourse)

router.put('/courses/reject/:id', authenticate, verifyAdmin, rejectCourse)

export default router
