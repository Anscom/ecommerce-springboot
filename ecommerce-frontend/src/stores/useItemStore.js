// src/store/useItemStore.js
import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './useAuthStore'  // import your auth store

const BASE_URL = 'http://localhost:5001/item'

export const useItemStore = create((set, get) => ({
  items: [],
  item: null,
  images: [],
  loading: false,
  error: null,

  fetchAllItems: async () => {
    set({ loading: true, error: null })
    try {
      const res = await axios.get(`${BASE_URL}/allItems`)
      set({ items: res.data, loading: false })
    } catch (err) {
      set({ error: 'Failed to fetch items', loading: false })
    }
  },

  fetchItemById: async (id) => {
    set({ loading: true, error: null })
    try {
      const res = await axios.get(`${BASE_URL}/${id}`)
      set({ item: res.data, loading: false })
      return res.data; // ✅ return the item
    } catch (err) {
      set({ error: 'Failed to fetch item', loading: false })
    }
  },

getItemImageIds: async (itemId) => {
  set({ loading: true, error: null })
  try {
    const res = await axios.get(`${BASE_URL}/${itemId}/imageAmount`)
    set({ images: res.data, loading: false })
    return res.data // return here
  } catch (err) {
    set({ error: 'Failed to fetch item images', loading: false })
    return null
  }
},

  createItem: async (itemData, imageFiles) => {
    const token = useAuthStore.getState().token
    set({ loading: true, error: null })
    try {
      const formData = new FormData()
      formData.append('body', new Blob([JSON.stringify(itemData)], { type: 'application/json' }))
      Array.from(imageFiles).forEach(file => formData.append('files', file))

      const res = await axios.post(`${BASE_URL}/createItem`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })

      get().fetchAllItems()

      return res.data
    } catch (err) {
      set({ error: 'Failed to create item', loading: false })
    }
  },

  updateItem: async (itemId, itemData, imageFiles) => {
    const token = useAuthStore.getState().token
    set({ loading: true, error: null })
    try {
      const formData = new FormData()
      Object.entries(itemData).forEach(([key, value]) => formData.append(key, value))
      if (imageFiles) {
        Array.from(imageFiles).forEach(file => formData.append('files', file))
      }

      const res = await axios.put(`${BASE_URL}/updateItem/${itemId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      get().fetchAllItems()
      return res.data
    } catch (err) {
      set({ error: 'Failed to update item', loading: false })
    }
  },

  deleteItem: async (itemId) => {
    const token = useAuthStore.getState().token
    set({ loading: true, error: null })
    try {
      await axios.delete(`${BASE_URL}/deleteItem/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      get().fetchAllItems()
    } catch (err) {
      set({ error: 'Failed to delete item', loading: false })
    }
  },

fetchPaginatedItems: async () => {
  set({ loading: true, error: null })
  try {
    const response = await axios.get(`${BASE_URL}/`)
    set({ items: response.data.content, loading: false }) // ✅ Only use content
  } catch (error) {
    set({ error: 'Failed to fetch paginated items', loading: false })
    console.error('Failed to fetch paginated items:', error)
  }
},

}))

export const getItemImage = (imageId) => `${BASE_URL}/image/${imageId}`;