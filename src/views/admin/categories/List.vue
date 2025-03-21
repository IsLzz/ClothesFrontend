<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">分类管理</h1>
      <button class="btn btn-primary" @click="openAddModal">添加分类</button>
    </div>

    <!-- 分类列表 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>图标</th>
                <th>名称</th>
                <th>服装数量</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in categoryList" :key="category.id">
                <td>
                  <div class="avatar">
                    <div class="w-12 rounded">
                      <img :src="category.icon" :alt="category.name" />
                    </div>
                  </div>
                </td>
                <td>{{ category.name }}</td>
                <td>{{ category.clothingCount }}</td>
                <td>{{ formatDateTime(category.createdAt) }}</td>
                <td>
                  <div class="flex gap-2">
                    <button class="btn btn-sm btn-info" @click="openEditModal(category)">编辑</button>
                    <button 
                      class="btn btn-sm btn-error" 
                      @click="handleDelete(category)"
                      :disabled="category.clothingCount > 0"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 添加/编辑分类弹窗 -->
    <dialog id="category-modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">{{ isEditing ? '编辑分类' : '添加分类' }}</h3>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">分类名称</span>
            </label>
            <input 
              type="text" 
              v-model="form.name" 
              placeholder="请输入分类名称"
              class="input input-bordered" 
              required
            />
          </div>

          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">分类图标</span>
            </label>
            <input 
              type="file" 
              class="file-input file-input-bordered w-full" 
              accept="image/*"
              @change="handleImageChange"
            />
            <div v-if="form.icon" class="mt-2">
              <img :src="form.icon" class="w-32 h-32 object-cover rounded" />
            </div>
          </div>

          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">描述</span>
            </label>
            <textarea 
              v-model="form.description" 
              class="textarea textarea-bordered" 
              placeholder="请输入分类描述"
              rows="3"
            ></textarea>
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
import { ref, computed, onMounted } from 'vue'

// 分类列表
const categoryList = ref([
  {
    id: 1,
    name: '连衣裙',
    icon: 'https://picsum.photos/200',
    description: '各类连衣裙',
    clothingCount: 12,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 2,
    name: '西装',
    icon: 'https://picsum.photos/200',
    description: '正装西装',
    clothingCount: 8,
    createdAt: '2024-01-02T14:30:00Z'
  },
  {
    id: 3,
    name: '外套',
    icon: 'https://picsum.photos/200',
    description: '各类外套',
    clothingCount: 15,
    createdAt: '2024-01-03T09:15:00Z'
  },
  {
    id: 4,
    name: '裤装',
    icon: 'https://picsum.photos/200',
    description: '各类裤装',
    clothingCount: 10,
    createdAt: '2024-01-04T16:45:00Z'
  }
])

// 表单数据
const form = ref({
  id: null,
  name: '',
  icon: '',
  description: ''
})

// 是否为编辑模式
const isEditing = computed(() => !!form.value.id)

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

// 打开添加弹窗
const openAddModal = () => {
  form.value = {
    id: null,
    name: '',
    icon: '',
    description: ''
  }
  const modal = document.getElementById('category-modal') as HTMLDialogElement
  modal?.showModal()
}

// 打开编辑弹窗
const openEditModal = (category: any) => {
  form.value = { ...category }
  const modal = document.getElementById('category-modal') as HTMLDialogElement
  modal?.showModal()
}

// 关闭弹窗
const closeModal = () => {
  const modal = document.getElementById('category-modal') as HTMLDialogElement
  modal?.close()
}

// 处理图片上传
const handleImageChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.icon = e.target?.result as string
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
    await fetchCategoryList()
  } catch (error) {
    console.error('保存失败:', error)
  }
}

// 删除分类
const handleDelete = async (category: any) => {
  if (category.clothingCount > 0) {
    alert('该分类下还有服装，不能删除')
    return
  }
  
  if (confirm(`确定要删除分类"${category.name}"吗？`)) {
    try {
      // TODO: 调用API删除数据
      console.log('删除数据:', category)
      await fetchCategoryList()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }
}

// 获取分类列表
const fetchCategoryList = async () => {
  try {
    // TODO: 从API获取分类列表
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

onMounted(() => {
  fetchCategoryList()
})
</script> 