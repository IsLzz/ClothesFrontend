<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">订单管理</h1>

    <!-- 筛选器 -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">订单号</span>
            </label>
            <input type="text" v-model="filters.orderId" placeholder="搜索订单号" class="input input-bordered" />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">用户</span>
            </label>
            <input type="text" v-model="filters.username" placeholder="搜索用户" class="input input-bordered" />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">状态</span>
            </label>
            <select v-model="filters.status" class="select select-bordered">
              <option value="">全部状态</option>
              <option value="pending">待付款</option>
              <option value="paid">已付款</option>
              <option value="renting">租用中</option>
              <option value="returned">已归还</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">排序</span>
            </label>
            <select v-model="filters.sort" class="select select-bordered">
              <option value="createdAt_desc">最新订单</option>
              <option value="createdAt_asc">最早订单</option>
              <option value="amount_desc">金额从高到低</option>
              <option value="amount_asc">金额从低到高</option>
            </select>
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">开始日期</span>
            </label>
            <input type="date" v-model="filters.startDate" class="input input-bordered" />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">结束日期</span>
            </label>
            <input type="date" v-model="filters.endDate" class="input input-bordered" />
          </div>
        </div>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>订单号</th>
                <th>用户</th>
                <th>服装</th>
                <th>租期</th>
                <th>金额</th>
                <th>押金</th>
                <th>状态</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orderList" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.username }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <div class="avatar">
                      <div class="w-12 rounded">
                        <img :src="order.clothing.image" :alt="order.clothing.name" />
                      </div>
                    </div>
                    <div>{{ order.clothing.name }}</div>
                  </div>
                </td>
                <td>
                  {{ formatDate(order.startDate) }} 至 {{ formatDate(order.endDate) }}
                  <div class="text-sm opacity-60">{{ order.days }}天</div>
                </td>
                <td>¥{{ order.amount }}</td>
                <td>¥{{ order.deposit }}</td>
                <td>
                  <div :class="[
                    'badge',
                    {
                      'badge-warning': order.status === 'pending',
                      'badge-info': order.status === 'paid',
                      'badge-primary': order.status === 'renting',
                      'badge-success': ['returned', 'completed'].includes(order.status),
                      'badge-error': order.status === 'cancelled'
                    }
                  ]">
                    {{ statusMap[order.status] }}
                  </div>
                </td>
                <td>{{ formatDateTime(order.createdAt) }}</td>
                <td>
                  <div class="flex gap-2">
                    <button 
                      class="btn btn-sm btn-info"
                      @click="openOrderModal(order)"
                    >
                      详情
                    </button>
                    <button 
                      v-if="order.status === 'pending'"
                      class="btn btn-sm btn-error"
                      @click="handleCancel(order)"
                    >
                      取消
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="flex justify-between items-center mt-4">
          <div>
            共 {{ total }} 条记录
          </div>
          <div class="join">
            <button 
              class="join-item btn"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >«</button>
            <button class="join-item btn">第 {{ currentPage }} 页</button>
            <button 
              class="join-item btn"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >»</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单详情弹窗 -->
    <dialog id="order-modal" class="modal">
      <div class="modal-box w-11/12 max-w-5xl">
        <h3 class="font-bold text-lg mb-4">订单详情</h3>
        
        <div v-if="currentOrder">
          <!-- 订单基本信息 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div class="text-sm opacity-60">订单号</div>
              <div>{{ currentOrder.id }}</div>
            </div>
            <div>
              <div class="text-sm opacity-60">创建时间</div>
              <div>{{ formatDateTime(currentOrder.createdAt) }}</div>
            </div>
            <div>
              <div class="text-sm opacity-60">状态</div>
              <div>
                <div :class="[
                  'badge',
                  {
                    'badge-warning': currentOrder.status === 'pending',
                    'badge-info': currentOrder.status === 'paid',
                    'badge-primary': currentOrder.status === 'renting',
                    'badge-success': ['returned', 'completed'].includes(currentOrder.status),
                    'badge-error': currentOrder.status === 'cancelled'
                  }
                ]">
                  {{ statusMap[currentOrder.status] }}
                </div>
              </div>
            </div>
            <div>
              <div class="text-sm opacity-60">支付时间</div>
              <div>{{ currentOrder.paidAt ? formatDateTime(currentOrder.paidAt) : '-' }}</div>
            </div>
          </div>

          <!-- 用户信息 -->
          <div class="card bg-base-200 mb-6">
            <div class="card-body">
              <h4 class="card-title text-base mb-4">用户信息</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div class="text-sm opacity-60">用户名</div>
                  <div>{{ currentOrder.username }}</div>
                </div>
                <div>
                  <div class="text-sm opacity-60">手机号</div>
                  <div>{{ currentOrder.phone }}</div>
                </div>
                <div class="md:col-span-2">
                  <div class="text-sm opacity-60">收货地址</div>
                  <div>{{ currentOrder.address }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 服装信息 -->
          <div class="card bg-base-200 mb-6">
            <div class="card-body">
              <h4 class="card-title text-base mb-4">服装信息</h4>
              <div class="flex gap-4">
                <div class="avatar">
                  <div class="w-24 rounded">
                    <img :src="currentOrder.clothing.image" :alt="currentOrder.clothing.name" />
                  </div>
                </div>
                <div class="flex-1">
                  <div class="font-bold">{{ currentOrder.clothing.name }}</div>
                  <div class="text-sm opacity-60 mt-1">{{ currentOrder.clothing.category }}</div>
                  <div class="mt-2">
                    <div class="text-sm opacity-60">租期</div>
                    <div>{{ formatDate(currentOrder.startDate) }} 至 {{ formatDate(currentOrder.endDate) }}（{{ currentOrder.days }}天）</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="opacity-60">租金</div>
                  <div class="font-bold">¥{{ currentOrder.amount }}</div>
                  <div class="opacity-60 mt-2">押金</div>
                  <div class="font-bold">¥{{ currentOrder.deposit }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作记录 -->
          <div class="card bg-base-200">
            <div class="card-body">
              <h4 class="card-title text-base mb-4">操作记录</h4>
              <ul class="timeline timeline-vertical">
                <li v-for="(log, index) in currentOrder.logs" :key="index">
                  <div class="timeline-start">{{ formatDateTime(log.createdAt) }}</div>
                  <div class="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="timeline-end timeline-box">{{ log.action }}</div>
                  <hr/>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="modal-action">
          <form method="dialog">
            <button class="btn">关闭</button>
          </form>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>关闭</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 状态映射
const statusMap = {
  pending: '待付款',
  paid: '已付款',
  renting: '租用中',
  returned: '已归还',
  completed: '已完成',
  cancelled: '已取消'
}

// 筛选条件
const filters = ref({
  orderId: '',
  username: '',
  status: '',
  sort: 'createdAt_desc',
  startDate: '',
  endDate: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 订单列表
const orderList = ref([
  {
    id: 'OR2024030001',
    username: '张三',
    phone: '13800138000',
    address: '北京市朝阳区某某街道1号楼1单元101',
    clothing: {
      name: '黑色西装',
      category: '西装',
      image: 'https://picsum.photos/200'
    },
    startDate: '2024-03-01',
    endDate: '2024-03-03',
    days: 3,
    amount: 297,
    deposit: 299,
    status: 'pending',
    createdAt: '2024-03-01T10:00:00Z',
    paidAt: null,
    logs: [
      {
        action: '创建订单',
        createdAt: '2024-03-01T10:00:00Z'
      }
    ]
  },
  {
    id: 'OR2024030002',
    username: '李四',
    phone: '13900139000',
    address: '上海市浦东新区某某路2号',
    clothing: {
      name: '白色连衣裙',
      category: '连衣裙',
      image: 'https://picsum.photos/200'
    },
    startDate: '2024-03-02',
    endDate: '2024-03-04',
    days: 3,
    amount: 207,
    deposit: 199,
    status: 'paid',
    createdAt: '2024-03-01T09:30:00Z',
    paidAt: '2024-03-01T09:35:00Z',
    logs: [
      {
        action: '创建订单',
        createdAt: '2024-03-01T09:30:00Z'
      },
      {
        action: '支付订单',
        createdAt: '2024-03-01T09:35:00Z'
      }
    ]
  }
])

// 当前查看的订单
const currentOrder = ref(null)

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 打开订单详情弹窗
const openOrderModal = (order: any) => {
  currentOrder.value = order
  const modal = document.getElementById('order-modal') as HTMLDialogElement
  modal?.showModal()
}

// 取消订单
const handleCancel = async (order: any) => {
  if (confirm(`确定要取消订单"${order.id}"吗？`)) {
    try {
      // TODO: 调用API取消订单
      console.log('取消订单:', order)
      await fetchOrderList()
    } catch (error) {
      console.error('取消订单失败:', error)
    }
  }
}

// 获取订单列表
const fetchOrderList = async () => {
  try {
    // TODO: 从API获取订单列表
    total.value = 156 // 示例数据
  } catch (error) {
    console.error('获取订单列表失败:', error)
  }
}

onMounted(() => {
  fetchOrderList()
})
</script> 