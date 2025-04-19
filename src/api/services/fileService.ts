import request from '../request'

// 文件上传响应接口
export interface FileUploadResponse {
  filename: string
  size: number
  contentType: string
  url: string
}

// 文件API服务
const fileService = {
  // 上传图片
  async uploadImage(file: File): Promise<FileUploadResponse> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // 对于文件上传，需要特殊处理headers
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      
      const response = await request.post('/files/upload', formData, config)
      
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  // 获取文件URL路径
  getFileUrl(year: string, month: string, day: string, fileName: string): string {
    const baseURL = request.defaults.baseURL || ''
    return `${baseURL}/files/${year}/${month}/${day}/${fileName}`
  },
  
  // 从文件URL解析出相对路径
  parseFileUrl(url: string): string | null {
    if (!url) return null
    
    // 提取URL中的路径部分
    const match = url.match(/\/files\/(.+)$/)
    if (match && match[1]) {
      return match[1]
    }
    return null
  }
}

export default fileService 