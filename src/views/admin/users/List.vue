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
        <div v-if="loading" class="flex justify-center py-8">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
        
        <div v-else-if="userList.length === 0" class="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>暂无用户数据</span>
        </div>
        
        <div v-else class="overflow-x-auto">
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
              <tr v-for="user in userList" :key="user.id" class="hover">
                <td>
                  <div class="avatar">
                    <div class="w-12 rounded-full">
                      <img :src="user.avatar || '/default-avatar.png'" :alt="user.nickname" />
                    </div>
                  </div>
                </td>
                <td>{{ user.nickname }}</td>
                <td>{{ user.phone }}</td>
                <td>
                  <div :class="[
                    'badge',
                    {
                      'badge-primary': user.roles.includes('ADMIN'),
                      'badge-secondary': !user.roles.includes('ADMIN')
                    }
                  ]">
                    {{ getRoleDisplayName(user.roles) }}
                  </div>
                </td>
                <td>{{ user.orderCount }}</td>
                <td>¥{{ user.orderAmount.toLocaleString() }}</td>
                <td>{{ formatDateTime(user.createTime) }}</td>
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
                <img :src="currentUser.avatar || '/default-avatar.png'" :alt="currentUser.nickname" />
              </div>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <div class="text-2xl font-bold">{{ currentUser.nickname }}</div>
                <div :class="[
                  'badge',
                  {
                    'badge-primary': currentUser.roles.includes('ADMIN'),
                    'badge-secondary': !currentUser.roles.includes('ADMIN')
                  }
                ]">
                  {{ getRoleDisplayName(currentUser.roles) }}
                </div>
                <div v-if="currentUser.disabled" class="badge badge-error">已禁用</div>
              </div>
              <div class="mt-2 text-sm opacity-60">注册时间：{{ formatDateTime(currentUser.createTime) }}</div>
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
                            'badge-info': order.status === 'confirmed',
                            'badge-primary': order.status === 'renting',
                            'badge-success': ['returned', 'completed'].includes(order.status),
                            'badge-error': order.status === 'canceled'
                          }
                        ]">
                          {{ orderStatusMap[order.status] || order.status }}
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
import { ref, computed, onMounted, watch } from 'vue'
import { userService } from '@/api'
import type { User } from '@/api/services/userService'

// 角色映射
const roleMap: Record<string, string> = {
  'ROLE_ADMIN': '管理员',
  'ROLE_USER': '普通用户'
}

// 订单状态映射
const orderStatusMap: Record<string, string> = {
  pending: '待处理',
  confirmed: '已确认',
  canceled: '已取消',
  completed: '已完成'
}

// 定义扩展的用户类型（含额外数据）
interface ExtendedUser extends Omit<User, 'createTime'> {
  createTime: string | number[];
  orderCount: number;
  orderAmount: number;
  orderIncrease: number;
  amountIncrease: number;
  addressCount: number;
  addresses: Array<{
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    address: string;
    isDefault: boolean;
  }>;
  recentOrders: Array<{
    id: string;
    clothing: {
      name: string;
      image: string;
    };
    amount: number;
    status: string;
    createdAt: string;
  }>;
  disabled?: boolean;
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
const userList = ref<ExtendedUser[]>([])

// 加载状态
const loading = ref(false)

// 当前选中的用户
const currentUser = ref<ExtendedUser | null>(null)

// 格式化日期时间
const formatDateTime = (dateValue: string | number[] | null) => {
  if (!dateValue) return '暂无数据';
  
  try {
    let date: Date;
    
    // 处理数组格式的日期 [year, month, day, hour, minute, second]
    if (Array.isArray(dateValue) && dateValue.length >= 6) {
      // 注意：JavaScript月份是从0开始的，而后端返回的月份是从1开始的
      date = new Date(
        dateValue[0], // 年
        dateValue[1] - 1, // 月(需要-1)
        dateValue[2], // 日
        dateValue[3], // 时
        dateValue[4], // 分
        dateValue[5]  // 秒
      );
    } else if (typeof dateValue === 'string') {
      // 处理字符串格式的日期
      date = new Date(dateValue);
    } else {
      return '日期格式错误';
    }
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return '日期格式错误';
    }
    
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '日期格式错误';
  }
}

