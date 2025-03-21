import { defineStore } from 'pinia'
import type { User } from '@/types'
import request from '@/api/request'

interface UserState {
  user: User | null
  token: string | null
}

interface LoginResponse {
  token: string
  user: User
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
        const { data } = await request.post<LoginResponse>('/auth/login', { email, password })
        this.token = data.token
        this.user = data.user
        localStorage.setItem('token', data.token)
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
        const { data } = await request.get<User>('/user/profile')
        this.user = data
        return true
      } catch (error) {
        console.error('Failed to fetch user info:', error)
        return false
      }
    },

    setUser(user: User) {
      this.user = user
      return true
    }
  },
  
  persist: true
}) 