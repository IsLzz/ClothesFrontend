<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">仪表盘</h1>
    
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-title text-base-content/60">总订单数</div>
          <div class="stat-value text-primary">{{ stats.totalOrders }}</div>
          <div class="stat-desc text-base-content/40">较上月 <span :class="stats.orderIncrease > 0 ? 'text-success' : 'text-error'">{{ stats.orderIncrease > 0 ? '+' : '' }}{{ stats.orderIncrease }}%</span></div>
        </div>
      </div>
      
      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-title text-base-content/60">总用户数</div>
          <div class="stat-value text-secondary">{{ stats.totalUsers }}</div>
          <div class="stat-desc text-base-content/40">较上月 <span :class="stats.userIncrease > 0 ? 'text-success' : 'text-error'">{{ stats.userIncrease > 0 ? '+' : '' }}{{ stats.userIncrease }}%</span></div>
        </div>
      </div>
      
      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-title text-base-content/60">总收入</div>
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
import { ref, onMounted, nextTick } from 'vue'
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
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
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
      data: [3000, 4500, 5200, 4800, 6000, 7200, 8500],
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
    data: ['黑色西装', '白色婚纱', '红色旗袍', '蓝色礼服', '灰色西裤']
  },
  series: [
    {
      name: '租赁次数',
      type: 'bar',
      data: [120, 98, 85, 70, 65],
      itemStyle: {
        color: function(params: any) {
          const colorList = [
            '#6366f1',  // 紫色
            '#ec4899',  // 粉色
            '#ef4444',  // 红色
            '#3b82f6',  // 蓝色
            '#8b5cf6'   // 紫罗兰
          ]
          return colorList[params.dataIndex]
        },
        borderRadius: [0, 4, 4, 0]
      },
      barWidth: '60%',
      label: {
        show: true,
        position: 'right',
        formatter: '{c}次'
      }
    }
  ]
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

// 初始化图表
const initCharts = async () => {
  await nextTick()
  // 触发图表重新渲染
  window.dispatchEvent(new Event('resize'))
}

onMounted(() => {
  fetchStats()
  fetchRecentOrders()
  initCharts()
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