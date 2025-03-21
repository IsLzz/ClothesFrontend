<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">仪表盘</h1>
    
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-title">总订单数</div>
          <div class="stat-value">{{ stats.totalOrders }}</div>
          <div class="stat-desc">较上月 {{ stats.orderIncrease > 0 ? '+' : '' }}{{ stats.orderIncrease }}%</div>
        </div>
      </div>
      
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-title">总用户数</div>
          <div class="stat-value">{{ stats.totalUsers }}</div>
          <div class="stat-desc">较上月 {{ stats.userIncrease > 0 ? '+' : '' }}{{ stats.userIncrease }}%</div>
        </div>
      </div>
      
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-title">总收入</div>
          <div class="stat-value">¥{{ stats.totalRevenue.toLocaleString() }}</div>
          <div class="stat-desc">较上月 {{ stats.revenueIncrease > 0 ? '+' : '' }}{{ stats.revenueIncrease }}%</div>
        </div>
      </div>
      
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-title">服装数量</div>
          <div class="stat-value">{{ stats.totalClothing }}</div>
          <div class="stat-desc">{{ stats.availableClothing }} 件可租</div>
        </div>
      </div>
    </div>
    
    <!-- 最近订单 -->
    <div class="card bg-base-100 shadow-xl mb-8">
      <div class="card-body">
        <h2 class="card-title mb-4">最近订单</h2>
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>订单号</th>
                <th>用户</th>
                <th>金额</th>
                <th>状态</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.username }}</td>
                <td>¥{{ order.amount.toLocaleString() }}</td>
                <td>
                  <div :class="[
                    'badge',
                    {
                      'badge-warning': order.status === 'pending',
                      'badge-success': order.status === 'completed',
                      'badge-error': order.status === 'cancelled'
                    }
                  ]">
                    {{ orderStatusMap[order.status] }}
                  </div>
                </td>
                <td>{{ formatDate(order.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- 图表 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-4">收入趋势</h2>
          <!-- 这里可以添加收入趋势图表 -->
          <div class="h-80 flex items-center justify-center bg-base-200 rounded-box">
            图表占位符
          </div>
        </div>
      </div>
      
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-4">热门服装</h2>
          <!-- 这里可以添加热门服装图表 -->
          <div class="h-80 flex items-center justify-center bg-base-200 rounded-box">
            图表占位符
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 订单状态映射
const orderStatusMap = {
  pending: '待付款',
  paid: '已付款',
  renting: '租用中',
  returned: '已归还',
  completed: '已完成',
  cancelled: '已取消'
}

// 统计数据
const stats = ref({
  totalOrders: 0,
  orderIncrease: 0,
  totalUsers: 0,
  userIncrease: 0,
  totalRevenue: 0,
  revenueIncrease: 0,
  totalClothing: 0,
  availableClothing: 0
})

// 最近订单
const recentOrders = ref([
  {
    id: 'OR2024030001',
    username: '张三',
    amount: 299,
    status: 'pending',
    createdAt: '2024-03-01T10:00:00Z'
  },
  {
    id: 'OR2024030002',
    username: '李四',
    amount: 599,
    status: 'completed',
    createdAt: '2024-03-01T09:30:00Z'
  },
  {
    id: 'OR2024030003',
    username: '王五',
    amount: 399,
    status: 'cancelled',
    createdAt: '2024-03-01T09:00:00Z'
  }
])

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 获取统计数据
const fetchStats = async () => {
  try {
    // TODO: 从API获取统计数据
    stats.value = {
      totalOrders: 156,
      orderIncrease: 12.5,
      totalUsers: 89,
      userIncrease: 8.3,
      totalRevenue: 45680,
      revenueIncrease: 15.2,
      totalClothing: 234,
      availableClothing: 198
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 获取最近订单
const fetchRecentOrders = async () => {
  try {
    // TODO: 从API获取最近订单
  } catch (error) {
    console.error('获取最近订单失败:', error)
  }
}

onMounted(() => {
  fetchStats()
  fetchRecentOrders()
})
</script> 