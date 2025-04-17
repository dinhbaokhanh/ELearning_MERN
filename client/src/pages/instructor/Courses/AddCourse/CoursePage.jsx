import FormControl from '@/components/common/FormControl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { courseLandingPageFormControls } from '@/config/config'
import { InstructorContext } from '@/context/instructor/instructorContext'
import React, { useContext } from 'react'

const CoursePage = () => {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Display Page</CardTitle>
      </CardHeader>
      <CardContent>
        <FormControl
          formControl={courseLandingPageFormControls}
          formData={courseLandingFormData}
          setFormData={setCourseLandingFormData}
        />
      </CardContent>
    </Card>
  )
}

export default CoursePage
