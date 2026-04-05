import { create } from 'zustand'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
})

const getErrorMessage = (error) => {
  if (axios.isAxiosError && axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Request failed'
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}

export const useUserStore = create((set) => ({
  user: null,
  products: [],
  featuredProducts: [],
  recommendedProducts: [],
  selectedProduct: null,
  cart: [],
  orders: [],
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post('/auth/signup', { name, email, password })
      set({ user: res.data.user, isLoading: false })
      return { success: true, data: res.data.user }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post('/auth/login', { email, password })
      set({ user: res.data.user, isLoading: false })
      return { success: true, data: res.data.user }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null })
    try {
      await api.post('/auth/logout')
      set({ user: null, cart: [], isLoading: false })
      return { success: true }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  refreshToken: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post('/auth/refreshToken')
      set({ isLoading: false })
      return { success: true, data: res.data }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  getprofile: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get('/auth/profile')
      set({ user: res.data.user, isLoading: false })
      return { success: true, data: res.data.user }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  addproduct: async (newProduct) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post('/product', newProduct)
      set((state) => ({
        products: [...state.products, res.data.product],
        isLoading: false,
      }))
      return { success: true, data: res.data.product }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  getproducts: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get('/product')
      const data = res.data?.data || []
      set({ products: data, isLoading: false })
      return { success: true, data }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  fetchCategoryProducts: async (category) => {
    set({ isLoading: true, products: [], error: null })
    try {
      const res = await api.get(`/product/category/${category}`)
      const data = res.data?.products || []
      set({ products: data, isLoading: false })
      return { success: true, data }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  getProductById: async (productId) => {
    set({ isLoading: true, selectedProduct: null, error: null })
    try {
      const res = await api.get(`/product/${productId}`)
      const data = res.data?.product || null
      set({ selectedProduct: data, isLoading: false })
      return { success: true, data }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  getFeaturedProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get('/product/featured')
      const data = Array.isArray(res.data) ? res.data : res.data?.data || []
      set({ featuredProducts: data, isLoading: false })
      return { success: true, data }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  getRecommendedProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get('/product/recommendations')
      const data = res.data?.products || []
      set({ recommendedProducts: data, isLoading: false })
      return { success: true, data }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.patch(`/product/${productId}`)
      const updatedProduct = res.data?.data
      if (updatedProduct?._id) {
        set((state) => ({
          products: state.products.map((item) => (item._id === updatedProduct._id ? updatedProduct : item)),
          featuredProducts: state.featuredProducts.map((item) => (item._id === updatedProduct._id ? updatedProduct : item)),
          isLoading: false,
        }))
      } else {
        set({ isLoading: false })
      }
      return { success: true, data: updatedProduct }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  deleteproduct: async (productId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post(`/product/${productId}`)
      set((state) => ({
        products: state.products.filter((item) => item._id !== productId),
        featuredProducts: state.featuredProducts.filter((item) => item._id !== productId),
        isLoading: false,
      }))
      return { success: true, data: res.data?.data }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  getcart: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get('/cart')
      const data = res.data?.items || []
      set({ cart: data, isLoading: false })
      return { success: true, data }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  addtocart: async (productId) => {
    set({ error: null })
    try {
      await api.post('/cart', { productId })
      const cartRes = await api.get('/cart')
      const data = cartRes.data?.items || []
      set({ cart: data })
      return { success: true, data }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ error: message })
      return { success: false, message }
    }
  },

  removefromcart: async (productId) => {
    set({ error: null })
    try {
      await api.delete('/cart', { data: { productId } })
      const cartRes = await api.get('/cart')
      const data = cartRes.data?.items || []
      set({ cart: data })
      return { success: true, data }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ error: message })
      return { success: false, message }
    }
  },

  changeproductquantity: async (productId, action) => {
    set({ error: null })
    try {
      await api.patch('/cart', { productId, action })
      const cartRes = await api.get('/cart')
      const data = cartRes.data?.items || []
      set({ cart: data })
      return { success: true, data }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ error: message })
      return { success: false, message }
    }
  },

  getallorders: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get('/order')
      const data = Array.isArray(res.data) ? res.data : []
      set({ orders: data, isLoading: false })
      return { success: true, data }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  createordersession: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get('/order')
      const data = Array.isArray(res.data) ? res.data : res.data
      if (Array.isArray(data)) {
        set({ orders: data, isLoading: false })
      } else {
        set({ isLoading: false })
      }
      return { success: true, data }
    } catch (error) {
      const message = getErrorMessage(error)
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },
}))
