// src/pages/OAuth2RedirectHandler.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate()
  const setAuthFromToken = useAuthStore((state) => state.setAuthFromToken)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')

    if (token) {
      setAuthFromToken(token)
      navigate('/')
    } else {
      navigate('/login')
    }
  }, [])

  return <div>Redirecting...</div>
}


export default OAuth2RedirectHandler
