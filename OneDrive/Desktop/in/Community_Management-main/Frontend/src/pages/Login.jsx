import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthenticated, setToken } from '../auth'

function Login() {
  const navigate = useNavigate()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const BACKEND_ENABLED = (import.meta.env.VITE_BACKEND_ENABLED || 'false') === 'true'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!BACKEND_ENABLED) {
        // Dev mode: accept any credentials
        setAuthenticated(true)
        navigate('/dashboard')
        return
      }

      const response = await fetch('/api/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          password: password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setToken(data?.token)
        setAuthenticated(true)
        navigate('/dashboard')
      } else if (response.status === 400) {
        // User doesn't exist or invalid credentials
        const errorMessage = data.non_field_errors?.[0] || data.phone_number?.[0] || 'Invalid credentials'

        if (errorMessage.toLowerCase().includes('does not exist') || 
            errorMessage.toLowerCase().includes('not found') ||
            errorMessage.toLowerCase().includes('no active account')) {
          const userConfirmed = window.confirm(
            'User does not exist. Please sign up first.\n\nClick OK to go to Sign Up page.'
          )
          if (userConfirmed) {
            navigate('/signup')
          }
        } else {
          setError(errorMessage)
        }
      } else {
        setError(data.message || 'Login failed. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="left-section">
        <div className="logo-section">
          <h1>CIVIC HUB</h1>
          <p>Your Voice, Your Region</p>
        </div>
      </div>
      <div className="right-section">
        <div className="form-card">
          <h2>LOGIN</h2>
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Enter phone number</label>
              <input 
                type="text" 
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Enter password</label>
              <input 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="link-text">Forgot Password?</p>
            <p className="link-text" onClick={() => navigate('/signup')}>
              New User? Click here to Sign up →
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
