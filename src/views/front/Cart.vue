<template>
  <div class="min-h-[calc(100vh-4rem)] flex flex-col">
    <div class="flex-1">
      <h1 class="text-2xl font-bold mb-6">我的租赁车</h1>

      <!-- 购物车为空时的显示 -->
      <div v-if="!cartItems.length" class="flex flex-col items-center justify-center py-12">
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
            <div v-for="item in cartItems" :key="item.id" class="flex items-start gap-4 py-4 border-b last:border-b-0">
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
                <span class="text-gray-600">共 {{ totalItems }} 件商品，合计：</span>
                <span class="text-xl font-bold text-primary ml-2">¥{{ totalAmount.toFixed(2) }}</span>
                <span class="text-sm text-gray-500 ml-2">(含总押金: ¥{{ totalDeposit.toFixed(2) }})</span>
              </div>
              <button 
                class="btn btn-primary"
                :disabled="!cartItems.length"
                @click="checkout"
              >
                去结算
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface CartItem {
  id: number
  name: string
  image: string
  size: string
  price: number
  deposit: number
  days: number
}

// 模拟购物车数据
const cartItems = ref<CartItem[]>([
  {
    id: 1,
    name: '黑色真丝晚礼服',
    image: '/images/dress1.jpg',
    size: 'M',
    price: 199,
    deposit: 1800,
    days: 3
  },
  {
    id: 2,
    name: '白色婚纱礼服',
    image: '/images/dress2.jpg',
    size: 'S',
    price: 299,
    deposit: 2700,
    days: 2
  }
])

// 计算总商品数
const totalItems = computed(() => cartItems.value.length)

// 计算总押金
const totalDeposit = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.deposit, 0)
})

// 计算总金额（租金 + 押金）
const totalAmount = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    return sum + (item.price * item.days + item.deposit)
  }, 0)
})

// 更新租赁天数
const updateDays = (id: number, days: number) => {
  const item = cartItems.value.find(item => item.id === id)
  if (item) {
    item.days = Math.max(1, Math.min(30, days))
  }
}

// 删除商品
const removeItem = (id: number) => {
  const index = cartItems.value.findIndex(item => item.id === id)
  if (index !== -1) {
    cartItems.value.splice(index, 1)
  }
}

// 去结算
const checkout = () => {
  router.push('/checkout')
}
</script> 