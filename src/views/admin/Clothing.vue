<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">服装管理</h1>
      <button class="btn btn-primary" @click="openAddModal">添加服装</button>
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
                      <img :src="item.image" :alt="item.name" />
                    </div>
                  </div>
                </td>
                <td>{{ item.name }}</td>
                <td>{{ item.category }}</td>
                <td>¥{{ item.price }}/天</td>
                <td>¥{{ item.deposit }}</td>
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
                    <button class="btn btn-sm btn-info" @click="openEditModal(item)">编辑</button>
                    <button class="btn btn-sm btn-error" @click="handleDelete(item)">删除</button>
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

    <!-- 添加/编辑服装弹窗 -->
    <dialog id="clothing-modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">{{ isEditing ? '编辑服装' : '添加服装' }}</h3>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">服装名称</span>
            </label>
            <input 
              type="text" 
              v-model="form.name" 
              placeholder="请输入服装名称"
              class="input input-bordered" 
              required
            />
          </div>

          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">分类</span>
            </label>
            <select v-model="form.categoryId" class="select select-bordered" required>
              <option value="">请选择分类</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">租金（元/天）</span>
              </label>
              <input 
                type="number" 
                v-model="form.price" 
                placeholder="请输入租金"
                class="input input-bordered" 
                required
                min="0"
                step="0.01"
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">押金（元）</span>
              </label>
              <input 
                type="number" 
                v-model="form.deposit" 
                placeholder="请输入押金"
                class="input input-bordered" 
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">图片</span>
            </label>
            <input 
              type="file" 
              class="file-input file-input-bordered w-full" 
              accept="image/*"
              @change="handleImageChange"
            />
            <div v-if="form.image" class="mt-2">
              <img :src="form.image" class="w-32 h-32 object-cover rounded" />
            </div>
          </div>

          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">描述</span>
            </label>
            <textarea 
              v-model="form.description" 
              class="textarea textarea-bordered" 
              placeholder="请输入服装描述"
              rows="3"
            ></textarea>
          </div>

          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">是否可租</span>
              <input type="checkbox" v-model="form.available" class="toggle" />
            </label>
          </div>

          <div class="modal-action">
            <button type="submit" class="btn btn-primary">保存</button>
            <button type="button" class="btn" @click="closeModal">取消</button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>关闭</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

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
    status: 'available',
    rentCount: 5,
    image: 'https://picsum.photos/200'
  },
  {
    id: 2,
    name: '白色连衣裙',
    category: '连衣裙',
    price: 69,
    deposit: 199,
    status: 'rented',
    rentCount: 8,
    image: 'https://picsum.photos/200'
  }
])

// 表单数据
const form = ref({
  id: null,
  name: '',
  categoryId: '',
  price: 0,
  deposit: 0,
  description: '',
  image: '',
  available: true
})

// 是否为编辑模式
const isEditing = computed(() => !!form.value.id)

// 打开添加弹窗
const openAddModal = () => {
  form.value = {
    id: null,
    name: '',
    categoryId: '',
    price: 0,
    deposit: 0,
    description: '',
    image: '',
    available: true
  }
  const modal = document.getElementById('clothing-modal') as HTMLDialogElement
  modal?.showModal()
}

// 打开编辑弹窗
const openEditModal = (item: any) => {
  form.value = { ...item, categoryId: item.categoryId || '' }
  const modal = document.getElementById('clothing-modal') as HTMLDialogElement
  modal?.showModal()
}

// 关闭弹窗
const closeModal = () => {
  const modal = document.getElementById('clothing-modal') as HTMLDialogElement
  modal?.close()
}

// 处理图片上传
const handleImageChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.image = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    // TODO: 调用API保存数据
    console.log('提交数据:', form.value)
    closeModal()
    await fetchClothingList()
  } catch (error) {
    console.error('保存失败:', error)
  }
}

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