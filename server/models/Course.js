import mongoose from 'mongoose'

const LectureSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  public_id: String,
  freePreview: Boolean,
})

const CourseSchema = new mongoose.Schema({
  instructorId: String,
  instructorName: String,
  date: Date,
  title: String,
  category: String,
  level: String,
  language: String,
  subtitle: String,
  description: String,
  image: String,
  welcomeMessage: String,
  pricing: Number,
  objectives: String,
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
  students: [
    {
      studentId: String,
      studentName: String,
      studentEmail: String,
    },
  ],
  outline: [LectureSchema],
  isPublished: Boolean,

  rating: {
    average: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        studentId: String,
        studentName: String,
        comment: String,
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
})

export default mongoose.models.Course || mongoose.model('Course', CourseSchema)
