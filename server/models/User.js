import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'provider', 'student'],
    default: 'student',
  },
  isProviderRequested: {
    type: Boolean,
    default: false,
  },
  isProvider: {
    type: Boolean,
    default: false,
  },
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
