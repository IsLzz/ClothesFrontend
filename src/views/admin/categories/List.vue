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
                <td>{{ category.clothingCount || 0 }}</td>
                <td>{{ formatDateTime(category.createdAt) }}</td>
                <td>
                  <div class="flex gap-2">
                    <button class="btn btn-sm btn-info" @click="openEditModal(category)">编辑</button>
                    <button 
                      class="btn btn-sm btn-error" 
                      @click="handleDelete(category)"
                      :disabled="(category.clothingCount || 0) > 0"
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
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner"></span>
              保存
            </button>
            <button type="button" class="btn" @click="closeModal">取消</button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>关闭</button>
      </form>
    </dialog>

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
import { ref, computed, onMounted } from 'vue'
import categoryService from '@/api/services/categoryService'
import type { Category } from '@/api/services/categoryService'
import fileService from '@/api/services/fileService'

// 分类列表
const categoryList = ref<Category[]>([])
const loading = ref(false)

// 表单数据
const form = ref({
  id: null as number | null,
  name: '',
  icon: '',
  description: ''
})

// 文件对象
const uploadFile = ref<File | null>(null)

// 消息弹窗数据
const messageTitle = ref('提示')
const messageContent = ref('')

// 确认弹窗数据
const confirmContent = ref('')
const categoryToDelete = ref<Category | null>(null)

// 是否为编辑模式
const isEditing = computed(() => !!form.value.id)

// 格式化日期时间
const formatDateTime = (dateString?: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

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
const showConfirm = (content: string, category: Category) => {
  confirmContent.value = content
  categoryToDelete.value = category
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
  if (categoryToDelete.value) {
    try {
      loading.value = true
      await categoryService.deleteCategory(categoryToDelete.value.id)
      closeConfirmModal()
      showMessage('成功', '分类删除成功')
      await fetchCategoryList()
    } catch (error: any) {
      console.error('删除失败:', error)
      showMessage('错误', error.message || '删除失败，请重试')
    } finally {
      loading.value = false
    }
  }
}

// 打开添加弹窗
const openAddModal = () => {
  form.value = {
    id: null,
    name: '',
    icon: '',
    description: ''
  }
  uploadFile.value = null
  const modal = document.getElementById('category-modal') as HTMLDialogElement
  modal?.showModal()
}

// 打开编辑弹窗
const openEditModal = (category: Category) => {
  form.value = { 
    id: category.id,
    name: category.name,
    icon: category.icon || '',
    description: category.description || ''
  }
  uploadFile.value = null
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
    uploadFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.icon = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!form.value.name.trim()) {
    showMessage('提示', '分类名称不能为空')
    return
  }
  
  try {
    loading.value = true
    
    // 如果有新图片，先上传图片
    if (uploadFile.value) {
      const uploadResult = await fileService.uploadImage(uploadFile.value)
      form.value.icon = uploadResult.url
    }
    
    // 根据是否有ID决定是创建还是更新
    if (isEditing.value) {
      await categoryService.updateCategory(form.value.id!, {
        name: form.value.name,
        description: form.value.description,
        icon: form.value.icon
      })
      showMessage('成功', '分类更新成功')
    } else {
      await categoryService.createCategory({
        name: form.value.name,
        description: form.value.description,
        icon: form.value.icon
      })
      showMessage('成功', '分类添加成功')
    }
    
    closeModal()
    await fetchCategoryList()
  } catch (error: any) {
    console.error('保存失败:', error)
    showMessage('错误', error.message || '操作失败，请重试')
  } finally {
    loading.value = false
  }
}

// 删除分类
const handleDelete = async (category: Category) => {
  if ((category.clothingCount || 0) > 0) {
    showMessage('提示', '该分类下还有服装，不能删除')
    return
  }
  
  showConfirm(`确定要删除分类"${category.name}"吗？`, category)
}

// 获取分类列表
const fetchCategoryList = async () => {
  try {
    loading.value = true
    const data = await categoryService.getAllCategories()
    categoryList.value = data
  } catch (error: any) {
    console.error('获取分类列表失败:', error)
    showMessage('错误', error.message || '获取分类列表失败，请重试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategoryList()
})
</script> 