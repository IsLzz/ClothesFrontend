<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">租赁管理</h1>
    </div>

    <!-- 筛选器 -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">服装名称</span>
            </label>
            <input type="text" v-model="filters.clothesName" placeholder="搜索服装名称" class="input input-bordered" />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">用户名</span>
            </label>
            <input type="text" v-model="filters.userName" placeholder="搜索用户名" class="input input-bordered" />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">状态</span>
            </label>
            <select v-model="filters.returned" class="select select-bordered">
              <option value="">全部状态</option>
              <option value="false">租赁中</option>
              <option value="true">已归还</option>
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
        
        <div class="flex justify-end mt-4">
          <button class="btn btn-primary" @click="fetchRentals">
            <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
            查询
          </button>
        </div>
      </div>
    </div>

    <!-- 标签切换 -->
    <div class="tabs tabs-boxed mb-6">
      <a 
        class="tab" 
        :class="{ 'tab-active': activeTab === 'all' }"
        @click="changeTab('all')"
      >全部租赁</a>
      <a 
        class="tab" 
        :class="{ 'tab-active': activeTab === 'active' }"
        @click="changeTab('active')"
      >租赁中</a>
      <a 
        class="tab" 
        :class="{ 'tab-active': activeTab === 'overdue' }"
        @click="changeTab('overdue')"
      >已逾期</a>
      <a 
        class="tab" 
        :class="{ 'tab-active': activeTab === 'returned' }"
        @click="changeTab('returned')"
      >已归还</a>
    </div>

    <!-- 租赁列表 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>服装</th>
                <th>用户</th>
                <th>租期</th>
                <th>状态</th>
                <th>归还日期</th>
                <th>滞纳金</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rental in rentalList" :key="rental.id" :class="{ 'bg-error bg-opacity-10': isOverdue(rental) }">
                <td>{{ rental.id }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <div class="avatar" v-if="rental.clothes">
                      <div class="w-12 rounded">
                        <img :src="rental.clothes.imageUrl || 'https://picsum.photos/200'" :alt="rental.clothes.name" />
                      </div>
                    </div>
                    <div>{{ rental.clothes ? rental.clothes.name : '未知服装' }}</div>
                  </div>
                </td>
                <td>{{ rental.user ? rental.user.name : rental.userId }}</td>
                <td>
                  {{ formatDate(rental.startDate) }} 至 {{ formatDate(rental.endDate) }}
                  <div class="text-sm opacity-60">{{ rental.rentalDays }}天</div>
                </td>
                <td>
                  <div :class="[
                    'badge',
                    {
                      'badge-primary': !rental.returned && !isOverdue(rental),
                      'badge-error': !rental.returned && isOverdue(rental),
                      'badge-success': rental.returned
                    }
                  ]">
                    {{ getRentalStatus(rental) }}
                  </div>
                </td>
                <td>{{ rental.returnDate ? formatDate(rental.returnDate) : '-' }}</td>
                <td>{{ rental.lateFee ? `¥${rental.lateFee}` : '-' }}</td>
                <td>
                  <div class="flex gap-2">
                    <button 
                      class="btn btn-sm btn-info"
                      @click="openRentalModal(rental)"
                    >
                      详情
                    </button>
                    <button 
                      v-if="!rental.returned"
                      class="btn btn-sm btn-success"
                      @click="openReturnModal(rental)"
                    >
                      归还
                    </button>
                    <button 
                      v-if="!rental.returned"
                      class="btn btn-sm btn-warning"
                      @click="openExtendModal(rental)"
                    >
                      延期
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="rentalList.length === 0">
                <td colspan="8" class="text-center py-4">
                  <div v-if="loading" class="flex justify-center">
                    <span class="loading loading-spinner loading-lg"></span>
                  </div>
                  <div v-else>暂无数据</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div v-if="rentalList.length > 0" class="flex justify-between items-center mt-4">
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

    <!-- 租赁详情弹窗 -->
    <dialog id="rental-detail-modal" class="modal">
      <div class="modal-box w-11/12 max-w-3xl">
        <h3 class="font-bold text-lg mb-6">租赁详情</h3>
        
        <div v-if="currentRental">
          <!-- 基本信息 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div class="text-sm opacity-60">租赁ID</div>
              <div class="font-medium">{{ currentRental.id }}</div>
            </div>
            <div>
              <div class="text-sm opacity-60">订单项ID</div>
              <div class="font-medium">{{ currentRental.orderItemId }}</div>
            </div>
            <div>
              <div class="text-sm opacity-60">租期</div>
              <div class="font-medium">
                {{ formatDate(currentRental.startDate) }} 至 {{ formatDate(currentRental.endDate) }}
                ({{ currentRental.rentalDays }}天)
              </div>
            </div>
            <div>
              <div class="text-sm opacity-60">状态</div>
              <div class="font-medium">
                <div :class="[
                  'badge',
                  {
                    'badge-primary': !currentRental.returned && !isOverdue(currentRental),
                    'badge-error': !currentRental.returned && isOverdue(currentRental),
                    'badge-success': currentRental.returned
                  }
                ]">
                  {{ getRentalStatus(currentRental) }}
                </div>
              </div>
            </div>
            <div v-if="currentRental.returned">
              <div class="text-sm opacity-60">归还日期</div>
              <div class="font-medium">{{ formatDate(currentRental.returnDate) }}</div>
            </div>
            <div v-if="currentRental.lateFee">
              <div class="text-sm opacity-60">滞纳金</div>
              <div class="font-medium text-error">¥{{ currentRental.lateFee }}</div>
            </div>
          </div>

          <!-- 服装信息 -->
          <div class="card bg-base-200 mb-6" v-if="currentRental.clothes">
            <div class="card-body">
              <h3 class="card-title text-base mb-4">服装信息</h3>
              
              <div class="flex gap-4">
                <div class="avatar">
                  <div class="w-24 rounded">
                    <img :src="currentRental.clothes.imageUrl || 'https://picsum.photos/200'" :alt="currentRental.clothes.name" />
                  </div>
                </div>
                <div class="flex-1">
                  <div class="font-bold">{{ currentRental.clothes.name }}</div>
                  <div class="text-sm opacity-60 mt-1">{{ currentRental.clothes.category || '未分类' }}</div>
                  <div class="mt-2">
                    <div class="text-sm opacity-60">尺码：{{ currentRental.clothes.size }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="opacity-60">日租金</div>
                  <div class="font-bold">¥{{ currentRental.clothes.pricePerDay }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 用户信息 -->
          <div class="card bg-base-200" v-if="currentRental.user">
            <div class="card-body">
              <h3 class="card-title text-base mb-4">用户信息</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div class="text-sm opacity-60">用户名</div>
                  <div class="font-medium">{{ currentRental.user.name }}</div>
                </div>
                <div>
                  <div class="text-sm opacity-60">电话</div>
                  <div class="font-medium">{{ currentRental.user.phone || '-' }}</div>
                </div>
                <div class="md:col-span-2">
                  <div class="text-sm opacity-60">邮箱</div>
                  <div class="font-medium">{{ currentRental.user.email || '-' }}</div>
                </div>
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

    <!-- 归还弹窗 -->
    <dialog id="return-modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-6">归还服装</h3>
        
        <div v-if="currentRental">
          <!-- 服装信息摘要 -->
          <div class="flex items-center gap-3 mb-6">
            <div class="avatar" v-if="currentRental.clothes">
              <div class="w-16 rounded">
                <img :src="currentRental.clothes.imageUrl || 'https://picsum.photos/200'" :alt="currentRental.clothes.name" />
              </div>
            </div>
            <div>
              <div class="font-medium">{{ currentRental.clothes ? currentRental.clothes.name : '未知服装' }}</div>
              <div class="text-sm opacity-60">
                租期: {{ formatDate(currentRental.startDate) }} 至 {{ formatDate(currentRental.endDate) }}
              </div>
            </div>
          </div>

          <!-- 归还表单 -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">归还日期 <span class="text-error">*</span></span>
            </label>
            <input 
              type="date" 
              v-model="returnForm.returnDate" 
              class="input input-bordered" 
              :min="currentRental.startDate"
            />
          </div>

          <div class="form-control mb-6" v-if="isLate">
            <label class="label">
              <span class="label-text">滞纳金 (元)</span>
            </label>
            <input 
              type="number" 
              v-model="returnForm.lateFee" 
              placeholder="请输入滞纳金金额" 
              class="input input-bordered" 
              min="0"
              step="0.01"
            />
            <label class="label">
              <span class="label-text-alt text-error">
                已逾期 {{ calculateOverdueDays() }} 天，建议收取滞纳金
              </span>
            </label>
          </div>

          <div class="alert alert-warning" v-if="isLate">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>归还日期晚于约定的结束日期，属于逾期归还</span>
          </div>
        </div>

        <div class="modal-action">
          <button class="btn btn-primary" @click="handleReturn" :disabled="submitLoading">
            <span v-if="submitLoading" class="loading loading-spinner loading-xs"></span>
            确认归还
          </button>
          <form method="dialog">
            <button class="btn">取消</button>
          </form>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>关闭</button>
      </form>
    </dialog>

    <!-- 延期弹窗 -->
    <dialog id="extend-modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-6">延长租期</h3>
        
        <div v-if="currentRental">
          <!-- 服装信息摘要 -->
          <div class="flex items-center gap-3 mb-6">
            <div class="avatar" v-if="currentRental.clothes">
              <div class="w-16 rounded">
                <img :src="currentRental.clothes.imageUrl || 'https://picsum.photos/200'" :alt="currentRental.clothes.name" />
              </div>
            </div>
            <div>
              <div class="font-medium">{{ currentRental.clothes ? currentRental.clothes.name : '未知服装' }}</div>
              <div class="text-sm opacity-60">
                当前租期: {{ formatDate(currentRental.startDate) }} 至 {{ formatDate(currentRental.endDate) }}
              </div>
            </div>
          </div>

          <!-- 延期表单 -->
          <div class="form-control mb-6">
            <label class="label">
              <span class="label-text">新的结束日期 <span class="text-error">*</span></span>
            </label>
            <input 
              type="date" 
              v-model="extendForm.endDate" 
              class="input input-bordered" 
              :min="calculateMinEndDate()"
            />
            <label class="label">
              <span class="label-text-alt">新的租期至少比原结束日期多1天</span>
            </label>
          </div>

          <div class="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>延长租期将额外收取相应的租金，请确认用户已了解并同意</span>
          </div>
        </div>

        <div class="modal-action">
          <button class="btn btn-primary" @click="handleExtend" :disabled="submitLoading">
            <span v-if="submitLoading" class="loading loading-spinner loading-xs"></span>
            确认延期
          </button>
          <form method="dialog">
            <button class="btn">取消</button>
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
import rentalService from '@/api/services/rentalService'
import clothesService from '@/api/services/clothesService'
import type { Rental } from '@/api/services/rentalService'
import type { Clothes } from '@/api/services/clothesService'

// 扩展的租赁类型，包含服装和用户信息
interface ExtendedRental extends Rental {
  clothes?: Clothes;
  user?: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
  };
}

// 状态标签
const activeTab = ref('all');

// 筛选条件
const filters = ref({
  clothesName: '',
  userName: '',
  returned: '',
  startDate: '',
  endDate: ''
});

// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const totalPages = computed(() => Math.ceil(total.value / pageSize.value));

// 加载状态
const loading = ref(false);
const submitLoading = ref(false);

// 租赁列表
const rentalList = ref<ExtendedRental[]>([]);

// 当前操作的租赁记录
const currentRental = ref<ExtendedRental | null>(null);

// 归还表单
const returnForm = ref({
  returnDate: new Date().toISOString().split('T')[0],
  lateFee: 0
});

// 延期表单
const extendForm = ref({
  endDate: ''
});

// 是否逾期归还
const isLate = computed(() => {
  if (!currentRental.value || !returnForm.value.returnDate) return false;
  
  const returnDate = new Date(returnForm.value.returnDate);
  const endDate = new Date(currentRental.value.endDate);
  
  return returnDate > endDate;
});

// 切换标签
const changeTab = (tab: string) => {
  activeTab.value = tab;
  
  // 根据标签设置筛选条件
  if (tab === 'all') {
    filters.value.returned = '';
  } else if (tab === 'active') {
    filters.value.returned = 'false';
  } else if (tab === 'returned') {
    filters.value.returned = 'true';
  } else if (tab === 'overdue') {
    filters.value.returned = 'false';
    // 获取逾期的租赁记录，筛选条件靠前端处理
  }
  
  // 重置分页
  currentPage.value = 1;
  
  // 重新获取租赁列表
  fetchRentals();
};

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
};

