<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">仪表盘</h1>
    
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-title text-base-content/60 font-medium">总订单数</div>
          <div class="stat-value text-primary">{{ stats.totalOrders }}</div>
          <div class="stat-desc text-base-content/40">较上月 <span :class="stats.orderIncrease > 0 ? 'text-success' : 'text-error'">{{ stats.orderIncrease > 0 ? '+' : '' }}{{ stats.orderIncrease }}%</span></div>
          <div class="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-title text-base-content/60 font-medium">总用户数</div>
          <div class="stat-value text-secondary">{{ stats.totalUsers }}</div>
          <div class="stat-desc text-base-content/40">较上月 <span :class="stats.userIncrease > 0 ? 'text-success' : 'text-error'">{{ stats.userIncrease > 0 ? '+' : '' }}{{ stats.userIncrease }}%</span></div>
          <div class="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-title text-base-content/60 font-medium">总收入</div>
          <div class="stat-value text-accent">¥{{ stats.totalRevenue.toLocaleString() }}</div>
          <div class="stat-desc text-base-content/40">较上月 <span :class="stats.revenueIncrease > 0 ? 'text-success' : 'text-error'">{{ stats.revenueIncrease > 0 ? '+' : '' }}{{ stats.revenueIncrease }}%</span></div>
          <div class="stat-figure text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-title text-base-content/60 font-medium">服装数量</div>
          <div class="stat-value text-info">{{ stats.totalClothing }}</div>
          <div class="stat-desc text-base-content/40"><span class="text-success">{{ stats.availableClothing }}</span> 件可租</div>
          <div class="stat-figure text-info">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 最近订单 -->
    <div class="card bg-base-100 shadow-xl mb-8">
      <div class="card-body">
        <h2 class="card-title mb-4">最近订单</h2>
        
        <div v-if="loading.orders" class="flex justify-center py-8">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
        
        <div v-else-if="recentOrders.length === 0" class="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>暂无订单数据</span>
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>订单号</th>
                <th>用户</th>
                <th>金额</th>
                <th>状态</th>
                <th>支付状态</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id" class="hover">
                <td>{{ order.id }}</td>
                <td>{{ order.username }}</td>
                <td>¥{{ order.amount.toLocaleString() }}</td>
                <td>
                  <div :class="[
                    'badge',
                    {
                      'badge-warning': order.status === 'pending',
                      'badge-info': order.status === 'confirmed',
                      'badge-success': order.status === 'completed',
                      'badge-error': order.status === 'canceled'
                    }
                  ]">
                    {{ orderStatusMap[order.status] || order.status }}
                  </div>
                </td>
                <td>
                  <div :class="[
                    'badge',
                    {
                      'badge-warning': order.paymentStatus === 'unpaid',
                      'badge-success': order.paymentStatus === 'paid',
                      'badge-error': order.paymentStatus === 'refunded'
                    }
                  ]">
                    {{ paymentStatusMap[order.paymentStatus] || order.paymentStatus }}
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
          <div class="chart-container">
            <v-chart class="chart" :option="revenueChartOption" autoresize />
          </div>
        </div>
      </div>
      
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-4">热门服装</h2>
          <div class="chart-container">
            <v-chart class="chart" :option="clothingChartOption" autoresize />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { getClothes, getOrders, getUsers } from '@/api'
import type { Clothing, Order, OrderStatus, User } from '@/types'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'

// 注册必要的组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
])

// 订单状态映射
const orderStatusMap: Record<string, string> = {
  pending: '待处理',
  confirmed: '已确认',
  canceled: '已取消',
  completed: '已完成'
}

// 支付状态映射
const paymentStatusMap: Record<string, string> = {
  unpaid: '未支付',
  paid: '已支付',
  refunded: '已退款'
}

// 数据加载状态
const loading = ref({
  stats: true,
  orders: true,
  charts: true
})

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
const recentOrders = ref<any[]>([])

