import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BookOpen, UserPlus } from 'lucide-react'
import { Input, Button } from '../../components/ui'
import { useAuthStore } from '../../store/authStore'
import { authApi, usersApi } from '../../api'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

const registerSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email'),
  full_name: z.string().min(1, 'Full name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)

  const from = location.state?.from?.pathname || '/'

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const {
    register: registerForm,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onLogin = async (data) => {
    setIsLoading(true)
    try {
      const response = await authApi.login(data)
      
      if (!response.access_token) {
        throw new Error('No access token in response')
      }
      
      login(response.access_token, response.refresh_token, null)
      
      const userResponse = await usersApi.getMe()
      useAuthStore.getState().setUser(userResponse)
      
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (error) {
      const message = error.response?.data?.detail || error.message || 'Login failed'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const onRegister = async (data) => {
    setIsLoading(true)
    try {
      await usersApi.register(data)
      toast.success('Registration successful! Please login.')
      setIsLogin(true)
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        padding: '1rem',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '400px',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            {isLogin ? <BookOpen size={32} color="white" /> : <UserPlus size={32} color="white" />}
          </div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            Library Management
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit(onLogin)}>
            <Input
              label="Username"
              {...registerLogin('username')}
              error={loginErrors.username?.message}
            />
            <Input
              label="Password"
              type="password"
              {...registerLogin('password')}
              error={loginErrors.password?.message}
            />
            <Button
              type="submit"
              loading={isLoading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              Sign In
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit(onRegister)}>
            <Input
              label="Username"
              {...registerForm('username')}
              error={registerErrors.username?.message}
            />
            <Input
              label="Email"
              type="email"
              {...registerForm('email')}
              error={registerErrors.email?.message}
            />
            <Input
              label="Full Name"
              {...registerForm('full_name')}
              error={registerErrors.full_name?.message}
            />
            <Input
              label="Password"
              type="password"
              {...registerForm('password')}
              error={registerErrors.password?.message}
            />
            <Button
              type="submit"
              loading={isLoading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              Register
            </Button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            {isLogin ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
