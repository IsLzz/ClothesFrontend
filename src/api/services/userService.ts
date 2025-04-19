import request from '../request'

// 用户接口
export interface User {
  id: number
  account: string
  nickname: string
  email?: string
  phone?: string
  avatar?: string
  gender: number
  roles: string
  lastLoginTime?: string | null
  lastLoginIp?: string | null
  createTime: string | number[]
}

// 用户注册参数
export interface RegisterParams {
  account: string
  password: string
  nickname: string
  email?: string
  phone?: string
  avatar?: string
  gender?: number
}

// 用户更新参数
export interface UpdateUserParams {
  password?: string
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
  gender?: number
  disabled?: boolean
}

// 分页响应接口
export interface PaginatedResponse<T> {
  items: T[]
  total: number
}

// 用户API服务
const userService = {
  // 用户注册
  async register(userData: RegisterParams): Promise<User> {
    try {
      const response = await request.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 获取所有用户（分页，管理员权限）
  async getAllUsers(page = 1, pageSize = 10): Promise<PaginatedResponse<User>> {
    try {
      const response = await request.get('/users', {
        params: { page, pageSize }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 根据ID获取用户
  async getUserById(userId: number): Promise<User> {
    try {
      const response = await request.get(`/users/${userId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 更新用户信息
  async updateUser(userId: number, userData: UpdateUserParams): Promise<User> {
    try {
      const response = await request.put(`/users/${userId}`, userData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 删除用户（管理员权限）
  async deleteUser(userId: number): Promise<boolean> {
    try {
      const response = await request.delete(`/users/${userId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default userService 