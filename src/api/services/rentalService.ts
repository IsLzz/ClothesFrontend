import request from '../request'

// 租赁记录接口
export interface Rental {
  id: number
  orderItemId: number
  userId: number
  clothesId: number
  startDate: string
  endDate: string
  returned: boolean
  returnDate: string | null
  lateFee: number | null
  rentalDays: number
}

// 租赁API服务
const rentalService = {
  // 获取用户的所有租赁记录
  async getUserRentals(userId: number): Promise<Rental[]> {
    try {
      const response = await request.get(`/rentals/user/${userId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 获取租赁记录详情
  async getRentalById(rentalId: number): Promise<Rental> {
    try {
      const response = await request.get(`/rentals/${rentalId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 获取所有未归还的租赁记录（管理员权限）
  async getNotReturnedRentals(): Promise<Rental[]> {
    try {
      const response = await request.get('/rentals/not-returned')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 归还服装（管理员权限）
  async returnClothes(rentalId: number, returnDate: string, lateFee?: number): Promise<boolean> {
    try {
      const params: any = { returnDate }
      if (lateFee !== undefined) {
        params.lateFee = lateFee
      }

      const response = await request.put(`/rentals/${rentalId}/return`, null, {
        params
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 延长租赁时间
  async extendRental(rentalId: number, endDate: string): Promise<Rental> {
    try {
      const response = await request.put(`/rentals/${rentalId}/extend`, null, {
        params: { endDate }
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default rentalService 