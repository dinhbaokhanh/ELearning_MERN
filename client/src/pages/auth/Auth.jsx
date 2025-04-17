import CommonForm from '@/components/common/common'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { loginControls, registerControls } from '@/config/config'
import { AuthContext } from '@/context/auth/authContext.js'
import { SwatchBook } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login')
  const {
    loginFormData,
    setLoginFormData,
    registerFormData,
    setRegisterFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext)

  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  const checkIfLoginValid = () => {
    return (
      loginFormData &&
      loginFormData.username !== '' &&
      loginFormData.password !== ''
    )
  }

  const checkIfRegisterValid = () => {
    return (
      registerFormData &&
      registerFormData.username !== '' &&
      registerFormData.email !== '' &&
      registerFormData.password !== '' &&
      registerFormData.confirmPassword !== '' &&
      registerFormData.password === registerFormData.confirmPassword
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-slate-100">
      <header className="px-6 py-4 border-b shadow-sm bg-white">
        <Link
          to="/"
          className="flex items-center text-orange-500 font-extrabold text-xl gap-2 hover:text-orange-600 transition"
        >
          <SwatchBook className="w-7 h-7" />
          <span>EduPress</span>
        </Link>
      </header>

      <div className="flex items-center justify-center flex-1">
        <Tabs
          value={activeTab}
          defaultValue="login"
          onValueChange={handleTabChange}
          className="w-full max-w-md"
        >
          <TabsList className="grid grid-cols-2 w-full mb-4 border rounded-lg overflow-hidden bg-slate-50">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Log In
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="p-6 rounded-xl shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold text-gray-800">
                  Welcome Back
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CommonForm
                  formControl={loginControls}
                  buttonText={'Login'}
                  formData={loginFormData}
                  setFormData={setLoginFormData}
                  isButtonDisabled={!checkIfLoginValid()}
                  handleSubmit={handleLoginUser}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="p-6 rounded-xl shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold text-gray-800">
                  Create Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CommonForm
                  formControl={registerControls}
                  buttonText={'Register'}
                  formData={registerFormData}
                  setFormData={setRegisterFormData}
                  isButtonDisabled={!checkIfRegisterValid()}
                  handleSubmit={handleRegisterUser}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Auth
