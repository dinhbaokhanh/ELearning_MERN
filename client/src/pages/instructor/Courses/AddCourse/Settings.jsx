import ProgressBar from '@/components/media/ProgressBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InstructorContext } from '@/context/instructor/instructorContext'
import { mediaUploadService } from '@/services/service'
import React, { useContext } from 'react'

const Settings = () => {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext)

  const handleImageUpload = async (e) => {
    const selectedImg = e.target.files[0]

    if (selectedImg) {
      const imgFormData = new FormData()
      imgFormData.append('file', selectedImg)
      try {
        setMediaUploadProgress(true)
        const res = await mediaUploadService(
          imgFormData,
          setMediaUploadProgressPercentage
        )
        if (res.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: res.data.url,
          })
          setMediaUploadProgress(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  console.log(courseLandingFormData)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      {mediaUploadProgress ? (
        <ProgressBar
          isMediaUploading={mediaUploadProgress}
          progress={mediaUploadProgressPercentage}
        />
      ) : null}
      <CardContent>
        {courseLandingFormData?.image ? (
          <img
            src={courseLandingFormData.image}
            className="max-w-xs rounded-lg"
          />
        ) : (
          <div className="flex flex-col gap-3">
            <Label>Course Image</Label>
            <Input onChange={handleImageUpload} type="file" accept="image/*" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default Settings
