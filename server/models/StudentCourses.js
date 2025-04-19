import mongoose from 'mongoose'

const StudentCoursesSchema = new mongoose.Schema({
  userId: String,
  courses: [
    {
      courseId: String,
      title: String,
      instructorId: String,
      instructorName: String,
      dateOfPurchase: Date,
      courseImage: String,
    },
  ],
})

export default mongoose.models.StudentCourses ||
  mongoose.model('StudentCourses', StudentCoursesSchema)
