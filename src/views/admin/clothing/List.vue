<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">服装管理</h1>
      <router-link to="/admin/clothing/create" class="btn btn-primary">添加服装</router-link>
    </div>

    <!-- 筛选器 -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">关键词</span>
            </label>
            <input type="text" v-model="filters.keyword" placeholder="搜索服装名称" class="input input-bordered" />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">分类</span>
            </label>
            <select v-model="filters.category" class="select select-bordered">
              <option value="">全部分类</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">状态</span>
            </label>
            <select v-model="filters.status" class="select select-bordered">
              <option value="">全部状态</option>
              <option value="available">可租</option>
              <option value="rented">已租</option>
              <option value="maintenance">维护中</option>
            </select>
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">排序</span>
            </label>
            <select v-model="filters.sort" class="select select-bordered">
              <option value="createdAt_desc">最新添加</option>
              <option value="createdAt_asc">最早添加</option>
              <option value="pricePerDay_desc">价格从高到低</option>
              <option value="pricePerDay_asc">价格从低到高</option>
              <option value="rentCount_desc">租用次数从高到低</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 服装列表 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>图片</th>
                <th>名称</th>
                <th>分类</th>
                <th>价格</th>
                <th>押金</th>
                <th>库存</th>
                <th>状态</th>
                <th>租用次数</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in clothingList" :key="item.id">
                <td>
                  <div class="avatar">
                    <div class="w-16 rounded">
                      <img :src="item.images && item.images.length > 0 ? item.images[0] : 'https://picsum.photos/200'" :alt="item.name" />
                    </div>
                  </div>
                </td>
                <td>{{ item.name }}</td>
                <td>{{ item.category }}</td>
                <td>¥{{ item.pricePerDay }}/天</td>
                <td>¥{{ item.deposit || 0 }}</td>
                <td>{{ item.stock }}</td>
                <td>
                  <div :class="[
                    'badge',
                    {
                      'badge-success': item.status === 'available',
                      'badge-warning': item.status === 'rented',
                      'badge-error': item.status === 'maintenance'
                    }
                  ]">
                    {{ item.status && statusMap[item.status] ? statusMap[item.status] : '未知状态' }}
                  </div>
                </td>
                <td>{{ item.rentCount || 0 }}</td>
                <td>
                  <div class="flex gap-2">
                    <router-link 
                      :to="`/admin/clothing/${item.id}/edit`"
                      class="btn btn-sm btn-info"
                    >
                      编辑
                    </router-link>
                    <button 
                      class="btn btn-sm btn-error"
                      @click="() => handleDelete(item)"
                    >
                      删除
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

    <!-- 消息提示弹窗 -->
    <dialog id="message-modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">{{ messageTitle }}</h3>
        <p class="py-4">{{ messageContent }}</p>
        <div class="modal-action">
          <button class="btn" @click="closeMessageModal">确定</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>关闭</button>
      </form>
    </dialog>

    <!-- 确认弹窗 -->
    <dialog id="confirm-modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">确认操作</h3>
        <p class="py-4">{{ confirmContent }}</p>
        <div class="modal-action">
          <button class="btn btn-error" @click="handleConfirm">确定删除</button>
          <button class="btn" @click="closeConfirmModal">取消</button>
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
import clothesService, { clothesStatusMap } from '@/api/services/clothesService'
import type { Clothes, PaginatedResponse } from '@/api/services/clothesService'
import categoryService from '@/api/services/categoryService'

// 状态映射
const statusMap: Record<string, string> = clothesStatusMap

// 消息弹窗数据
const messageTitle = ref('提示')
const messageContent = ref('')

// 确认弹窗数据
const confirmContent = ref('')
const itemToDelete = ref<Clothes | null>(null)

// 分类列表
const categories = ref([
  { id: 1, name: '连衣裙' },
  { id: 2, name: '西装' },
  { id: 3, name: '外套' },
  { id: 4, name: '裤装' }
])

