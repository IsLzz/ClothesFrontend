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
import { ref, computed, onMounted, watch } from 'vue'
import { orderService } from '@/api'
import type { Order as ApiOrder, PaginatedResponse } from '@/api/services/orderService'

// 扩展订单接口，添加前端展示所需的字段
interface Order extends ApiOrder {
  username: string; // 用户名，从API的userName或直接映射
  clothing: {
    name: string;
    category: string;
    image: string;
  };
  startDate: string | number[];
  endDate: string | number[];
  days: number;
  amount: number; // 相当于totalAmount
}

// 状态映射
const statusMap: Record<string, string> = {
  pending: '待付款',
  paid: '已付款',
  renting: '租用中',
  returned: '已归还',
  completed: '已完成',
  cancelled: '已取消',
  canceled: '已取消',  // 后端可能使用美式拼写
  confirmed: '已确认'
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
const orderList = ref<Order[]>([])

// 加载状态
const loading = ref(false)

// 当前查看的订单
const currentOrder = ref<Order | null>(null)

// 格式化日期
const formatDate = (dateValue: string | number[] | null) => {
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
        dateValue[3] || 0, // 时
        dateValue[4] || 0, // 分
        dateValue[5] || 0  // 秒
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
      day: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '日期格式错误';
  }
}

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
        dateValue[3] || 0, // 时
        dateValue[4] || 0, // 分
        dateValue[5] || 0  // 秒
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

// 打开订单详情弹窗
const openOrderModal = (order: Order) => {
  try {
    // 确保订单对象的所有日期字段都是有效的
    const safeOrder = { ...order };
    
    // 处理各种日期字段，将数组格式转换为ISO字符串格式
    const processDateField = (dateValue: string | number[] | null): string | null => {
      if (!dateValue) return null;
      
      if (Array.isArray(dateValue) && dateValue.length >= 6) {
        const [year, month, day, hour = 0, minute = 0, second = 0] = dateValue;
        const dateObj = new Date(year, month - 1, day, hour, minute, second);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toISOString();
        }
      } else if (typeof dateValue === 'string' && !isNaN(new Date(dateValue).getTime())) {
        return dateValue;
      }
      
      return null;
    };
    
    // 处理订单中的各种日期
    if (Array.isArray(safeOrder.createdAt)) {
      safeOrder.createdAt = processDateField(safeOrder.createdAt) || new Date().toISOString();
    }
    
    if (safeOrder.paidAt) {
      safeOrder.paidAt = processDateField(safeOrder.paidAt);
    }
    
    if (Array.isArray(safeOrder.startDate)) {
      safeOrder.startDate = processDateField(safeOrder.startDate) || new Date().toISOString();
    }
    
    if (Array.isArray(safeOrder.endDate)) {
      safeOrder.endDate = processDateField(safeOrder.endDate) || new Date().toISOString();
    }
    
    // 处理日志中的日期
    if (safeOrder.logs && safeOrder.logs.length > 0) {
      safeOrder.logs = safeOrder.logs.map(log => {
        const safeLog = { ...log };
        if (Array.isArray(safeLog.createdAt)) {
          safeLog.createdAt = processDateField(safeLog.createdAt) || new Date().toISOString();
        }
        return safeLog;
      });
    }
    
    currentOrder.value = safeOrder;
    const modal = document.getElementById('order-modal') as HTMLDialogElement;
    modal?.showModal();
  } catch (error) {
    console.error('打开订单详情弹窗失败:', error);
  }
}

// 取消订单
const handleCancel = async (order: Order) => {
  if (confirm(`确定要取消订单"${order.id}"吗？`)) {
    try {
      loading.value = true;
      // 调用API取消订单
      const orderId = typeof order.id === 'string' ? parseInt(order.id) : order.id;
      await orderService.cancelOrder(orderId);
      
      // 提示用户操作成功
      alert(`订单"${order.id}"已取消成功`);
      
      // 刷新订单列表
      await fetchOrderList();
    } catch (error) {
      console.error('取消订单失败:', error);
      alert('取消订单失败，请稍后重试');
    } finally {
      loading.value = false;
    }
  }
}

// 转换API返回的订单数据为界面显示数据
const transformApiOrder = (apiOrder: ApiOrder): Order => {
  // 获取第一个订单项的信息（简化处理，实际可能需要处理多个订单项）
  const firstItem = apiOrder.orderItems[0] || {};
  
  // 计算订单的总天数
  const days = firstItem.days || 0;
  
  return {
    ...apiOrder,
    username: apiOrder.userName || '未知用户',
    clothing: {
      // OrderItem中不存在这些属性，使用默认值或从其他地方获取
      name: '服装商品', // 默认名称
      category: '服装分类', // 默认分类
      image: 'https://picsum.photos/200' // 默认图片
    },
    startDate: firstItem.startDate || apiOrder.createdAt,
    endDate: firstItem.endDate || apiOrder.createdAt,
    days,
    amount: apiOrder.totalAmount || 0,
    // 如果API没有返回这些字段，使用合理的默认值
    deposit: apiOrder.deposit || apiOrder.totalAmount * 0.5,  // 默认押金为总金额的50%
    logs: apiOrder.logs || [
      {
        action: '创建订单',
        createdAt: apiOrder.createdAt
      }
    ]
  };
};

// 获取订单列表
const fetchOrderList = async () => {
  try {
    loading.value = true;
    
    // 构建筛选参数
    const params: any = {
      page: currentPage.value,
      pageSize: pageSize.value
    };
    
    // 根据筛选条件添加参数
    if (filters.value.orderId) params.orderId = filters.value.orderId;
    if (filters.value.username) params.username = filters.value.username;
    if (filters.value.status) params.status = filters.value.status;
    if (filters.value.startDate) params.startDate = filters.value.startDate;
    if (filters.value.endDate) params.endDate = filters.value.endDate;
    
    // 设置排序
    if (filters.value.sort) {
      const [field, direction] = filters.value.sort.split('_');
      params.sortBy = field;
      params.sortDirection = direction.toUpperCase();
    }
    
    // 调用API获取订单列表
    const response = await orderService.getAllOrders(currentPage.value, pageSize.value);
    
    if (response) {
      // 获取订单数据
      const orders = response.items || [];
      total.value = response.total || 0;
      
      // 转换API返回的订单为前端展示的订单格式
      orderList.value = orders.map(transformApiOrder);
    } else {
      // 如果没有数据，设置为空数组
      orderList.value = [];
    }
  } catch (error) {
    console.error('获取订单列表失败:', error);
    // 出错时设置为空数组
    orderList.value = [];
  } finally {
    loading.value = false;
  }
}

// 监听筛选条件和分页变化
watch([filters, currentPage], () => {
  fetchOrderList();
}, { deep: true });

onMounted(() => {
  fetchOrderList();
})
</script> 