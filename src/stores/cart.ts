import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 购物车项接口
export interface CartItem {
  id: number
  clothesId: number
  name: string
  image: string
  size: string
  price: number
  deposit: number
  days: number
}

export const useCartStore = defineStore('cart', () => {
  // 购物车商品列表
  const items = ref<CartItem[]>([])
  
  // 计算购物车中的商品总数
  const totalItems = computed(() => items.value.length)
  
  // 计算租金总额
  const totalRent = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.price * item.days), 0)
  })
  
  // 计算押金总额
  const totalDeposit = computed(() => {
    return items.value.reduce((sum, item) => sum + item.deposit, 0)
  })
  
  // 计算总金额（租金 + 押金）
  const totalAmount = computed(() => {
    return totalRent.value + totalDeposit.value
  })
  
  // 添加商品到购物车
  const addItem = (item: CartItem) => {
    // 检查是否已经存在相同商品
    const existingItem = items.value.find(i => i.id === item.id)
    
    if (existingItem) {
      // 已存在则更新数量或租赁天数
      existingItem.days = item.days
    } else {
      // 不存在则添加新商品
      items.value.push(item)
    }
  }
  
  // 从购物车移除商品
  const removeItem = (id: number) => {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }
  
  // 更新商品租赁天数
  const updateDays = (id: number, days: number) => {
    const item = items.value.find(item => item.id === id)
    if (item) {
      item.days = Math.max(1, Math.min(30, days)) // 限制在1-30天范围内
    }
  }
  
  // 清空购物车
  const clearCart = () => {
    items.value = []
  }
  
  // 从本地存储初始化购物车
  const initCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        items.value = JSON.parse(savedCart)
      } catch (e) {
        console.error('解析购物车数据失败:', e)
        localStorage.removeItem('cart')
      }
    }
  }
  
  // 将购物车数据保存到本地存储
  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }
  
  // 初始化购物车
  initCart()
  
  return {
    items,
    totalItems,
    totalRent,
    totalDeposit,
    totalAmount,
    addItem,
    removeItem,
    updateDays,
    clearCart,
    saveCart
  }
}, {
  persist: true // 使用Pinia持久化插件自动保存状态
}) 