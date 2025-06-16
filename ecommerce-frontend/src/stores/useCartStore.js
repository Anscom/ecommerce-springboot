// src/stores/useCartStore.js
import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './useAuthStore'

const BASE_URL = 'http://localhost:8080/cart'

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  error: null,

  // Fetch the authenticated user's cart
  fetchCart: async () => {
    set({ loading: true, error: null })
    try {
      const { token } = useAuthStore.getState()
      const res = await axios.get(`${BASE_URL}/mycart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      set({ cart: res.data, loading: false })
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch cart',
        loading: false,
      })
    }
  },

  // Add item to cart
  addItemToCart: async (itemId, quantity) => {
    set({ loading: true, error: null })
    try {
      const { token } = useAuthStore.getState()
      const res = await axios.post(
        `${BASE_URL}/add`,
        null, // body is null, using query params
        {
          params: { itemId, quantity },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      set({ cart: res.data, loading: false })
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to add item',
        loading: false,
      })
    }
  },

  // Remove item from cart
  removeItemFromCart: async (itemId) => {
    set({ loading: true, error: null })
    try {
      const { token } = useAuthStore.getState()
      const res = await axios.delete(`${BASE_URL}/remove`, {
        params: { itemId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      set({ cart: res.data, loading: false })
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to remove item',
        loading: false,
      })
    }
  },

// Clear the cart (client + server)
clearCart: async () => {
  set({ loading: true, error: null });
  try {
    const { token } = useAuthStore.getState();
    await axios.delete(`${BASE_URL}/clearCart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Optionally, refetch the empty cart or just set to empty
    set({ cart: null, loading: false });
  } catch (err) {
    set({
      error: err.response?.data?.message || 'Failed to clear cart',
      loading: false,
    });
  }
}

}))