// 筛选条件
const filters = ref({
  keyword: '',
  category: '',
  status: '',
  sort: 'createdAt_desc'
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 加载状态
const loading = ref(false)

// 服装列表
const clothingList = ref<Clothes[]>([])

// 显示消息弹窗
const showMessage = (title: string, content: string) => {
  messageTitle.value = title
  messageContent.value = content
  const modal = document.getElementById('message-modal') as HTMLDialogElement
  modal?.showModal()
}

// 关闭消息弹窗
const closeMessageModal = () => {
  const modal = document.getElementById('message-modal') as HTMLDialogElement
  modal?.close()
}

// 显示确认弹窗
const showConfirm = (content: string, item: Clothes) => {
  confirmContent.value = content
  itemToDelete.value = item
  const modal = document.getElementById('confirm-modal') as HTMLDialogElement
  modal?.showModal()
}

// 关闭确认弹窗
const closeConfirmModal = () => {
  const modal = document.getElementById('confirm-modal') as HTMLDialogElement
  modal?.close()
}

// 处理确认操作
const handleConfirm = async () => {
  if (itemToDelete.value) {
    try {
      loading.value = true
      
      // 调用API删除服装
      await clothesService.deleteClothes(itemToDelete.value.id)
      
      closeConfirmModal()
      showMessage('成功', `服装"${itemToDelete.value.name}"已删除成功`)
      
      // 刷新服装列表
      await fetchClothingList()
    } catch (error: any) {
      console.error('删除失败:', error)
      showMessage('错误', error.message || '删除服装失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }
}

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

// 删除服装
const handleDelete = (item: Clothes) => {
  showConfirm(`确定要删除"${item.name}"吗？`, item)
}

// 获取服装列表
const fetchClothingList = async () => {
  try {
    loading.value = true;
    
    // 构建筛选参数
    const apiFilters: Record<string, any> = {};
    
    // 根据筛选条件添加参数
    if (filters.value.keyword) apiFilters.keyword = filters.value.keyword;
    if (filters.value.category) apiFilters.categoryId = filters.value.category;
    if (filters.value.status) apiFilters.status = filters.value.status;
    
    // 设置排序
    if (filters.value.sort) {
      const [field, direction] = filters.value.sort.split('_');
      apiFilters.sortBy = field;
      apiFilters.sortDirection = direction.toUpperCase();
    }
    
    // 调用API获取服装列表
    const response = await clothesService.getAllClothes(currentPage.value, pageSize.value, apiFilters);
    
    if (response && response.items) {
      // 获取服装数据
      const clothes = response.items || [];
      total.value = response.total || 0;
      
      // 处理服装数据，确保图片字段是数组格式
      clothingList.value = clothes.map(item => {
        // 确保images字段存在且为数组
        const images = item.images || [];
        
        // 如果imageUrl存在但images为空，将imageUrl添加到images数组中
        if (item.imageUrl && images.length === 0) {
          images.push(item.imageUrl);
        }
        
        // 如果images仍然为空，添加默认图片
        if (images.length === 0) {
          images.push('https://picsum.photos/200');
        }
        
        return {
          ...item,
          images
        };
      });
    } else {
      // 如果没有数据，设置为空数组
      clothingList.value = [];
      total.value = 0;
    }
  } catch (error: any) {
    console.error('获取服装列表失败:', error);
    showMessage('错误', error.message || '获取服装列表失败，请稍后重试');
    // 出错时设置为空数组
    clothingList.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

// 监听筛选条件和分页变化
watch([filters, currentPage], () => {
  fetchClothingList();
}, { deep: true });

onMounted(() => {
  // 初始加载服装列表
  fetchClothingList();
  
  // 获取分类列表
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response && response.length) {
        categories.value = response;
      }
    } catch (error) {
      console.error('获取分类列表失败:', error);
      showMessage('警告', '获取分类列表失败，将使用默认分类');
    }
  };
  
  fetchCategories();
})
</script> 