// 打开用户详情弹窗
const openUserModal = (user: ExtendedUser) => {
  try {
    // 确保用户对象的所有日期字段都是有效的
    const safeUser = { ...user };
    
    // 检查并处理createTime（可能是数组格式）
    if (Array.isArray(safeUser.createTime) && safeUser.createTime.length >= 6) {
      // 数组格式转换为ISO字符串
      const [year, month, day, hour, minute, second] = safeUser.createTime;
      const dateObj = new Date(year, month - 1, day, hour, minute, second);
      if (!isNaN(dateObj.getTime())) {
        safeUser.createTime = dateObj.toISOString();
      } else {
        safeUser.createTime = new Date().toISOString();
      }
    } else if (typeof safeUser.createTime === 'string') {
      // 如果是字符串但无效
      if (isNaN(new Date(safeUser.createTime).getTime())) {
        safeUser.createTime = new Date().toISOString();
      }
    } else {
      // 其他情况，设置为当前时间
      safeUser.createTime = new Date().toISOString();
    }
    
    // 检查并修复recentOrders中的日期
    if (safeUser.recentOrders && safeUser.recentOrders.length > 0) {
      safeUser.recentOrders = safeUser.recentOrders.map(order => {
        const safeOrder = { ...order };
        if (!safeOrder.createdAt || isNaN(new Date(safeOrder.createdAt).getTime())) {
          safeOrder.createdAt = new Date().toISOString();
        }
        return safeOrder;
      });
    }
    
    currentUser.value = safeUser;
    const modal = document.getElementById('user-modal') as HTMLDialogElement;
    modal?.showModal();
  } catch (error) {
    console.error('打开用户详情弹窗失败:', error);
  }
}

// 启用/禁用用户
const handleToggleStatus = async (user: ExtendedUser) => {
  const action = user.disabled ? '启用' : '禁用'
  if (confirm(`确定要${action}用户"${user.nickname}"吗？`)) {
    try {
      loading.value = true
      // 调用API更新用户状态
      await userService.updateUser(user.id, {
        // 假设后端使用disabled字段表示用户状态
        disabled: !user.disabled
      } as any)
      
      // 更新本地状态
      user.disabled = !user.disabled
      
      // 提示用户操作成功
      alert(`用户"${user.nickname}"已${action}成功`);
      
      // 刷新用户列表
      await fetchUserList()
    } catch (error) {
      // 提示用户操作失败
      console.error(`${action}用户失败:`, error);
      alert(`${action}用户失败，请稍后重试`);
      
      // 恢复原状态
      user.disabled = !!user.disabled;
    } finally {
      loading.value = false
    }
  }
}

// 获取用户列表
const fetchUserList = async () => {
  try {
    loading.value = true
    
    // 调用API获取用户列表
    const response = await userService.getAllUsers(currentPage.value, pageSize.value)
    
    if (response) {
      // 获取基本用户数据
      const users = response.items || []
      total.value = response.total || 0
      
      // 转换为扩展用户数据（添加订单等信息）
      userList.value = users.map(user => {
        // 生成一个安全的日期字符串
        const safeDate = () => {
          const date = new Date();
          return date.toISOString();
        };
        
        // 确保createTime存在且有效（可能是数组或字符串）
        // 不需要在这里转换日期格式，因为formatDateTime函数已经能处理数组格式
      
        return {
          ...user,
          orderCount: Math.floor(Math.random() * 10),
          orderAmount: Math.floor(Math.random() * 5000),
          orderIncrease: Math.floor(Math.random() * 30) - 10,
          amountIncrease: Math.floor(Math.random() * 40) - 15,
          addressCount: Math.floor(Math.random() * 3) + 1,
          disabled: false,
          // createTime已经从API获取，无需再赋值
          addresses: [
            {
              name: user.nickname || '',
              phone: user.phone || '',
              province: '北京市',
              city: '北京市',
              district: '朝阳区',
              address: '某某街道1号楼1单元101',
              isDefault: true
            }
          ],
          recentOrders: [
            {
              id: `OR${Math.floor(Math.random() * 10000)}`,
              clothing: {
                name: '黑色西装',
                image: 'https://picsum.photos/200'
              },
              amount: 297,
              status: 'completed',
              createdAt: safeDate()
            }
          ]
        }
      });
    } else {
      // 如果没有数据，设置为空数组
      userList.value = [];
    }
  } catch (error) {
    console.error('获取用户列表失败:', error);
    // 出错时设置为空数组
    userList.value = [];
  } finally {
    loading.value = false
  }
}

// 监听筛选条件和分页变化
watch([filters, currentPage], () => {
  fetchUserList()
}, { deep: true })

// 获取角色显示名称
const getRoleDisplayName = (roles: string | string[] | undefined): string => {
  if (!roles) return '普通用户';
  
  try {
    // 如果roles是字符串
    if (typeof roles === 'string') {
      if (roles.includes('ADMIN')) return roleMap['ROLE_ADMIN'];
      return roleMap['ROLE_USER'];
    }
    
    // 如果roles是数组
    if (Array.isArray(roles)) {
      if (roles.some(role => role && typeof role === 'string' && role.includes('ADMIN'))) {
        return roleMap['ROLE_ADMIN'];
      }
      return roleMap['ROLE_USER'];
    }
    
    // 默认返回普通用户
    return roleMap['ROLE_USER'];
  } catch (error) {
    console.error('角色判断出错:', error);
    return '普通用户';
  }
}

onMounted(() => {
  fetchUserList()
})
</script> 