import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const CommonForm = ({
  formControl,
  formData,
  setFormData,
  buttonText,
  handleSubmit,
  isButtonDisabled,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const password = formData?.password || ''
  const confirmPassword = formData?.confirmPassword || ''
  const isConfirmInvalid =
    'confirmPassword' in formData && confirmPassword !== password

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!isConfirmInvalid) handleSubmit(e)
      }}
      className="space-y-4"
    >
      {formControl.map((control) => (
        <div key={control.name} className="space-y-1">
          <Label htmlFor={control.name}>{control.label}</Label>
          <Input
            type={control.type}
            name={control.name}
            id={control.name}
            value={formData[control.name]}
            onChange={handleChange}
            required
            className={
              control.name === 'confirmPassword' && isConfirmInvalid
                ? 'border-red-500 focus-visible:ring-red-500'
                : ''
            }
          />
          {control.name === 'confirmPassword' && isConfirmInvalid && (
            <p className="text-sm text-red-500">Passwords do not match.</p>
          )}
        </div>
      ))}
      <Button
        type="submit"
        disabled={isButtonDisabled || isConfirmInvalid}
        className="w-full"
      >
        {buttonText}
      </Button>
    </form>
  )
}

export default CommonForm
