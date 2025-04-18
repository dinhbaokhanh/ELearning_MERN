import { faker } from '@faker-js/faker'
import mongoose from 'mongoose'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

mongoose
  .connect(
    'mongodb+srv://baokhanh8229:uE9PSezNQjdh3ExZ@cluster0.d1xh5s5.mongodb.net/',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
  })

const generateStudent = async (num) => {
  for (let i = 0; i < num; i++) {
    const plainPassword = 'password123'
    const hashedPassword = await bcrypt.hash(plainPassword, 10)

    const student = new User({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: hashedPassword,
      role: 'student',
      isInstructorRequested: false,
    })

    await student
      .save()
      .then(() =>
        console.log(`Student ${student.username} created successfully!`)
      )
      .catch((err) => console.error('Error creating student:', err))
  }
}

generateStudent(10).then(() => {
  mongoose.disconnect()
})
