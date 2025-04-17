import express from 'express'
import {
  registerUser,
  loginUser,
  loginAdmin,
} from '../../controllers/auth-controller/auth.js'
import { authenticate } from '../../middleware/auth.js'

const router = express.Router()

router.post('/admin/login', loginAdmin)

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/check-auth', authenticate, (req, res) => {
  const user = req.user
  res.status(200).json({
    success: true,
    message: 'Authenticated!!',
    data: {
      user,
    },
  })
})

export default router
