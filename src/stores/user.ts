import { defineStore } from 'pinia'
import type { User } from '@/types'
import request from '@/api/request'

interface UserState {
  user: User | null
  token: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    token: localStorage.getItem('token')
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    userInfo: (state) => state.user
  },
  
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await request.post('/auth/login', { email, password })
        this.token = response.token
        this.user = response.user
        localStorage.setItem('token', response.token)
        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },
    
    async logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },
    
    async fetchUserInfo() {
      try {
        const user = await request.get('/user/profile')
        this.user = user
        return true
      } catch (error) {
        console.error('Failed to fetch user info:', error)
        return false
      }
    }
  },
  
  persist: true
}) 