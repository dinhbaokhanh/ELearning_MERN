import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Textarea } from '../ui/textarea'

function FormControl({ formControl = [], formData, setFormData }) {
  function renderComponentByType(getControllerItem) {
    let element = null
    const currentValue = formData[getControllerItem.name] || ''

    switch (getControllerItem.componentType) {
      case 'input':
        element = (
          <Input
            id={getControllerItem.name}
            name={getControllerItem.name}
            placeholder={getControllerItem.placeholder}
            type={getControllerItem.type}
            value={currentValue}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControllerItem.name]: e.target.value,
              })
            }
          />
        )
        break
      case 'select':
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControllerItem.name]: value,
              })
            }
            value={currentValue}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControllerItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControllerItem.options && getControllerItem.options.length > 0
                ? getControllerItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        )
        break
      case 'textarea':
        element = (
          <Textarea
            id={getControllerItem.name}
            name={getControllerItem.name}
            placeholder={getControllerItem.placeholder}
            value={currentValue}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControllerItem.name]: e.target.value,
              })
            }
          />
        )
        break

      default:
        element = (
          <Input
            id={getControllerItem.name}
            name={getControllerItem.name}
            placeholder={getControllerItem.placeholder}
            type={getControllerItem.type}
            value={currentValue}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControllerItem.name]: e.target.value,
              })
            }
          />
        )
        break
    }
    return element
  }
  return (
    <div className="flex flex-col gap-6">
      {formControl.map((controllerItem) => (
        <div key={controllerItem.name} className="flex flex-col gap-2">
          <Label
            htmlFor={controllerItem.name}
            className="text-sm font-medium text-gray-700"
          >
            {controllerItem.label}
          </Label>
          {renderComponentByType(controllerItem)}
        </div>
      ))}
    </div>
  )
}

export default FormControl
