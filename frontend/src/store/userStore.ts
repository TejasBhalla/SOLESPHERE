import { create } from 'zustand'
import axios from 'axios'

export const useUserStore = create((set) => ({
    user: null,
    products: [],
    cart: [],
    isLoading:false,
    signup: async (name, email, password) => {
        const res = await axios.post('http://localhost:5000//api/auth/signup', { name, email, password })
        set({ user: res.data.user })
    },
    login: async (email, password) => {
        const res = await axios.post('http://localhost:5000//api/auth/login', { email, password })
        set({ user: res.data.user })
    },

    logout: async () => {
        await axios.post('http://localhost:5000//api/auth/logout')
        set({ user: null })
    },
    getprofile: async () => {
        const res = await axios.get('http://localhost:5000/api/auth/profile')
        set({ user: res.data.user })
    },

    addproduct: async (newProduct) => {
        const res = await axios.post('http://localhost:5000/api/product/', newProduct)
        set((state) => ({ products: [...state.products, res.data.product] }))
    },

    getproducts : async () => {
        const res = await axios.get('http://localhost:5000/api/product/')
        set((state)=> ({products:res.data.data}))
    },

    fetchCategoryProducts: async (category) => {
        set({ isLoading: true,products: []});
        const res = await axios.get(`http://localhost:5000/api/product/category/${category}`);
        set({products:res.data.products,isLoading: false})
    }


}))