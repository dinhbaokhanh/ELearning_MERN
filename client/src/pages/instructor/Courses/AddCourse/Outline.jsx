import ProgressBar from '@/components/media/ProgressBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import VideoPlayer from '@/components/video/Video'
import { courseOutlineInitialFormData } from '@/config/config'
import { InstructorContext } from '@/context/instructor/instructorContext'
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from '@/services/service'
import { Upload } from 'lucide-react'
import React, { useContext, useRef } from 'react'

const Outline = () => {
  const {
    courseOutlineFormData,
    setCourseOutlineFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext)

  const bulkUploadInputRef = useRef(null)

  const handleNewLesson = () => {
    setCourseOutlineFormData([
      ...courseOutlineFormData,
      {
        ...courseOutlineInitialFormData[0],
      },
    ])
  }

  const handleCourseTitleChange = (e, index) => {
    let cpCourseOutlineFormData = [...courseOutlineFormData]
    cpCourseOutlineFormData[index] = {
      ...cpCourseOutlineFormData[index],
      title: e.target.value,
    }
    setCourseOutlineFormData(cpCourseOutlineFormData)
  }

  const handleFreePreviewChange = (value, index) => {
    let cpCourseOutlineFormData = [...courseOutlineFormData]
    cpCourseOutlineFormData[index] = {
      ...cpCourseOutlineFormData[index],
      freePreview: value,
    }
    setCourseOutlineFormData(cpCourseOutlineFormData)
  }

  const handleUpload = async (e, index) => {
    const selectedFile = e.target.files[0]

    if (selectedFile) {
      const videoFormData = new FormData()
      videoFormData.append('file', selectedFile)

      try {
        setMediaUploadProgress(true)
        const res = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        )
        if (res.success) {
          let cpCourseOutlineFormData = [...courseOutlineFormData]
          cpCourseOutlineFormData[index] = {
            ...cpCourseOutlineFormData[index],
            videoUrl: res?.data?.url,
            public_id: res?.data?.public_id,
          }
          setCourseOutlineFormData(cpCourseOutlineFormData)
          setMediaUploadProgress(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleReplace = async (index) => {
    let cpCourseOutlineFormData = [...courseOutlineFormData]
    const getCurrentVideoPublicId = cpCourseOutlineFormData[index].public_id

    const deleteCurrentMediaResponse = await mediaDeleteService(
      getCurrentVideoPublicId
    )

    if (deleteCurrentMediaResponse?.success) {
      cpCourseOutlineFormData[index] = {
        ...cpCourseOutlineFormData[index],
        videoUrl: '',
        public_id: '',
      }

      setCourseOutlineFormData(cpCourseOutlineFormData)
    }
  }

  const handleDelete = async (index) => {
    let cpCourseOutlineFormData = [...courseOutlineFormData]
    const getVideoPublicId = cpCourseOutlineFormData[index].public_id
    const res = await mediaDeleteService(getVideoPublicId)

    if (res?.success) {
      cpCourseOutlineFormData = cpCourseOutlineFormData.filter(
        (_, i) => i !== index
      )
      setCourseOutlineFormData(cpCourseOutlineFormData)
    }
  }

  const handleOpenBulkUploadDialog = () => {
    bulkUploadInputRef.current?.click()
  }

  const alLCourseOutlineEmpty = (arr) => {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === 'boolean') {
          return true
        }
        return value === ''
      })
    })
  }

  const handleMediaBulkUpload = async (e) => {
    const selectedFile = Array.from(e.target.files)
    const bulkFormData = new FormData()

    selectedFile.forEach((fileItem) => bulkFormData.append('files', fileItem))

    try {
      setMediaUploadProgress(true)
      const res = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      )
      if (res?.success) {
        let cpCourseOutlineFormData = alLCourseOutlineEmpty(
          courseOutlineFormData
        )
          ? []
          : [...courseOutlineFormData]

        cpCourseOutlineFormData = [
          ...cpCourseOutlineFormData,
          ...res?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lesson ${cpCourseOutlineFormData.length + (index + 1)}`,
            freePreview: false,
          })),
        ]

        setCourseOutlineFormData(cpCourseOutlineFormData)
        setMediaUploadProgress(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">
          Course Outline
        </CardTitle>
        <div>
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUploadDialog}
          >
            <Upload className="w-4 h-5 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Button
          onClick={handleNewLesson}
          className="mb-4 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Add Lesson
        </Button>

        {mediaUploadProgress && (
          <ProgressBar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        )}

        <div className="space-y-6">
          {courseOutlineFormData.map((outlineItem, index) => (
            <div
              key={index}
              className="border p-6 rounded-xl bg-white shadow-sm space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-1 items-center gap-4 flex-wrap">
                  <h3 className="text-lg font-semibold text-gray-700 whitespace-nowrap">
                    Lesson {index + 1}
                  </h3>

                  <Input
                    name="title"
                    placeholder="Enter lesson title"
                    className="flex-1 min-w-[200px]"
                    onChange={(e) => handleCourseTitleChange(e, index)}
                    value={courseOutlineFormData[index]?.title}
                  />

                  <div className="flex items-center space-x-2 whitespace-nowrap">
                    <Switch
                      onCheckedChange={(value) =>
                        handleFreePreviewChange(value, index)
                      }
                      checked={courseOutlineFormData[index]?.freePreview}
                      id={`freePreview-${index + 1}`}
                    />
                    <Label
                      htmlFor={`freePreview-${index + 1}`}
                      className="text-sm"
                    >
                      Free Preview
                    </Label>
                  </div>
                </div>
              </div>

              <div className="mt-2">
                {courseOutlineFormData[index]?.videoUrl ? (
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <VideoPlayer
                      url={courseOutlineFormData[index]?.videoUrl}
                      width="450px"
                      height="200px"
                      onProgressUpdate={(data) => {
                        console.log('Video progress update:', data)
                      }}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleReplace(index)}
                        variant="outline"
                      >
                        Replace Video
                      </Button>
                      <Button
                        onClick={() => handleDelete(index)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete Lesson
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      id={`video-upload-${index}`}
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleUpload(e, index)}
                    />
                    <label
                      htmlFor={`video-upload-${index}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700 transition w-max"
                    >
                      Upload Video
                    </label>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default Outline
