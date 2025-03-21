<template>
  <div class="min-h-[calc(100vh-4rem)] flex flex-col">
    <div class="flex-1">
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
      
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center py-12">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
      
      <!-- 错误提示 -->
      <div v-else-if="error" class="alert alert-error shadow-lg mb-6">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{{ error }}</span>
        </div>
      </div>
      
      <!-- 订单列表 -->
      <div v-else class="space-y-6">
        <div v-if="!filteredOrders.length" class="text-center py-12 text-gray-500">
          暂无订单
        </div>
        
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div class="card-body">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-bold">订单号: {{ order.id }}</h3>
                <p class="text-sm text-gray-500">下单时间: {{ formatDate(order.createdAt) }}</p>
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
                  租期: {{ formatDate(order.startDate).split(' ')[0] }} 至 {{ formatDate(order.endDate).split(' ')[0] }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Order, OrderStatus } from '@/types'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 模拟订单数据
const mockOrders: Order[] = [
  {
    id: 1001,
    userId: 1,
    clothingId: 1,
    clothingName: '黑色真丝晚礼服',
    clothingImage: '/images/dress1.jpg',
    size: 'M',
    startDate: '2024-03-15',
    endDate: '2024-03-18',
    totalAmount: 2597, // 199/天 × 4天 + 1800押金
    deposit: 1800,
    status: 'pending',
    createdAt: '2024-03-14T10:30:00Z',
    updatedAt: '2024-03-14T10:30:00Z'
  },
  {
    id: 1002,
    userId: 1,
    clothingId: 2,
    clothingName: '白色婚纱礼服',
    clothingImage: '/images/dress2.jpg',
    size: 'S',
    startDate: '2024-03-10',
    endDate: '2024-03-12',
    totalAmount: 3598, // 299/天 × 3天 + 2700押金
    deposit: 2700,
    status: 'renting',
    createdAt: '2024-03-09T14:20:00Z',
    updatedAt: '2024-03-09T14:20:00Z'
  },
  {
    id: 1003,
    userId: 1,
    clothingId: 3,
    clothingName: '藏青色西装套装',
    clothingImage: '/images/suit1.jpg',
    size: 'L',
    startDate: '2024-03-01',
    endDate: '2024-03-03',
    totalAmount: 2397, // 149/天 × 3天 + 1950押金
    deposit: 1950,
    status: 'returned',
    createdAt: '2024-02-28T09:15:00Z',
    updatedAt: '2024-03-03T18:30:00Z'
  },
  {
    id: 1004,
    userId: 1,
    clothingId: 4,
    clothingName: '红色旗袍',
    clothingImage: '/images/qipao1.jpg',
    size: 'M',
    startDate: '2024-03-05',
    endDate: '2024-03-07',
    totalAmount: 2098, // 149/天 × 3天 + 1650押金
    deposit: 1650,
    status: 'cancelled',
    createdAt: '2024-03-04T16:40:00Z',
    updatedAt: '2024-03-04T17:20:00Z'
  },
  {
    id: 1005,
    userId: 1,
    clothingId: 5,
    clothingName: '粉色伴娘礼服',
    clothingImage: '/images/dress3.jpg',
    size: 'S',
    startDate: '2024-03-20',
    endDate: '2024-03-22',
    totalAmount: 2697, // 199/天 × 3天 + 2100押金
    deposit: 2100,
    status: 'paid',
    createdAt: '2024-03-15T11:25:00Z',
    updatedAt: '2024-03-15T11:40:00Z'
  }
]

// 订单状态选项
const orderStatuses = [
  { label: '全部', value: 'all' },
  { label: '待支付', value: 'pending' },
  { label: '租赁中', value: 'renting' },
  { label: '已归还', value: 'returned' },
  { label: '已取消', value: 'cancelled' }
] as const

// 状态映射
const statusLabels: Record<OrderStatus | string, string> = {
  pending: '待支付',
  paid: '待发货',
  renting: '租赁中',
  returned: '已归还',
  cancelled: '已取消'
}

const currentStatus = ref<'all' | OrderStatus>('all')
const orders = ref<Order[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// 根据状态筛选订单
const filteredOrders = computed(() => {
  if (currentStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === currentStatus.value)
})

// 获取状态显示文本
const getStatusLabel = (status: OrderStatus) => {
  return statusLabels[status] || status
}

// 获取订单列表
const fetchOrders = async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }

  loading.value = true
  error.value = null
  
  try {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 使用模拟数据
    orders.value = mockOrders
  } catch (err) {
    error.value = '获取订单列表失败，请稍后重试'
    console.error('获取订单列表失败:', err)
  } finally {
    loading.value = false
  }
}

// 支付订单
const payOrder = (orderId: number) => {
  router.push(`/payment/${orderId}`)
}

// 申请归还（模拟实现）
const returnClothing = async (orderId: number) => {
  try {
    loading.value = true
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新本地订单状态
    const orderIndex = orders.value.findIndex(order => order.id === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'returned'
      orders.value[orderIndex].updatedAt = new Date().toISOString()
    }
  } catch (err) {
    console.error('申请归还失败:', err)
    error.value = '申请归还失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 查看订单详情
const viewOrderDetail = (orderId: number) => {
  router.push(`/orders/${orderId}`)
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 组件挂载时获取订单列表
onMounted(() => {
  fetchOrders()
})
</script> 