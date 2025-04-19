<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">租赁详情</h1>
      <button class="btn" @click="router.back()">返回</button>
    </div>

    <div v-if="loading" class="flex justify-center my-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="rental">
      <!-- 基本信息卡片 -->
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <h2 class="card-title">基本信息</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <div class="text-sm opacity-60">租赁ID</div>
              <div class="font-medium">{{ rental.id }}</div>
            </div>
            <div>
              <div class="text-sm opacity-60">订单项ID</div>
              <div class="font-medium">{{ rental.orderItemId }}</div>
            </div>
            <div>
              <div class="text-sm opacity-60">状态</div>
              <div class="font-medium">
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
              </div>
            </div>
            <div>
              <div class="text-sm opacity-60">开始日期</div>
              <div class="font-medium">{{ formatDate(rental.startDate) }}</div>
            </div>
            <div>
              <div class="text-sm opacity-60">结束日期</div>
              <div class="font-medium">{{ formatDate(rental.endDate) }}</div>
            </div>
            <div>
              <div class="text-sm opacity-60">租期</div>
              <div class="font-medium">{{ rental.rentalDays }}天</div>
            </div>
            <div v-if="rental.returned">
              <div class="text-sm opacity-60">归还日期</div>
              <div class="font-medium">{{ formatDate(rental.returnDate) }}</div>
            </div>
            <div v-if="rental.lateFee">
              <div class="text-sm opacity-60">滞纳金</div>
              <div class="font-medium text-error">¥{{ rental.lateFee }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 服装信息卡片 -->
      <div class="card bg-base-100 shadow-xl mb-6" v-if="clothes">
        <div class="card-body">
          <h2 class="card-title">服装信息</h2>
          
          <div class="flex flex-col md:flex-row gap-6 mt-4">
            <div class="flex-none">
              <div class="avatar">
                <div class="w-32 rounded">
                  <img :src="clothes.imageUrl || (clothes.images && clothes.images.length > 0 ? clothes.images[0] : 'https://picsum.photos/200')" :alt="clothes.name" />
                </div>
              </div>
            </div>
            
            <div class="flex-1">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div class="text-sm opacity-60">服装名称</div>
                  <div class="font-medium">{{ clothes.name }}</div>
                </div>
                <div>
                  <div class="text-sm opacity-60">分类</div>
                  <div class="font-medium">{{ clothes.category || '未分类' }}</div>
                </div>
                <div>
                  <div class="text-sm opacity-60">尺码</div>
                  <div class="font-medium">{{ clothes.size }}</div>
                </div>
                <div>
                  <div class="text-sm opacity-60">日租金</div>
                  <div class="font-medium">¥{{ clothes.pricePerDay }}</div>
                </div>
                <div class="md:col-span-2">
                  <div class="text-sm opacity-60">描述</div>
                  <div class="font-medium">{{ clothes.description || '暂无描述' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户信息卡片 -->
      <div class="card bg-base-100 shadow-xl mb-6" v-if="user">
        <div class="card-body">
          <h2 class="card-title">用户信息</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <div class="text-sm opacity-60">用户ID</div>
              <div class="font-medium">{{ user.id }}</div>
            </div>
            <div>
              <div class="text-sm opacity-60">用户名</div>
              <div class="font-medium">{{ user.name }}</div>
            </div>
            <div>
              <div class="text-sm opacity-60">电话</div>
              <div class="font-medium">{{ user.phone || '-' }}</div>
            </div>
            <div class="md:col-span-3">
              <div class="text-sm opacity-60">邮箱</div>
              <div class="font-medium">{{ user.email || '-' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="card bg-base-100 shadow-xl" v-if="!rental.returned">
        <div class="card-body">
          <h2 class="card-title">操作</h2>
          
          <div class="flex flex-wrap gap-4 mt-4">
            <button 
              class="btn btn-primary"
              @click="openReturnModal"
            >
              归还服装
            </button>
            <button 
              class="btn btn-secondary"
              @click="openExtendModal"
            >
              延长租期
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>无法找到该租赁记录或加载失败，请返回列表重试。</span>
    </div>

    <!-- 归还弹窗 -->
    <dialog id="return-modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-6">归还服装</h3>
        
        <div v-if="rental">
          <!-- 服装信息摘要 -->
          <div class="flex items-center gap-3 mb-6" v-if="clothes">
            <div class="avatar">
              <div class="w-16 rounded">
                <img :src="clothes.imageUrl || (clothes.images && clothes.images.length > 0 ? clothes.images[0] : 'https://picsum.photos/200')" :alt="clothes.name" />
              </div>
            </div>
            <div>
              <div class="font-medium">{{ clothes.name }}</div>
              <div class="text-sm opacity-60">
                租期: {{ formatDate(rental.startDate) }} 至 {{ formatDate(rental.endDate) }}
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
              :min="rental.startDate"
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
        
        <div v-if="rental">
          <!-- 服装信息摘要 -->
          <div class="flex items-center gap-3 mb-6" v-if="clothes">
            <div class="avatar">
              <div class="w-16 rounded">
                <img :src="clothes.imageUrl || (clothes.images && clothes.images.length > 0 ? clothes.images[0] : 'https://picsum.photos/200')" :alt="clothes.name" />
              </div>
            </div>
            <div>
              <div class="font-medium">{{ clothes.name }}</div>
              <div class="text-sm opacity-60">
                当前租期: {{ formatDate(rental.startDate) }} 至 {{ formatDate(rental.endDate) }}
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import rentalService from '@/api/services/rentalService'
import clothesService from '@/api/services/clothesService'
import type { Rental } from '@/api/services/rentalService'
import type { Clothes } from '@/api/services/clothesService'

const route = useRoute();
const router = useRouter();

// 加载状态
const loading = ref(true);
const submitLoading = ref(false);

// 租赁记录
const rental = ref<Rental | null>(null);
const clothes = ref<Clothes | null>(null);
const user = ref<any>(null);

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
  if (!rental.value || !returnForm.value.returnDate) return false;
  
  const returnDate = new Date(returnForm.value.returnDate);
  const endDate = new Date(rental.value.endDate);
  
  return returnDate > endDate;
});

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
const isOverdue = (rental: Rental): boolean => {
  if (rental.returned) return false;
  
  const today = new Date();
  const endDate = new Date(rental.endDate);
  
  return today > endDate;
};

// 获取租赁状态文本
const getRentalStatus = (rental: Rental): string => {
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
  if (!rental.value || !returnForm.value.returnDate) return 0;
  
  const returnDate = new Date(returnForm.value.returnDate);
  const endDate = new Date(rental.value.endDate);
  
  if (returnDate <= endDate) return 0;
  
  const diffTime = Math.abs(returnDate.getTime() - endDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// 计算最小延期日期（原结束日期+1天）
const calculateMinEndDate = (): string => {
  if (!rental.value) return '';
  
  const endDate = new Date(rental.value.endDate);
  endDate.setDate(endDate.getDate() + 1);
  
  return endDate.toISOString().split('T')[0];
};

// 打开归还弹窗
const openReturnModal = () => {
  // 设置默认归还日期为今天
  returnForm.value.returnDate = new Date().toISOString().split('T')[0];
  returnForm.value.lateFee = 0;
  
  // 打开弹窗
  const modal = document.getElementById('return-modal') as HTMLDialogElement;
  modal?.showModal();
};

// 打开延期弹窗
const openExtendModal = () => {
  if (!rental.value) return;
  
  // 设置默认新结束日期为原结束日期+7天
  const endDate = new Date(rental.value.endDate);
  endDate.setDate(endDate.getDate() + 7);
  extendForm.value.endDate = endDate.toISOString().split('T')[0];
  
  // 打开弹窗
  const modal = document.getElementById('extend-modal') as HTMLDialogElement;
  modal?.showModal();
};

// 处理归还
const handleReturn = async () => {
  if (!rental.value || !returnForm.value.returnDate) {
    alert('请选择归还日期');
    return;
  }
  
  try {
    submitLoading.value = true;
    
    // 调用API归还服装
    const success = await rentalService.returnClothes(
      rental.value.id,
      returnForm.value.returnDate,
      isLate.value ? returnForm.value.lateFee : undefined
    );
    
    if (success) {
      alert('归还成功');
      
      // 关闭弹窗
      const modal = document.getElementById('return-modal') as HTMLDialogElement;
      modal?.close();
      
      // 重新获取租赁记录
      await fetchRentalDetail();
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
  if (!rental.value || !extendForm.value.endDate) {
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
      rental.value.id,
      extendForm.value.endDate
    );
    
    if (updatedRental) {
      alert('延期成功');
      
      // 关闭弹窗
      const modal = document.getElementById('extend-modal') as HTMLDialogElement;
      modal?.close();
      
      // 更新租赁记录
      rental.value = updatedRental;
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

// 获取租赁详情
const fetchRentalDetail = async () => {
  loading.value = true;
  
  try {
    const rentalId = parseInt(route.params.id as string);
    
    // 获取租赁记录
    const rentalData = await rentalService.getRentalById(rentalId);
    rental.value = rentalData;
    
    // 获取服装详情
    if (rental.value?.clothesId) {
      const clothesData = await clothesService.getClothesById(rental.value.clothesId);
      clothes.value = clothesData;
    }
    
    // TODO: 获取用户详情
    // 这里需要根据实际情况添加获取用户详情的API调用
    
    // 临时模拟用户信息
    if (rental.value?.userId) {
      user.value = {
        id: rental.value.userId,
        name: `用户${rental.value.userId}`,
        email: `user${rental.value.userId}@example.com`,
        phone: `1388888${rental.value.userId.toString().padStart(4, '0')}`
      };
    }
  } catch (error) {
    console.error('获取租赁详情失败:', error);
    rental.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // 获取租赁详情
  fetchRentalDetail();
});
</script> 