import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  userId: String,
  username: String,
  email: String,
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  orderDate: Date,
  paymentId: String,
  payerId: String,
  instructorId: String,
  instructorName: String,
  courseImage: String,
  courseTitle: String,
  courseId: String,
  coursePricing: String,
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
