<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">用户管理</h1>

    <!-- 筛选器 -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">用户名</span>
            </label>
            <input type="text" v-model="filters.username" placeholder="搜索用户名" class="input input-bordered" />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">手机号</span>
            </label>
            <input type="text" v-model="filters.phone" placeholder="搜索手机号" class="input input-bordered" />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">角色</span>
            </label>
            <select v-model="filters.role" class="select select-bordered">
              <option value="">全部角色</option>
              <option value="user">普通用户</option>
              <option value="admin">管理员</option>
            </select>
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">排序</span>
            </label>
            <select v-model="filters.sort" class="select select-bordered">
              <option value="createdAt_desc">最新注册</option>
              <option value="createdAt_asc">最早注册</option>
              <option value="orderCount_desc">订单数从高到低</option>
              <option value="orderAmount_desc">消费额从高到低</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>头像</th>
                <th>用户名</th>
                <th>手机号</th>
                <th>角色</th>
                <th>订单数</th>
                <th>消费总额</th>
                <th>注册时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in userList" :key="user.id">
                <td>
                  <div class="avatar">
                    <div class="w-12 rounded-full">
                      <img :src="user.avatar || '/default-avatar.png'" :alt="user.username" />
                    </div>
                  </div>
                </td>
                <td>{{ user.username }}</td>
                <td>{{ user.phone }}</td>
                <td>
                  <div :class="[
                    'badge',
                    {
                      'badge-primary': user.role === 'admin',
                      'badge-secondary': user.role === 'user'
                    }
                  ]">
                    {{ roleMap[user.role] }}
                  </div>
                </td>
                <td>{{ user.orderCount }}</td>
                <td>¥{{ user.orderAmount.toLocaleString() }}</td>
                <td>{{ formatDateTime(user.createdAt) }}</td>
                <td>
                  <div class="flex gap-2">
                    <button class="btn btn-sm btn-info" @click="openUserModal(user)">详情</button>
                    <button 
                      class="btn btn-sm"
                      :class="user.disabled ? 'btn-success' : 'btn-error'"
                      @click="handleToggleStatus(user)"
                    >
                      {{ user.disabled ? '启用' : '禁用' }}
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

    <!-- 用户详情弹窗 -->
    <dialog id="user-modal" class="modal">
      <div class="modal-box w-11/12 max-w-5xl">
        <h3 class="font-bold text-lg mb-4">用户详情</h3>
        
        <div v-if="currentUser">
          <!-- 基本信息 -->
          <div class="flex gap-6 mb-6">
            <div class="avatar">
              <div class="w-24 rounded-full">
                <img :src="currentUser.avatar || '/default-avatar.png'" :alt="currentUser.username" />
              </div>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <div class="text-2xl font-bold">{{ currentUser.username }}</div>
                <div :class="[
                  'badge',
                  {
                    'badge-primary': currentUser.role === 'admin',
                    'badge-secondary': currentUser.role === 'user'
                  }
                ]">
                  {{ roleMap[currentUser.role] }}
                </div>
                <div v-if="currentUser.disabled" class="badge badge-error">已禁用</div>
              </div>
              <div class="mt-2 text-sm opacity-60">注册时间：{{ formatDateTime(currentUser.createdAt) }}</div>
              <div class="mt-1 text-sm opacity-60">手机号：{{ currentUser.phone }}</div>
              <div class="mt-1 text-sm opacity-60">邮箱：{{ currentUser.email }}</div>
            </div>
          </div>

          <!-- 统计信息 -->
          <div class="stats shadow w-full mb-6">
            <div class="stat">
              <div class="stat-title">订单总数</div>
              <div class="stat-value">{{ currentUser.orderCount }}</div>
              <div class="stat-desc">较上月 {{ currentUser.orderIncrease > 0 ? '+' : '' }}{{ currentUser.orderIncrease }}%</div>
            </div>
            
            <div class="stat">
              <div class="stat-title">消费总额</div>
              <div class="stat-value">¥{{ currentUser.orderAmount.toLocaleString() }}</div>
              <div class="stat-desc">较上月 {{ currentUser.amountIncrease > 0 ? '+' : '' }}{{ currentUser.amountIncrease }}%</div>
            </div>
            
            <div class="stat">
              <div class="stat-title">收货地址</div>
              <div class="stat-value">{{ currentUser.addressCount }}</div>
            </div>
          </div>

          <!-- 收货地址 -->
          <div class="card bg-base-200 mb-6">
            <div class="card-body">
              <h4 class="card-title text-base mb-4">收货地址</h4>
              <div class="space-y-4">
                <div v-for="(address, index) in currentUser.addresses" :key="index" class="p-4 bg-base-100 rounded-box">
                  <div class="flex items-start justify-between">
                    <div>
                      <div class="font-bold">{{ address.name }} {{ address.phone }}</div>
                      <div class="mt-1">{{ address.province }}{{ address.city }}{{ address.district }}{{ address.address }}</div>
                    </div>
                    <div :class="['badge', address.isDefault ? 'badge-primary' : 'badge-ghost']">
                      {{ address.isDefault ? '默认地址' : '普通地址' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 最近订单 -->
          <div class="card bg-base-200">
            <div class="card-body">
              <h4 class="card-title text-base mb-4">最近订单</h4>
              <div class="overflow-x-auto">
                <table class="table">
                  <thead>
                    <tr>
                      <th>订单号</th>
                      <th>服装</th>
                      <th>金额</th>
                      <th>状态</th>
                      <th>时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="order in currentUser.recentOrders" :key="order.id">
                      <td>{{ order.id }}</td>
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
                      <td>¥{{ order.amount }}</td>
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
                          {{ orderStatusMap[order.status] }}
                        </div>
                      </td>
                      <td>{{ formatDateTime(order.createdAt) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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

// 角色映射
const roleMap = {
  admin: '管理员',
  user: '普通用户'
}

// 订单状态映射
const orderStatusMap = {
  pending: '待付款',
  paid: '已付款',
  renting: '租用中',
  returned: '已归还',
  completed: '已完成',
  cancelled: '已取消'
}

// 筛选条件
const filters = ref({
  username: '',
  phone: '',
  role: '',
  sort: 'createdAt_desc'
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 用户列表
const userList = ref([
  {
    id: 1,
    username: '张三',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    role: 'user',
    orderCount: 5,
    orderAmount: 1495,
    avatar: 'https://picsum.photos/200',
    createdAt: '2024-02-01T10:00:00Z',
    disabled: false,
    orderIncrease: 20,
    amountIncrease: 15.5,
    addressCount: 2,
    addresses: [
      {
        name: '张三',
        phone: '13800138000',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        address: '某某街道1号楼1单元101',
        isDefault: true
      },
      {
        name: '张三',
        phone: '13800138000',
        province: '上海市',
        city: '上海市',
        district: '浦东新区',
        address: '某某路2号',
        isDefault: false
      }
    ],
    recentOrders: [
      {
        id: 'OR2024030001',
        clothing: {
          name: '黑色西装',
          image: 'https://picsum.photos/200'
        },
        amount: 297,
        status: 'completed',
        createdAt: '2024-03-01T10:00:00Z'
      }
    ]
  },
  {
    id: 2,
    username: '李四',
    phone: '13900139000',
    email: 'lisi@example.com',
    role: 'admin',
    orderCount: 8,
    orderAmount: 2392,
    avatar: 'https://picsum.photos/200',
    createdAt: '2024-01-15T14:30:00Z',
    disabled: false,
    orderIncrease: -5,
    amountIncrease: -2.3,
    addressCount: 1,
    addresses: [
      {
        name: '李四',
        phone: '13900139000',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        address: '某某大厦3号楼',
        isDefault: true
      }
    ],
    recentOrders: [
      {
        id: 'OR2024030002',
        clothing: {
          name: '白色连衣裙',
          image: 'https://picsum.photos/200'
        },
        amount: 207,
        status: 'renting',
        createdAt: '2024-03-01T09:30:00Z'
      }
    ]
  }
])

// 当前查看的用户
const currentUser = ref(null)

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

// 打开用户详情弹窗
const openUserModal = (user: any) => {
  currentUser.value = user
  const modal = document.getElementById('user-modal') as HTMLDialogElement
  modal?.showModal()
}

// 启用/禁用用户
const handleToggleStatus = async (user: any) => {
  const action = user.disabled ? '启用' : '禁用'
  if (confirm(`确定要${action}用户"${user.username}"吗？`)) {
    try {
      // TODO: 调用API更新用户状态
      console.log(`${action}用户:`, user)
      await fetchUserList()
    } catch (error) {
      console.error(`${action}用户失败:`, error)
    }
  }
}

// 获取用户列表
const fetchUserList = async () => {
  try {
    // TODO: 从API获取用户列表
    total.value = 89 // 示例数据
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

onMounted(() => {
  fetchUserList()
})
</script> 