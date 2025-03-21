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
              <option value="price_desc">价格从高到低</option>
              <option value="price_asc">价格从低到高</option>
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
                      <img :src="item.images[0]" :alt="item.name" />
                    </div>
                  </div>
                </td>
                <td>{{ item.name }}</td>
                <td>{{ item.category }}</td>
                <td>¥{{ item.price }}/天</td>
                <td>¥{{ item.deposit }}</td>
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
                    {{ statusMap[item.status] }}
                  </div>
                </td>
                <td>{{ item.rentCount }}</td>
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
                      @click="handleDelete(item)"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 状态映射
const statusMap = {
  available: '可租',
  rented: '已租',
  maintenance: '维护中'
}

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

// 服装列表
const clothingList = ref([
  {
    id: 1,
    name: '黑色西装',
    category: '西装',
    price: 99,
    deposit: 299,
    stock: 2,
    status: 'available',
    rentCount: 5,
    images: ['https://picsum.photos/200']
  },
  {
    id: 2,
    name: '白色连衣裙',
    category: '连衣裙',
    price: 69,
    deposit: 199,
    stock: 1,
    status: 'rented',
    rentCount: 8,
    images: ['https://picsum.photos/200']
  }
])

// 删除服装
const handleDelete = async (item: any) => {
  if (confirm(`确定要删除"${item.name}"吗？`)) {
    try {
      // TODO: 调用API删除数据
      console.log('删除数据:', item)
      await fetchClothingList()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }
}

// 获取服装列表
const fetchClothingList = async () => {
  try {
    // TODO: 从API获取服装列表
    total.value = 23 // 示例数据
  } catch (error) {
    console.error('获取服装列表失败:', error)
  }
}

onMounted(() => {
  fetchClothingList()
})
</script> 