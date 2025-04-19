import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as userApi from '@/api/user'
import type { ApiResponse } from '@/types'

// 定义用户相关接口
interface User {
  id: number
  account: string
  nickname: string
  email?: string
  phone?: string
  avatar?: string
  gender: number
  roles: string
  lastLoginTime?: string
  lastLoginIp?: string
  createTime: string
}

interface LoginResponse {
  token: string
  tokenType: string
  expiresIn: number
  user: User
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('')
  const isLoading = ref<boolean>(false)
  const isLoggedIn = ref<boolean>(false)
  const userInfo = ref<User | null>(null)
  const errorMessage = ref<string>('')
  
  // 登录方法
  const login = async (account: string, password: string) => {
    isLoading.value = true
    errorMessage.value = ''
    

    
    try {
      const response = await userApi.login({
        account,
        password
      })
      
      // axios响应经过request.ts拦截器处理后已经是ApiResponse格式
      if (response.code === 2001) {
      
        const { token: accessToken, user } = response.data
        
        
        // 保存登录状态
        token.value = accessToken
        userInfo.value = user
        isLoggedIn.value = true
        
        // 保存token到本地存储
        
        // 保存用户信息到本地存储，方便路由守卫使用

        
        // 检查用户角色
        let userRole = 'user';
        if (user && user.roles) {
          userRole = user.roles.includes('ADMIN') ? 'admin' : 'user';

        }

        return true
      } else {


      }
    } catch (error: any) {
     
      const errorMsg = error.response?.data?.message || error.message || '登录失败，请稍后再试'
      errorMessage.value = errorMsg
      throw new Error(errorMsg)
    } finally {
      isLoading.value = false
    }
  }
  
  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!token.value) {
      token.value = localStorage.getItem('token') || ''
      if (!token.value) return null
    }
    
    isLoading.value = true
    
    try {
      const response = await userApi.getUserInfo()
      
      if (response.code === 200) {
        userInfo.value = response.data
        isLoggedIn.value = true
        return userInfo.value
      } else {
        throw new Error(response.message || '获取用户信息失败')
      }
    } catch (error: any) {
      errorMessage.value = error.response?.data?.message || error.message || '获取用户信息失败'
      
      // 如果获取失败（例如token过期），清除登录状态
      if (error.response?.status === 401) {
        logout()
      }
      throw error
    } finally {
      isLoading.value = false
    }
  }
  
  // 登出方法
  const logout = async () => {
    isLoading.value = true
    
    try {
      if (token.value) {
        // 调用后端登出接口
        await userApi.logout()
      }
    } catch (error) {
      console.error('登出时发生错误:', error)
    } finally {
      // 无论后端请求是否成功，都清除本地状态
      token.value = ''
      userInfo.value = null
      isLoggedIn.value = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      isLoading.value = false
    }
  }
  
  // 检查登录状态
  const checkLoginStatus = async () => {
    const savedToken = localStorage.getItem('token')
    
    if (savedToken) {
      token.value = savedToken
      try {
        await fetchUserInfo()
        return true
      } catch (error) {
        return false
      }
    }
    
    return false
  }
  
  // 初始化函数，从本地存储恢复状态
  const initializeFromStorage = () => {
    try {
      // 尝试从本地存储获取token
      const storedToken = localStorage.getItem('token')
      
      // 尝试从本地存储获取用户信息
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedToken !== 'undefined' && storedToken !== 'null') {
        token.value = storedToken
        isLoggedIn.value = true
      }
      
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        try {
          const userData = JSON.parse(storedUser)
          userInfo.value = userData.user || null
        } catch (error) {
          console.error('解析存储的用户数据失败:', error)
          // 清除可能损坏的数据
          localStorage.removeItem('user')
        }
      }
    } catch (error) {
      console.error('初始化用户状态失败:', error)
    }
  }

  // 调用初始化函数
  initializeFromStorage()

  return {
    token,
    isLoading,
    isLoggedIn,
    userInfo,
    errorMessage,
    login,
    logout,
    fetchUserInfo,
    checkLoginStatus
  }
}, {
  persist: true
}) 