import request from '../request'

// 分类接口定义
export interface Category {
  id: number
  name: string
  description?: string
  icon?: string
  clothingCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface CategoryCreateParams {
  name: string
  description?: string
  icon?: string
}

export interface CategoryUpdateParams extends CategoryCreateParams {
  id: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
}

// 分类API服务
const categoryService = {
  // 获取所有分类
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await request.get('/categories')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 根据ID获取分类详情
  async getCategoryById(id: number): Promise<Category> {
    try {
      const response = await request.get(`/categories/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 创建分类（管理员权限）
  async createCategory(categoryData: CategoryCreateParams): Promise<Category> {
    try {
      const response = await request.post('/categories', categoryData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 更新分类（管理员权限）
  async updateCategory(id: number, categoryData: Partial<CategoryCreateParams>): Promise<Category> {
    try {
      const response = await request.put(`/categories/${id}`, categoryData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 删除分类（管理员权限）
  async deleteCategory(id: number): Promise<boolean> {
    try {
      const response = await request.delete(`/categories/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default categoryService 