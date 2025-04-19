import axiosInstance from '@/api/axios'
import axios, { Axios } from 'axios'

export async function registerService(formData) {
  const { data } = await axiosInstance.post('auth/register', {
    ...formData,
    role: 'user',
  })

  return data
}

export async function loginService(formData) {
  const { data } = await axiosInstance.post('auth/login', formData)
  return data
}

export async function loginAdmin(formData) {
  const { data } = await axiosInstance.post('auth/admin/login', formData)
  return data
}

export async function checkAuthService() {
  const { data } = await axiosInstance.get('auth/check-auth')
  return data
}

export async function mediaUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post('/media/upload', formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      onProgressCallback(percentCompleted)
    },
  })

  return data
}

export async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`)
  return data
}

export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get('/instructor/course/get')
  return data
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post('instructor/course/add', formData)
  return data
}

export async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(`/instructor/course/details/${id}`)
  return data
}

export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  )
  return data
}

export async function createDiscountService(instructorId, formData) {
  const { data } = await axiosInstance.post(
    `/instructor/discount/${instructorId}`,
    formData
  )
  return data
}

export async function getDiscountService(instructorId) {
  const { data } = await axiosInstance.get(
    `/instructor/discount/${instructorId}`
  )
  return data
}

export async function updateDiscountService(
  instructorId,
  discountId,
  formData
) {
  const { data } = await axiosInstance.put(
    `/instructor/discount/${instructorId}/${discountId}`,
    formData
  )
  return data
}

export async function deleteDiscountService(instructorId, discountId) {
  const { data } = await axiosInstance.delete(
    `/instructor/discount/${instructorId}/${discountId}`
  )
  return data
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post('/media/bulk-upload', formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      onProgressCallback(percentCompleted)
    },
  })

  return data
}

export async function fetchUsersListService() {
  const { data } = await axiosInstance.get('/admin/users')
  return data
}

export async function changeUserRoleService(id) {
  const { data } = await axiosInstance.put(`/admin/users/change-role/${id}`)
  return data
}

export async function deleteUserService(id) {
  const { data } = await axiosInstance.delete(`/admin/users/${id}`)
  return data
}

export async function fetchAllCoursesService() {
  const { data } = await axiosInstance.get('/admin/courses')
  return data
}

export async function acceptCourseService(id) {
  const { data } = await axiosInstance.put(`/admin/courses/accept/${id}`)
  return data
}

export async function rejectCourseService(id) {
  const { data } = await axiosInstance.put(`/admin/courses/reject/${id}`)
  return data
}

export async function acceptInstructorService(id) {
  const { data } = await axiosInstance.put(`/admin/users/accept-provider/${id}`)
  return data
}

export async function rejectInstructorService(id) {
  const { data } = await axiosInstance.put(`/admin/users/reject-provider/${id}`)
  return data
}

export async function fetchStudentCoursesService(query) {
  const { data } = await axiosInstance.get(`/student/course/get?${query}`)
  return data
}

export async function fetchStudentCoursesDetailsService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}/${studentId}`
  )
  return data
}

export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(`/student/order/create`, formData)
  return data
}

export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  const { data } = await axiosInstance.post(`/student/order/capture`, {
    paymentId,
    payerId,
    orderId,
  })

  return data
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/purchase-info/${courseId}/${studentId}`
  )

  return data
}

export async function fetchStudentBoughtCoursesService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}`
  )

  return data
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  )

  return data
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  )

  return data
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    {
      userId,
      courseId,
    }
  )

  return data
}
