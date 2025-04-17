import User from '../../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  })

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Username or Email is already used',
    })
  }

  const hashPassword = await bcrypt.hash(password, 10)
  const newUser = new User({ username, email, role, password: hashPassword })

  await newUser.save()

  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
  })
}

const loginUser = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required',
    })
  }

  const checkUser = await User.findOne({ username })
  if (!checkUser) {
    return res.status(401).json({
      success: false,
      message: 'Invalid Credentials',
    })
  }

  const isPasswordValid = await bcrypt.compare(password, checkUser.password)
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Password is incorrect',
    })
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      username: checkUser.username,
      email: checkUser.email,
      role: checkUser.role,
    },
    'JWT_SECRET',
    { expiresIn: '120m' }
  )

  res.status(200).json({
    success: true,
    message: 'Login Successfully',
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        username: checkUser.username,
        email: checkUser.email,
        role: checkUser.role,
      },
    },
  })
}

const loginAdmin = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required',
    })
  }

  const checkUser = await User.findOne({ username })
  if (!checkUser) {
    return res.status(401).json({
      success: false,
      message: 'Invalid Credentials',
    })
  }

  const isPasswordValid = await bcrypt.compare(password, checkUser.password)
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Password is incorrect',
    })
  }

  if (checkUser.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You are not an admin.',
    })
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      username: checkUser.username,
      email: checkUser.email,
      role: checkUser.role,
    },
    'JWT_SECRET',
    { expiresIn: '120m' }
  )

  res.status(200).json({
    success: true,
    message: 'Admin logged in successfully',
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        username: checkUser.username,
        email: checkUser.email,
        role: checkUser.role,
      },
    },
  })
}

export { registerUser, loginUser, loginAdmin }
