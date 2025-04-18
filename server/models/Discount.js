import mongoose from 'mongoose'

const DiscountSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    percentage: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    expiryDate: {
      type: Date,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Discount ||
  mongoose.model('Discount', DiscountSchema)
