import express from 'express'
import {
  getAllUsers,
  deleteUser,
  acceptProviderRequest,
  getAllCourses,
  acceptCourse,
  rejectCourse,
} from '../../controllers/admin/adminController.js'
import { authenticate, verifyAdmin } from '../../middleware/auth.js'

const router = express.Router()

router.get('/users', authenticate, verifyAdmin, getAllUsers)

router.delete('/users/:id', authenticate, verifyAdmin, deleteUser)

router.put(
  '/users/accept-provider/:id',
  authenticate,
  verifyAdmin,
  acceptProviderRequest
)

router.get('/courses', authenticate, verifyAdmin, getAllCourses)

router.put('/courses/accept/:id', authenticate, verifyAdmin, acceptCourse)

router.put('/courses/reject/:id', authenticate, verifyAdmin, rejectCourse)

export default router
