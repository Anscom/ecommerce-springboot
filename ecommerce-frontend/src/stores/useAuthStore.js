// src/store/useAuthStore.js
import { create } from 'zustand'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useCartStore } from './useCartStore'


// const BASE_URL = 'https://a-ecommerce.anscom-dev.com/authenticate'
const BASE_URL = 'http://localhost:5001/authenticate'

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const res = await axios.post(`${BASE_URL}/login`, { email, password })
      const { token, refreshToken, username, roles, email: userEmail } = res.data
      set({
        user: { username, email: userEmail, roles },
        token,
        refreshToken,
        isAuthenticated: true,
        loading: false,
      })
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
        useCartStore.getState().fetchCart();

    } catch (err) {
      set({
        error: err.response?.data?.message || 'Login failed',
        loading: false,
      })
    }
  },

  signup: async (signUpData) => {
    set({ loading: true, error: null })
    try {
      const res = await axios.post(`${BASE_URL}/signup`, signUpData)
      set({ loading: false })
      return res.data
    } catch (err) {
      set({ error: err.response?.data?.message || 'Signup failed', loading: false })
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    })
  },

  forgotPassword: async (email) => {
    try {
      const res = await axios.post(`${BASE_URL}/forgot-password`, { email })
      return res.data
    } catch (err) {
      return { error: err.response?.data?.message || 'Failed to send reset link' }
    }
  },

  resetPassword: async (token, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/reset-password`, { token, password })
      return res.data
    } catch (err) {
      return { error: err.response?.data?.message || 'Failed to reset password' }
    }
  },

  refreshAccessToken: async (refreshToken) => {
    try {
      const res = await axios.post(`${BASE_URL}/refreshtoken`, { refreshToken })
      set({ token: res.data.token })
    } catch (err) {
      set({ isAuthenticated: false, token: null })
    }
  },

  setAuthFromToken: (token) => {
  const decoded = jwtDecode(token)
  const user = {
    username: decoded.sub,
    email: decoded.email,
    roles: decoded.roles || [],
  }
  set({ user, token, isAuthenticated: true })
},

fetchUserProfile: async () => {
  try {
    const { token } = useAuthStore.getState();
    const res = await axios.get(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { username, email } = res.data;
    set((state) => ({
      user: {
        ...state.user,
        username,
        email,
      },
    }));
  } catch (err) {
    console.error("Failed to fetch user profile", err);
  }
},

  logout: async () => {
    try {
          const { token } = useAuthStore.getState();

      await axios.post(`${BASE_URL}/logout`, {}, {
       headers: {
        Authorization: `Bearer ${token}`,
      },
      
      })
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      
    });
        localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

        // ✅ Clear cart after logout
    useCartStore.getState().clearCart();
    } catch (err) {
      console.error("Logout failed", err);
    } 
  }

}))

// Immediately restore token from localStorage (outside the store definition)
const token = localStorage.getItem('token');

if (token) {
  const decoded = jwtDecode(token);

  const user = {
    username: decoded.sub,
    email: decoded.email,
    roles: decoded.iss || [],
  };
  useAuthStore.setState({
    token,
    refreshToken: localStorage.getItem('refreshToken'),
    user,
    isAuthenticated: true,
  });
}
