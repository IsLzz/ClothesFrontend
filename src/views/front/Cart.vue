<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">我的租赁车</h1>
    
    <div class="grid grid-cols-1 gap-6">
      <!-- 空购物车提示 -->
      <div v-if="!cartItems.length" class="text-center py-12">
        <div class="text-gray-500 mb-4">租赁车还是空的哦</div>
        <router-link to="/" class="btn btn-primary">去挑选服装</router-link>
      </div>
      
      <!-- 购物车列表 -->
      <div v-else>
        <div v-for="item in cartItems" :key="item.id" class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <div class="flex gap-4">
              <!-- 商品图片 -->
              <img
                :src="item.images[0]"
                :alt="item.name"
                class="w-32 h-32 object-cover rounded-lg"
              />
              
              <!-- 商品信息 -->
              <div class="flex-1">
                <h3 class="text-lg font-bold">{{ item.name }}</h3>
                <p class="text-gray-600">{{ item.description }}</p>
                <div class="mt-2">
                  <span class="badge">尺码: {{ item.selectedSize }}</span>
                  <span class="badge ml-2">
                    租期: {{ item.startDate }} 至 {{ item.endDate }}
                  </span>
                </div>
              </div>
              
              <!-- 价格和操作 -->
              <div class="text-right">
                <div class="text-primary text-xl font-bold">
                  ¥{{ item.totalPrice }}
                </div>
                <button
                  class="btn btn-error btn-sm mt-2"
                  @click="removeFromCart(item.id)"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 总计 -->
        <div class="card bg-base-100 shadow-lg mt-6">
          <div class="card-body">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-lg">总计: <span class="text-primary font-bold">¥{{ totalAmount }}</span></div>
                <div class="text-sm text-gray-500">包含押金: ¥{{ totalDeposit }}</div>
              </div>
              <button class="btn btn-primary" @click="checkout">去结算</button>
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
import type { Clothing } from '@/types'

interface CartItem extends Clothing {
  selectedSize: string
  startDate: string
  endDate: string
  totalPrice: number
}

const router = useRouter()

// 模拟数据，实际应该从store中获取
const cartItems = ref<CartItem[]>([])

const totalAmount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.totalPrice, 0)
})

const totalDeposit = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.deposit, 0)
})

const removeFromCart = (id: number) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id)
}

const checkout = () => {
  router.push('/checkout')
}
</script> 