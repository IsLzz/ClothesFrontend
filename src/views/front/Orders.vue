<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">我的订单</h1>
    
    <!-- 订单状态筛选 -->
    <div class="tabs tabs-boxed mb-6">
      <a
        v-for="status in orderStatuses"
        :key="status.value"
        class="tab"
        :class="{ 'tab-active': currentStatus === status.value }"
        @click="currentStatus = status.value"
      >
        {{ status.label }}
      </a>
    </div>
    
    <!-- 订单列表 -->
    <div class="space-y-6">
      <div v-if="!orders.length" class="text-center py-12 text-gray-500">
        暂无订单
      </div>
      
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="card bg-base-100 shadow-lg"
      >
        <div class="card-body">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-bold">订单号: {{ order.id }}</h3>
              <p class="text-sm text-gray-500">下单时间: {{ order.createdAt }}</p>
            </div>
            <div class="badge badge-primary">{{ getStatusLabel(order.status) }}</div>
          </div>
          
          <!-- 商品信息 -->
          <div class="flex gap-4 mt-4">
            <img
              :src="order.clothingImage"
              :alt="order.clothingName"
              class="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <h4 class="font-bold">{{ order.clothingName }}</h4>
              <p class="text-sm text-gray-600">尺码: {{ order.size }}</p>
              <p class="text-sm text-gray-600">
                租期: {{ order.startDate }} 至 {{ order.endDate }}
              </p>
            </div>
          </div>
          
          <!-- 订单金额 -->
          <div class="flex justify-between items-center mt-4 pt-4 border-t">
            <div>
              <span class="text-lg">总计: <span class="text-primary font-bold">¥{{ order.totalAmount }}</span></span>
              <span class="text-sm text-gray-500 ml-2">(含押金: ¥{{ order.deposit }})</span>
            </div>
            
            <!-- 订单操作 -->
            <div class="space-x-2">
              <button
                v-if="order.status === 'pending'"
                class="btn btn-primary btn-sm"
                @click="payOrder(order.id)"
              >
                去支付
              </button>
              <button
                v-if="order.status === 'renting'"
                class="btn btn-outline btn-sm"
                @click="returnClothing(order.id)"
              >
                申请归还
              </button>
              <button
                class="btn btn-ghost btn-sm"
                @click="viewOrderDetail(order.id)"
              >
                查看详情
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
import type { Order } from '@/types'

const router = useRouter()

// 订单状态选项
const orderStatuses = [
  { label: '全部', value: 'all' },
  { label: '待支付', value: 'pending' },
  { label: '租赁中', value: 'renting' },
  { label: '已归还', value: 'returned' },
  { label: '已取消', value: 'cancelled' }
]

// 状态映射
const statusLabels: Record<string, string> = {
  pending: '待支付',
  paid: '待发货',
  renting: '租赁中',
  returned: '已归还',
  cancelled: '已取消'
}

const currentStatus = ref('all')
const orders = ref<Order[]>([])

// 根据状态筛选订单
const filteredOrders = computed(() => {
  if (currentStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === currentStatus.value)
})

// 获取状态显示文本
const getStatusLabel = (status: string) => {
  return statusLabels[status] || status
}

// 订单操作
const payOrder = (orderId: number) => {
  router.push(`/payment/${orderId}`)
}

const returnClothing = async (orderId: number) => {
  // 实现归还逻辑
}

const viewOrderDetail = (orderId: number) => {
  router.push(`/orders/${orderId}`)
}
</script> 