<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ isEdit ? '编辑服装' : '添加服装' }}</h1>
      <button class="btn" @click="router.back()">返回</button>
    </div>

    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <!-- 基本信息 -->
          <div class="card bg-base-200 mb-6">
            <div class="card-body">
              <h2 class="card-title text-base mb-4">基本信息</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
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

                <div class="form-control">
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

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">库存数量</span>
                  </label>
                  <input 
                    type="number" 
                    v-model="form.stock" 
                    placeholder="请输入库存数量"
                    class="input input-bordered" 
                    required
                    min="0"
                  />
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">状态</span>
                  </label>
                  <select v-model="form.status" class="select select-bordered" required>
                    <option value="available">可租</option>
                    <option value="maintenance">维护中</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- 图片上传 -->
          <div class="card bg-base-200 mb-6">
            <div class="card-body">
              <h2 class="card-title text-base mb-4">服装图片</h2>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                  v-for="(image, index) in form.images" 
                  :key="index" 
                  class="relative aspect-square"
                >
                  <img :src="image" class="w-full h-full object-cover rounded-box" />
                  <button 
                    type="button"
                    class="btn btn-circle btn-sm btn-error absolute -top-2 -right-2"
                    @click="removeImage(index)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>

                <label 
                  v-if="form.images.length < 4"
                  class="aspect-square border-2 border-dashed rounded-box flex items-center justify-center cursor-pointer hover:bg-base-300"
                >
                  <input 
                    type="file" 
                    class="hidden" 
                    accept="image/*"
                    @change="handleImageUpload"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                </label>
              </div>
            </div>
          </div>

          <!-- 详细信息 -->
          <div class="card bg-base-200 mb-6">
            <div class="card-body">
              <h2 class="card-title text-base mb-4">详细信息</h2>
              
              <div class="form-control mb-4">
                <label class="label">
                  <span class="label-text">服装描述</span>
                </label>
                <textarea 
                  v-model="form.description" 
                  class="textarea textarea-bordered" 
                  placeholder="请输入服装描述"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div class="form-control mb-4">
                <label class="label">
                  <span class="label-text">尺码信息</span>
                </label>
                <textarea 
                  v-model="form.sizeInfo" 
                  class="textarea textarea-bordered" 
                  placeholder="请输入尺码信息"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">穿着建议</span>
                </label>
                <textarea 
                  v-model="form.wearingTips" 
                  class="textarea textarea-bordered" 
                  placeholder="请输入穿着建议"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-center gap-4">
            <button type="submit" class="btn btn-primary">保存</button>
            <button type="button" class="btn" @click="router.back()">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 是否为编辑模式
const isEdit = route.name === 'admin-clothing-edit'

// 分类列表
const categories = ref([
  { id: 1, name: '连衣裙' },
  { id: 2, name: '西装' },
  { id: 3, name: '外套' },
  { id: 4, name: '裤装' }
])

// 表单数据
const form = ref({
  id: null,
  name: '',
  categoryId: '',
  price: 0,
  deposit: 0,
  stock: 1,
  status: 'available',
  images: [] as string[],
  description: '',
  sizeInfo: '',
  wearingTips: ''
})

// 处理图片上传
const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.images.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }
}

// 移除图片
const removeImage = (index: number) => {
  form.value.images.splice(index, 1)
}

// 提交表单
const handleSubmit = async () => {
  try {
    // TODO: 调用API保存数据
    console.log('提交数据:', form.value)
    router.push('/admin/clothing')
  } catch (error) {
    console.error('保存失败:', error)
  }
}

// 获取服装详情
const fetchClothingDetail = async (id: string) => {
  try {
    // TODO: 从API获取服装详情
    console.log('获取服装详情:', id)
  } catch (error) {
    console.error('获取服装详情失败:', error)
  }
}

onMounted(async () => {
  // 编辑模式下获取服装详情
  if (isEdit && route.params.id) {
    await fetchClothingDetail(route.params.id as string)
  }
})
</script> 