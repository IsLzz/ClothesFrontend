<template>
  <div class="min-h-[calc(100vh-4rem)] flex flex-col">
    <div class="flex-1 container mx-auto px-4 py-8">
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
            <div class="mt-4">
              <div v-for="(item, index) in order.orderItems" :key="index" class="flex gap-4 mb-3 border-b pb-3 last:border-0">
                <div class="w-24 h-24 rounded-lg overflow-hidden">
                  <img
                    :src="item.clothes?.imageUrl || 'https://via.placeholder.com/80'"
                    :alt="item.clothes?.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 class="font-bold">{{ item.clothes?.name || '商品名称' }}</h4>
                  <p class="text-sm text-gray-600">尺码: {{ item.clothes?.size || '-' }}</p>
                  <p class="text-sm text-gray-600">
                    租期: {{ formatDate(item.startDate || item.rentalRecord?.startDate).split(' ')[0] }} 至 
                    {{ formatDate(item.endDate || item.rentalRecord?.endDate).split(' ')[0] }}
                  </p>
                  <p class="text-sm text-gray-600">
                    单价: ¥{{ item.pricePerDay }}/天 × {{ item.days || item.rentalRecord?.rentalDays || 1 }}天
                  </p>
                  <p class="text-sm text-primary font-semibold">小计: ¥{{ item.subtotal }}</p>
                </div>
              </div>
            </div>
            
            <!-- 订单金额 -->
            <div class="flex justify-between items-center mt-4 pt-4 border-t">
              <div>
                <span class="text-lg">总计: <span class="text-primary font-bold">¥{{ order.totalAmount }}</span></span>
                <span class="text-sm text-gray-500 ml-2">(含押金: ¥{{ order.deposit || calculateDeposit(order) }})</span>
              </div>
              
              <!-- 订单操作 -->
              <div class="space-x-2">
                <button
                  v-if="order.status === 'pending' || order.paymentStatus === 'unpaid'"
                  class="btn btn-primary btn-sm"
                  @click="payOrder(order.id)"
                >
                  去支付
                </button>
                <button
                  v-if="order.status === 'renting' || order.status === 'confirmed'"
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
      
      <!-- 分页控件 -->
      <div v-if="totalPages > 1" class="flex justify-center my-8">
        <div class="join">
          <button 
            class="join-item btn" 
            :class="{'btn-disabled': currentPage === 1}"
            @click="changePage(currentPage - 1)"
          >
            «
          </button>
          <button class="join-item btn">{{ currentPage }} / {{ totalPages }}</button>
          <button 
            class="join-item btn" 
            :class="{'btn-disabled': currentPage === totalPages}"
            @click="changePage(currentPage + 1)"
          >
            »
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import orderService from "@/api/services/orderService"
import type { ApiResponse } from '@/types'

// 扩展OrderItem类型以适应API返回的数据结构
interface ExtendedOrderItem {
  id: number
  orderId: number
  clothesId: number
  quantity: number
  pricePerDay: number
  days?: number
  startDate?: string | number[]
  endDate?: string | number[]
  subtotal: number
  clothes?: {
    id: number
    name: string
    description?: string
    size?: string
    imageUrl?: string
    [key: string]: any
  }
  rentalRecord?: {
    id?: number
    startDate?: string | number[]
    endDate?: string | number[]
    rentalDays?: number
    [key: string]: any
  }
}

// 扩展Order类型以适应API返回的数据结构
interface ExtendedOrder {
  id: number | string
  userId: number
  totalAmount: number
  status: string
  paymentStatus?: string
  deposit?: number
  createdAt: string | number[]
  updatedAt?: string | number[]
  orderItems: ExtendedOrderItem[]
  [key: string]: any
}

const router = useRouter()
const userStore = useUserStore()

// 订单状态选项
const orderStatuses = [
  { label: '全部', value: 'all' },
  { label: '待支付', value: 'pending' },
  { label: '租赁中', value: 'renting' },
  { label: '已归还', value: 'returned' },
  { label: '已取消', value: 'cancelled' }
] as const

// 状态映射
const statusLabels: Record<string, string> = {
  pending: '待支付',
  paid: '待发货',
  confirmed: '已确认',
  renting: '租赁中',
  returned: '已归还',
  completed: '已完成',
  cancelled: '已取消',
  canceled: '已取消'
}

const currentStatus = ref<'all' | string>('all')
const orders = ref<ExtendedOrder[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize.value) || 1
})

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

// 计算押金（如果API未提供）
const calculateDeposit = (order: ExtendedOrder) => {
  return Math.round(order.totalAmount * 0.5)
}

// 获取订单列表
const fetchOrders = async () => {
  if (!userStore.isLoggedIn || !userStore.userInfo) {
    router.push('/login')
    return
  }

  loading.value = true
  error.value = null
  
  try {
    // 调用真实API获取订单
    const response = await orderService.getUserOrders(
      userStore.userInfo.id, 
      currentPage.value, 
      pageSize.value
    ) as any

    if (response) {
      // 处理API返回数据
      const responseData = response.items || response
      total.value = response.total || responseData.length
      
      // 处理订单数据，确保所有必要字段都存在
      orders.value = responseData.map((order: any) => {
        return {
          ...order,
          // 确保后端API响应结构与前端期望的结构一致
          orderItems: Array.isArray(order.orderItems) ? order.orderItems.map((item: any) => ({
            ...item,
            // 处理可能的嵌套数据结构
            clothes: item.clothes || {},
            rentalRecord: item.rentalRecord || {
              startDate: item.startDate,
              endDate: item.endDate,
              rentalDays: item.days
            }
          })) : []
        }
      })
    } else {
      throw new Error('获取订单数据失败')
    }
  } catch (err: any) {
    console.error('获取订单列表失败:', err)
    error.value = err.message || '获取订单列表失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 切换页码
const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchOrders()
}

// 支付订单
const payOrder = (orderId: number | string) => {
  router.push(`/payment/${orderId}`)
}

// 申请归还
const returnClothing = async (orderId: number | string) => {
  try {
    loading.value = true
    // 这里应该调用真实的API
    // 例如 await orderService.returnClothing(orderId)
    
    // 临时更新本地状态
    const orderIndex = orders.value.findIndex(order => order.id === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'returned'
      // 添加更新时间
      orders.value[orderIndex].updatedAt = new Date().toISOString()
    }
    
    // 成功提示
    // TODO: 添加成功提示toast
  } catch (err: any) {
    console.error('申请归还失败:', err)
    error.value = err.message || '申请归还失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 查看订单详情
const viewOrderDetail = (orderId: number | string) => {
  router.push(`/orders/${orderId}`)
}

// 格式化日期
const formatDate = (dateString: string | number[] | undefined) => {
  if (!dateString) return '暂无数据'
  
  try {
    if (Array.isArray(dateString)) {
      // 处理数组格式的日期 [year, month, day, ...]
      const [year, month, day, hour, minute, second] = dateString
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${
        hour !== undefined ? `${String(hour).padStart(2, '0')}:${String(minute || 0).padStart(2, '0')}` : ''
      }`
    }
    
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    console.error('日期格式化错误:', e)
    return String(dateString)
  }
}

// 监听状态筛选变化
const handleStatusChange = () => {
  currentPage.value = 1 // 重置页码
  // 如果使用服务端筛选，则重新获取数据
  // fetchOrders()
}

// 组件挂载时获取订单列表
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

.badge {
  transition: all 0.3s ease;
}

.btn {
  transition: all 0.3s ease;
}
</style> 