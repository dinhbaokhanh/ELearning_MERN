/* eslint-disable react-hooks/exhaustive-deps */
import {
  initialLoginFormData,
  initialRegisterFormData,
} from '@/config/config.js'
import {
  checkAuthService,
  loginAdmin,
  loginService,
  registerService,
} from '@/services/service'
import { useEffect, useState } from 'react'
import { AuthContext } from './authContext.js'
import { Skeleton } from '@/components/ui/skeleton.jsx'
import { useNavigate } from 'react-router-dom'

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [loginFormData, setLoginFormData] = useState(initialLoginFormData)
  const [registerFormData, setRegisterFormData] = useState(
    initialRegisterFormData
  )
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  })

  const [loading, setLoading] = useState(true)

  async function handleRegisterUser(e) {
    e.preventDefault()
    const data = await registerService(registerFormData)

    if (data.success) {
      sessionStorage.setItem(
        'accessToken',
        JSON.stringify(data.data.accessToken)
      )

      setAuth({
        authenticate: true,
        user: data.data.user,
      })
    } else {
      setAuth({
        authenticate: false,
        user: null,
      })
    }
  }

  async function handleLoginUser(e) {
    e.preventDefault()
    const data = await loginService(loginFormData)
    if (data.success) {
      sessionStorage.setItem(
        'accessToken',
        JSON.stringify(data.data.accessToken)
      )
      setAuth({
        authenticate: true,
        user: data.data.user,
      })
    } else {
      setAuth({
        authenticate: false,
        user: null,
      })
    }
  }

  async function handleLoginAdmin(e) {
    e.preventDefault()
    const data = await loginAdmin(loginFormData)
    if (data.success) {
      sessionStorage.setItem(
        'accessToken',
        JSON.stringify(data.data.accessToken)
      )
      setAuth({
        authenticate: true,
        user: data.data.user,
      })
    } else {
      setAuth({
        authenticate: false,
        user: null,
      })
    }
  }

  async function checkAuthUser() {
    try {
      const data = await checkAuthService()

      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        })
      } else {
        setAuth({
          authenticate: false,
          user: null,
        })
        navigate('/auth')
      }
    } catch (error) {
      console.log(error)
      setAuth({
        authenticate: false,
        user: null,
      })
      navigate('/auth')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!auth.authenticate) {
      checkAuthUser()
    }
  }, [])

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    })
  }
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        loginFormData,
        setLoginFormData,
        registerFormData,
        setRegisterFormData,
        handleRegisterUser,
        handleLoginUser,
        handleLoginAdmin,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  )
}
