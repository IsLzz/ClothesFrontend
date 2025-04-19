<template>
  <div class="min-h-[calc(100vh-4rem)] flex flex-col">
    <div class="flex-1 container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">我的租赁车</h1>

      <!-- 购物车为空时的显示 -->
      <div v-if="!cartStore.items.length" class="flex flex-col items-center justify-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-32 h-32 mb-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
        <p class="text-gray-500 mb-4">租赁车还是空的哦</p>
        <button class="btn btn-primary" @click="router.push('/')">
          去挑选服装
        </button>
      </div>

      <!-- 购物车列表 -->
      <div v-else class="space-y-6">
        <!-- 商品列表 -->
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <div v-for="item in cartStore.items" :key="item.id" class="flex items-start gap-4 py-4 border-b last:border-b-0">
              <!-- 商品图片 -->
              <img :src="item.image" :alt="item.name" class="w-24 h-24 object-cover rounded-lg" />
              
              <!-- 商品信息 -->
              <div class="flex-1">
                <h3 class="font-bold">{{ item.name }}</h3>
                <p class="text-sm text-gray-600">尺码: {{ item.size }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <span class="text-primary">¥{{ item.price }}/天</span>
                  <span class="text-xs text-gray-500">(押金: ¥{{ item.deposit }})</span>
                </div>
              </div>

              <!-- 租赁天数 -->
              <div class="flex items-center gap-2">
                <button 
                  class="btn btn-square btn-sm" 
                  :disabled="item.days <= 1"
                  @click="updateDays(item.id, item.days - 1)"
                >
                  -
                </button>
                <span class="w-12 text-center">{{ item.days }}天</span>
                <button 
                  class="btn btn-square btn-sm"
                  :disabled="item.days >= 30"
                  @click="updateDays(item.id, item.days + 1)"
                >
                  +
                </button>
              </div>

              <!-- 小计 -->
              <div class="text-right min-w-[120px]">
                <div class="font-bold text-primary">
                  ¥{{ (item.price * item.days + item.deposit).toFixed(2) }}
                </div>
                <button 
                  class="btn btn-ghost btn-xs mt-2"
                  @click="removeItem(item.id)"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 结算区域 -->
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <div class="flex justify-between items-center">
              <div>
                <span class="text-gray-600">共 {{ cartStore.totalItems }} 件商品，合计：</span>
                <span class="text-xl font-bold text-primary ml-2">¥{{ cartStore.totalAmount.toFixed(2) }}</span>
                <span class="text-sm text-gray-500 ml-2">(含总押金: ¥{{ cartStore.totalDeposit.toFixed(2) }})</span>
              </div>
              <button 
                class="btn btn-primary"
                :disabled="!cartStore.items.length || processing"
                @click="createOrder"
              >
                <span v-if="processing" class="loading loading-spinner loading-xs"></span>
                {{ processing ? '处理中...' : '去结算' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import orderService from '@/api/services/orderService'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const processing = ref(false)

// 更新租赁天数
const updateDays = (id: number, days: number) => {
  cartStore.updateDays(id, days)
  cartStore.saveCart()
}

// 删除商品
const removeItem = (id: number) => {
  cartStore.removeItem(id)
  cartStore.saveCart()
}

// 创建订单
const createOrder = async () => {
  // 检查用户是否登录
  if (!userStore.isLoggedIn || !userStore.userInfo?.id) {
    router.push('/login')
    return
  }
  
  processing.value = true
  
  try {
    // 构建订单参数，与后端OrderCreateRequest结构一致
    const orderParams = {
      userId: userStore.userInfo.id,
      orderItems: cartStore.items.map(item => ({
        clothesId: item.clothesId,
        quantity: 1,
        startDate: getNearestStartDate(), // 明天
        endDate: getEndDate(item.days)    // 明天 + 租赁天数
      }))
    }
    
    console.log('创建订单参数:', orderParams)
    
    // 调用创建订单API
    const response = await orderService.createOrder(orderParams)
    
    // 清空购物车
    cartStore.clearCart()
    
    // 跳转到支付页面
    router.push(`/payment/${response.id}`)
  } catch (error: any) {
    console.error('创建订单失败:', error)
    alert(error.message || '创建订单失败，请稍后重试')
  } finally {
    processing.value = false
  }
}

// 获取最近的开始日期（明天）
const getNearestStartDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return formatDate(date)
}

// 获取结束日期
const getEndDate = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + 1 + days) // 从明天开始算，再加上租赁天数
  return formatDate(date)
}

// 格式化日期为YYYY-MM-DD
const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

.btn {
  transition: all 0.3s ease;
}
</style> 