// 获取统计数据
const fetchStats = async () => {
  loading.value.stats = true

  try {
    // 获取服装数据
    const clothesRes = await getClothes(1, 100)
    if (clothesRes && clothesRes.data) {
      const clothingList = Array.isArray(clothesRes.data) ? clothesRes.data : []
      stats.value.totalClothing = clothingList.length
      stats.value.availableClothing = clothingList.filter(item => item.available && item.stock > 0).length

      // 获取订单数据
      const ordersRes = await getOrders(1, 100)
      if (ordersRes && ordersRes.data && 'items' in ordersRes.data && Array.isArray(ordersRes.data.items)) {
        const orderList = ordersRes.data.items
        stats.value.totalOrders = ordersRes.data.total || orderList.length
        stats.value.orderIncrease = 5 // 模拟增长率

        // 计算总收入
        let totalRevenue = 0
        orderList.forEach(order => {
          if (order.status !== 'canceled') {
            totalRevenue += order.totalAmount
          }
        })
        stats.value.totalRevenue = totalRevenue
        stats.value.revenueIncrease = 12 // 模拟增长率

        // 获取用户数据
        const usersRes = await getUsers(1, 100)
        if (usersRes && usersRes.data && 'items' in usersRes.data && Array.isArray(usersRes.data.items)) {
          stats.value.totalUsers = usersRes.data.total || usersRes.data.items.length
          stats.value.userIncrease = 8 // 模拟增长率

          // 最近订单
          recentOrders.value = orderList
            .slice(0, 5)
            .map(order => {
              // 查找订单对应的用户
              const user = usersRes.data.items.find(user => user.id === order.userId)
              return {
                id: order.id,
                username: user ? user.nickname : `用户ID: ${order.userId}`,
                amount: order.totalAmount,
                status: order.status,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt
              }
            })

          // 更新图表数据
          updateChartData(orderList, clothingList)
        }
      }
    }
  } catch (error) {
    // 获取统计数据失败
  } finally {
    loading.value.stats = false
    loading.value.orders = false
  }
}

// 月份名称
const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

// 更新图表数据
const updateChartData = (orders: Order[], clothes: Clothing[]) => {
  loading.value.charts = true

  try {
    // 收入趋势图数据
    const revenueByMonth = new Array(12).fill(0)
    
    orders.forEach(order => {
      if (order.status !== 'canceled' && order.paymentStatus === 'paid') {
        // 从订单创建日期中提取月份
        const month = new Date(order.createdAt).getMonth()
        revenueByMonth[month] += order.totalAmount
      }
    })
    
    // 更新收入趋势图
    if (revenueChartOption.value && revenueChartOption.value.series && Array.isArray(revenueChartOption.value.series)) {
      revenueChartOption.value.series[0].data = revenueByMonth
    }
    
    // 热门服装图数据
    // 统计每个服装的订单数量
    const clothingOrderCount = new Map<number, number>()
    const clothingNameMap = new Map<number, string>()
    
    // 创建服装ID到名称的映射和初始计数
    clothes.forEach(clothing => {
      clothingNameMap.set(clothing.id, clothing.name)
      clothingOrderCount.set(clothing.id, 0)
    })
    
    // 统计订单中每个服装的出现次数
    orders.forEach(order => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach(item => {
          const currentCount = clothingOrderCount.get(item.clothesId) || 0
          clothingOrderCount.set(item.clothesId, currentCount + item.quantity)
        })
      }
    })
    
    // 排序并取前5名
    const topClothing = Array.from(clothingOrderCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    
    // 更新热门服装图
    if (clothingChartOption.value && clothingChartOption.value.yAxis) {
      clothingChartOption.value.yAxis.data = topClothing.map(([id]) => clothingNameMap.get(id) || `服装ID: ${id}`)
    }
    if (clothingChartOption.value && clothingChartOption.value.series && Array.isArray(clothingChartOption.value.series)) {
      clothingChartOption.value.series[0].data = topClothing.map(([, count]) => count)
    }
  } catch (error) {
    // 更新图表数据失败
  } finally {
    loading.value.charts = false
  }
}

// 收入趋势图配置
const revenueChartOption = ref<EChartsOption>({
  tooltip: {
    trigger: 'axis',
    formatter: '{b}: ¥{c}'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: months
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '¥{value}'
    }
  },
  series: [
    {
      name: '月收入',
      type: 'line',
      smooth: true,
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      areaStyle: {
        opacity: 0.3,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#6366f1' // 渐变开始颜色
            },
            {
              offset: 1,
              color: 'rgba(99, 102, 241, 0.1)' // 渐变结束颜色
            }
          ]
        }
      },
      itemStyle: {
        color: '#6366f1'
      },
      lineStyle: {
        width: 3,
        color: '#6366f1'
      }
    }
  ]
})

// 热门服装图配置
const clothingChartOption = ref<EChartsOption>({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}次'
    }
  },
  yAxis: {
    type: 'category',
    data: ['正在加载...']
  },
  series: [
    {
      name: '租赁次数',
      type: 'bar',
      data: [0],
      itemStyle: {
        color: function(params: any) {
          const colorList = [
            '#6366f1',  // 紫色
            '#ec4899',  // 粉色
            '#ef4444',  // 红色
            '#3b82f6',  // 蓝色
            '#8b5cf6'   // 紫罗兰
          ]
          return colorList[params.dataIndex % colorList.length]
        },
        borderRadius: [0, 4, 4, 0]
      }
    }
  ]
})

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 页面初始化
onMounted(async () => {
  await fetchStats()
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 320px;
  position: relative;
}

.chart {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style> 