// 判断是否逾期
const isOverdue = (rental: ExtendedRental): boolean => {
  if (rental.returned) return false;
  
  const today = new Date();
  const endDate = new Date(rental.endDate);
  
  return today > endDate;
};

// 获取租赁状态文本
const getRentalStatus = (rental: ExtendedRental): string => {
  if (rental.returned) {
    return '已归还';
  } else if (isOverdue(rental)) {
    return '逾期未还';
  } else {
    return '租赁中';
  }
};

// 计算逾期天数
const calculateOverdueDays = (): number => {
  if (!currentRental.value || !returnForm.value.returnDate) return 0;
  
  const returnDate = new Date(returnForm.value.returnDate);
  const endDate = new Date(currentRental.value.endDate);
  
  if (returnDate <= endDate) return 0;
  
  const diffTime = Math.abs(returnDate.getTime() - endDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// 计算最小延期日期（原结束日期+1天）
const calculateMinEndDate = (): string => {
  if (!currentRental.value) return '';
  
  const endDate = new Date(currentRental.value.endDate);
  endDate.setDate(endDate.getDate() + 1);
  
  return endDate.toISOString().split('T')[0];
};

// 打开租赁详情弹窗
const openRentalModal = (rental: ExtendedRental) => {
  currentRental.value = rental;
  
  // 获取服装和用户的详细信息
  fetchRentalDetails(rental);
  
  // 打开弹窗
  const modal = document.getElementById('rental-detail-modal') as HTMLDialogElement;
  modal?.showModal();
};

// 打开归还弹窗
const openReturnModal = (rental: ExtendedRental) => {
  currentRental.value = rental;
  
  // 获取服装和用户的详细信息
  fetchRentalDetails(rental);
  
  // 设置默认归还日期为今天
  returnForm.value.returnDate = new Date().toISOString().split('T')[0];
  returnForm.value.lateFee = 0;
  
  // 打开弹窗
  const modal = document.getElementById('return-modal') as HTMLDialogElement;
  modal?.showModal();
};

// 打开延期弹窗
const openExtendModal = (rental: ExtendedRental) => {
  currentRental.value = rental;
  
  // 获取服装和用户的详细信息
  fetchRentalDetails(rental);
  
  // 设置默认新结束日期为原结束日期+7天
  const endDate = new Date(rental.endDate);
  endDate.setDate(endDate.getDate() + 7);
  extendForm.value.endDate = endDate.toISOString().split('T')[0];
  
  // 打开弹窗
  const modal = document.getElementById('extend-modal') as HTMLDialogElement;
  modal?.showModal();
};

// 获取租赁详情（包括服装和用户信息）
const fetchRentalDetails = async (rental: ExtendedRental) => {
  if (!rental) return;
  
  try {
    // 如果已经有详细信息，不再重复获取
    if (rental.clothes && rental.user) return;
    
    // 获取服装详情
    if (rental.clothesId && !rental.clothes) {
      const clothesDetail = await clothesService.getClothesById(rental.clothesId);
      if (clothesDetail) {
        rental.clothes = clothesDetail;
      }
    }
    
    // TODO: 获取用户详情
    // 这里需要根据实际情况添加获取用户详情的API调用
    // 如果有userService，可以调用userService.getUserById(rental.userId)
    
    // 临时模拟用户信息
    if (rental.userId && !rental.user) {
      rental.user = {
        id: rental.userId,
        name: `用户${rental.userId}`,
        email: `user${rental.userId}@example.com`,
        phone: `1388888${rental.userId.toString().padStart(4, '0')}`
      };
    }
  } catch (error) {
    console.error('获取租赁详情失败:', error);
  }
};

// 处理归还
const handleReturn = async () => {
  if (!currentRental.value || !returnForm.value.returnDate) {
    alert('请选择归还日期');
    return;
  }
  
  try {
    submitLoading.value = true;
    
    // 调用API归还服装
    const success = await rentalService.returnClothes(
      currentRental.value.id,
      returnForm.value.returnDate,
      isLate.value ? returnForm.value.lateFee : undefined
    );
    
    if (success) {
      alert('归还成功');
      
      // 关闭弹窗
      const modal = document.getElementById('return-modal') as HTMLDialogElement;
      modal?.close();
      
      // 刷新租赁列表
      await fetchRentals();
    } else {
      alert('归还失败，请稍后重试');
    }
  } catch (error) {
    console.error('归还失败:', error);
    alert('归还失败，请稍后重试');
  } finally {
    submitLoading.value = false;
  }
};

// 处理延期
const handleExtend = async () => {
  if (!currentRental.value || !extendForm.value.endDate) {
    alert('请选择新的结束日期');
    return;
  }
  
  // 检查新的结束日期是否合法
  const newEndDate = new Date(extendForm.value.endDate);
  const minEndDate = new Date(calculateMinEndDate());
  
  if (newEndDate < minEndDate) {
    alert('新的结束日期必须比原结束日期至少多1天');
    return;
  }
  
  try {
    submitLoading.value = true;
    
    // 调用API延长租期
    const updatedRental = await rentalService.extendRental(
      currentRental.value.id,
      extendForm.value.endDate
    );
    
    if (updatedRental) {
      alert('延期成功');
      
      // 关闭弹窗
      const modal = document.getElementById('extend-modal') as HTMLDialogElement;
      modal?.close();
      
      // 刷新租赁列表
      await fetchRentals();
    } else {
      alert('延期失败，请稍后重试');
    }
  } catch (error) {
    console.error('延期失败:', error);
    alert('延期失败，请稍后重试');
  } finally {
    submitLoading.value = false;
  }
};

// 获取租赁列表
const fetchRentals = async () => {
  try {
    loading.value = true;
    
    // 根据过滤条件获取租赁列表
    let rentals: Rental[] = [];
    
    if (filters.value.returned === 'false' && activeTab.value === 'overdue') {
      // 获取未归还的租赁记录，前端筛选出逾期的
      const allActive = await rentalService.getNotReturnedRentals();
      
      // 过滤出逾期的租赁记录
      rentals = allActive.filter(rental => isOverdue(rental as ExtendedRental));
    } else if (filters.value.returned === 'false') {
      // 获取未归还的租赁记录
      rentals = await rentalService.getNotReturnedRentals();
    } else {
      // 获取所有租赁记录
      // 这里需要根据实际情况添加获取所有租赁记录的API调用
      // 如果rentalService有getAllRentals方法，可以调用
      // 以下是模拟数据，实际使用时应替换为API调用
      rentals = mockRentals;
    }
    
    // 应用其他过滤条件（前端过滤）
    // 注意：这里只是前端过滤，实际项目中应该在API层进行过滤
    let filteredRentals = [...rentals];
    
    // 按服装名称过滤
    if (filters.value.clothesName) {
      filteredRentals = filteredRentals.filter(rental => 
        (rental as ExtendedRental).clothes?.name?.toLowerCase().includes(filters.value.clothesName.toLowerCase())
      );
    }
    
    // 按用户名过滤
    if (filters.value.userName) {
      filteredRentals = filteredRentals.filter(rental => 
        (rental as ExtendedRental).user?.name?.toLowerCase().includes(filters.value.userName.toLowerCase())
      );
    }
    
    // 按开始日期过滤
    if (filters.value.startDate) {
      const filterStartDate = new Date(filters.value.startDate);
      filteredRentals = filteredRentals.filter(rental => {
        const rentalStartDate = new Date(rental.startDate);
        return rentalStartDate >= filterStartDate;
      });
    }
    
    // 按结束日期过滤
    if (filters.value.endDate) {
      const filterEndDate = new Date(filters.value.endDate);
      filteredRentals = filteredRentals.filter(rental => {
        const rentalEndDate = new Date(rental.endDate);
        return rentalEndDate <= filterEndDate;
      });
    }
    
    // 分页处理
    total.value = filteredRentals.length;
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    const paginatedRentals = filteredRentals.slice(start, end);
    
    // 扩展租赁记录，添加服装和用户信息
    rentalList.value = paginatedRentals as ExtendedRental[];
    
    // 获取每个租赁记录的服装和用户详情
    for (const rental of rentalList.value) {
      await fetchRentalDetails(rental);
    }
  } catch (error) {
    console.error('获取租赁列表失败:', error);
    alert('获取租赁列表失败，请稍后重试');
    rentalList.value = [];
  } finally {
    loading.value = false;
  }
};

// 监听筛选条件和分页变化
watch([filters, currentPage], () => {
  fetchRentals();
}, { deep: true });

// 模拟租赁数据（仅用于开发测试）
const mockRentals: Rental[] = [
  {
    id: 1,
    orderItemId: 101,
    userId: 1,
    clothesId: 1,
    startDate: '2023-04-01',
    endDate: '2023-04-07',
    returned: true,
    returnDate: '2023-04-07',
    lateFee: null,
    rentalDays: 7
  },
  {
    id: 2,
    orderItemId: 102,
    userId: 2,
    clothesId: 2,
    startDate: '2023-04-05',
    endDate: '2023-04-12',
    returned: false,
    returnDate: null,
    lateFee: null,
    rentalDays: 7
  },
  {
    id: 3,
    orderItemId: 103,
    userId: 3,
    clothesId: 3,
    startDate: '2023-03-20',
    endDate: '2023-03-30',
    returned: false,
    returnDate: null,
    lateFee: null,
    rentalDays: 10
  },
  {
    id: 4,
    orderItemId: 104,
    userId: 1,
    clothesId: 4,
    startDate: '2023-03-15',
    endDate: '2023-03-25',
    returned: true,
    returnDate: '2023-03-27',
    lateFee: 50,
    rentalDays: 10
  }
];

onMounted(() => {
  // 初始加载租赁列表
  fetchRentals();
});
</script> 