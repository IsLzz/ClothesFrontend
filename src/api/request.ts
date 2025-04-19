import type {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from 'axios'
import axios from 'axios'
import type {ApiResponse} from '../types'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const userDataString = localStorage.getItem('user')
      if (userDataString && userDataString !== 'undefined' && userDataString !== 'null') {
        const userData = JSON.parse(userDataString)
        if (userData && userData.token && config.headers) {
          config.headers.Authorization = userData.token;
        }
      } else {
        // 尝试从token直接获取
        const token = localStorage.getItem('token');
        if (token && token !== 'undefined' && token !== 'null' && config.headers) {
          config.headers.Authorization = token;
        }
      }
    } catch (error) {
      // 出错时尝试直接使用token
      const token = localStorage.getItem('token');
      if (token && token !== 'undefined' && token !== 'null' && config.headers) {
        config.headers.Authorization = token;
      }
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回响应数据而不是整个响应对象
    return response.data
  },
  (error: AxiosError) => {
    // 处理HTTP错误
    if (error.response?.status === 401) {
      // 处理未授权
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default request 