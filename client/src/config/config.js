export const registerControls = [
  {
    name: 'username',
    label: 'Username',
    placeholder: 'Enter your username',
    type: 'text',
    componentType: 'input',
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    componentType: 'input',
  },
  {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    componentType: 'input',
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: 'Enter your password',
    type: 'password',
    componentType: 'input',
  },
]

export const loginControls = [
  {
    name: 'username',
    label: 'Username',
    placeholder: 'Enter your username',
    type: 'text',
    componentType: 'input',
  },
  {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    componentType: 'input',
  },
]

export const initialLoginFormData = {
  username: '',
  password: '',
}

export const initialRegisterFormData = {
  username: '',
  userEmail: '',
  password: '',
}

export const courseLevelOptions = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
]

export const courseCategories = [
  { id: 'software-engineer', label: 'Software Engineer' },
  { id: 'data-engineer', label: 'Data Engineer' },
  { id: 'ui-ux-design', label: 'UI/UX Design' },
  { id: 'devops', label: 'DevOps & Automation' },
  { id: 'blockchain', label: 'Blockchain & Web3' },
  { id: 'robotics', label: 'Robotics' },
  { id: 'digital-marketing', label: 'Digital Marketing' },
  { id: 'startup-business', label: 'Startup & Entrepreneurship' },
  { id: 'product-management', label: 'Product Management' },
  { id: 'ai-ethics', label: 'AI & Ethics' },
]

export const courseLandingPageFormControls = [
  {
    name: 'title',
    label: 'Title',
    componentType: 'input',
    type: 'text',
    placeholder: 'Enter course title',
  },
  {
    name: 'category',
    label: 'Category',
    componentType: 'select',
    type: 'text',
    placeholder: '',
    options: courseCategories,
  },
  {
    name: 'level',
    label: 'Level',
    componentType: 'select',
    type: 'text',
    placeholder: '',
    options: courseLevelOptions,
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    componentType: 'input',
    type: 'text',
    placeholder: 'Enter course subtitle',
  },
  {
    name: 'description',
    label: 'Description',
    componentType: 'textarea',
    type: 'text',
    placeholder: 'Enter course description',
  },
  {
    name: 'pricing',
    label: 'Pricing',
    componentType: 'input',
    type: 'number',
    placeholder: 'Enter course pricing',
  },
  {
    name: 'objectives',
    label: 'Objectives',
    componentType: 'textarea',
    type: 'text',
    placeholder: 'Enter course objectives and break the line if use dot (.)',
  },
  {
    name: 'welcomeMessage',
    label: 'Welcome Message',
    componentType: 'textarea',
    placeholder: 'Welcome message for students',
  },
]

export const courseLandingInitialFormData = {
  title: '',
  category: '',
  level: '',
  subtitle: '',
  description: '',
  pricing: '',
  objectives: '',
  welcomeMessage: '',
  image: '',
}

export const courseOutlineInitialFormData = [
  {
    title: '',
    videoUrl: '',
    freePreview: false,
    public_id: '',
  },
]

export const sortOptions = [
  { id: 'price-lowtohigh', label: 'Price: Low to High' },
  { id: 'price-hightolow', label: 'Price: High to Low' },
  { id: 'title-atoz', label: 'Title: A to Z' },
  { id: 'title-ztoa', label: 'Title: Z to A' },
]

export const filterOptions = {
  category: courseCategories,
  level: courseLevelOptions,
}
