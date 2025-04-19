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
                    <span class="label-text">服装名称 <span class="text-error">*</span></span>
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
                  <select v-model="form.categoryId" class="select select-bordered">
                    <option value="">请选择分类</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">租金（元/天） <span class="text-error">*</span></span>
                  </label>
                  <input 
                    type="number" 
                    v-model="form.pricePerDay" 
                    placeholder="请输入租金"
                    class="input input-bordered" 
                    required
                    min="0.01"
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
                    min="0"
                    step="0.01"
                  />
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">库存数量 <span class="text-error">*</span></span>
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
                  <select v-model="form.status" class="select select-bordered">
                    <option value="available">可租</option>
                    <option value="maintenance">维护中</option>
                  </select>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">尺码 <span class="text-error">*</span></span>
                  </label>
                  <input 
                    type="text" 
                    v-model="form.size" 
                    placeholder="请输入尺码信息，如S/M/L/XL"
                    class="input input-bordered" 
                    required
                  />
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer justify-start gap-4">
                    <input type="checkbox" v-model="form.available" class="checkbox" />
                    <span class="label-text">可租赁状态</span>
                  </label>
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
                  <!-- 主图标记 -->
                  <div 
                    v-if="image === form.imageUrl" 
                    class="absolute top-2 left-2 badge badge-primary"
                  >
                    主图
                  </div>
                  <!-- 删除按钮 -->
                  <button 
                    type="button"
                    class="btn btn-circle btn-sm btn-error absolute -top-2 -right-2"
                    @click="removeImage(index)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <!-- 设置为主图按钮 -->
                  <button 
                    v-if="image !== form.imageUrl"
                    type="button"
                    class="btn btn-circle btn-sm btn-primary absolute top-2 right-2"
                    @click="form.imageUrl = image"
                    title="设为主图"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                </div>

                <label 
                  v-if="form.images.length < 6"
                  class="aspect-square border-2 border-dashed rounded-box flex items-center justify-center cursor-pointer hover:bg-base-300 relative"
                >
                  <input 
                    type="file" 
                    class="hidden" 
                    accept="image/*"
                    @change="handleImageUpload"
                    :disabled="uploadLoading"
                  />
                  <div v-if="uploadLoading" class="loading loading-spinner loading-md"></div>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                </label>
              </div>
              <p class="text-sm mt-2 text-info">点击"+"添加图片，最多可上传6张。第一张图片将自动设为主图，也可以点击图片右上角的星标设置为主图。</p>
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
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner loading-xs"></span>
              {{ isEdit ? '更新服装' : '添加服装' }}
            </button>
            <button type="button" class="btn" @click="router.back()" :disabled="loading">取消</button>
          </div>
        </form>
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
          <button class="btn btn-primary" @click="handleConfirm">确定</button>
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import clothesService, { clothesStatusMap } from '@/api/services/clothesService'
import fileService from '@/api/services/fileService'
import type { Clothes, ClothesCreateParams } from '@/api/services/clothesService'
import type { FileUploadResponse } from '@/api/services/fileService'
import categoryService from '@/api/services/categoryService'

const route = useRoute()
const router = useRouter()

// 是否为编辑模式
const isEdit = route.name === 'admin-clothing-edit'

// 加载状态
const loading = ref(false)
const uploadLoading = ref(false)

// 消息弹窗数据
const messageTitle = ref('提示')
const messageContent = ref('')

// 确认弹窗数据
const confirmContent = ref('')
const confirmCallback = ref<() => void>(() => {})

// 分类列表
const categories = ref([
  { id: 1, name: '连衣裙' },
  { id: 2, name: '西装' },
  { id: 3, name: '外套' },
  { id: 4, name: '裤装' }
])

// 表单数据
const form = ref({
  id: null as number | null,
  name: '',
  categoryId: '',
  pricePerDay: 0,
  deposit: 0,
  stock: 1,
  status: 'available' as 'available' | 'rented' | 'maintenance',
  images: [] as string[],
  imageUrl: '',
  description: '',
  size: '',
  wearingTips: '',
  available: true
})

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
const showConfirm = (content: string, callback: () => void) => {
  confirmContent.value = content
  confirmCallback.value = callback
  const modal = document.getElementById('confirm-modal') as HTMLDialogElement
  modal?.showModal()
}

// 关闭确认弹窗
const closeConfirmModal = () => {
  const modal = document.getElementById('confirm-modal') as HTMLDialogElement
  modal?.close()
}

// 处理确认操作
const handleConfirm = () => {
  closeConfirmModal()
  confirmCallback.value()
}

// 处理图片上传
const handleImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    try {
      uploadLoading.value = true;
      
      // 调用文件上传服务
      const response = await fileService.uploadImage(file);
      
      // 获取返回的图片URL
      if (response && response.url) {
        // 如果是第一张图片，同时设置为主图URL
        if (form.value.images.length === 0) {
          form.value.imageUrl = response.url;
        }
        
        // 添加到图片数组
        form.value.images.push(response.url);
      }
      
      // 清空input以便可以重复上传同一文件
      (event.target as HTMLInputElement).value = '';
      
    } catch (error) {
      console.error('图片上传失败:', error);
      showMessage('错误', '图片上传失败，请稍后重试');
    } finally {
      uploadLoading.value = false;
    }
  }
}

// 移除图片
const removeImage = (index: number) => {
  // 如果删除的是主图，需要更新imageUrl
  if (form.value.images[index] === form.value.imageUrl && form.value.images.length > 1) {
    // 如果有其他图片，将第一张非当前图片的设为主图
    const remainingImages = [...form.value.images];
    remainingImages.splice(index, 1);
    form.value.imageUrl = remainingImages[0];
  } else if (form.value.images.length === 1) {
    // 如果只有一张图片被删除，清空imageUrl
    form.value.imageUrl = '';
  }
  
  // 从数组中移除图片
  form.value.images.splice(index, 1);
}

// 提交表单
const handleSubmit = async () => {
  try {
    // 表单验证
    if (!form.value.name) {
      showMessage('提示', '请输入服装名称');
      return;
    }
    
    if (!form.value.size) {
      showMessage('提示', '请输入服装尺码');
      return;
    }
    
    if (form.value.pricePerDay <= 0) {
      showMessage('提示', '每日租金必须大于0');
      return;
    }
    
    if (form.value.stock < 0) {
      showMessage('提示', '库存数量不能小于0');
      return;
    }
    
    // 如果没有图片，提示用户
    if (form.value.images.length === 0) {
      showConfirm('还没有上传图片，是否继续保存？', async () => {
        await saveClothes();
      });
      return;
    }
    
    await saveClothes();
  } catch (error: any) {
    console.error('保存失败:', error);
    showMessage('错误', '保存服装信息失败，请稍后重试');
  }
}

// 保存服装信息
const saveClothes = async () => {
  try {
    loading.value = true;
    
    // 准备服装数据
    const clothesData: ClothesCreateParams = {
      name: form.value.name,
      description: form.value.description,
      pricePerDay: form.value.pricePerDay,
      deposit: form.value.deposit,
      stock: form.value.stock,
      status: form.value.status,
      size: form.value.size,
      wearingTips: form.value.wearingTips,
      available: form.value.available
    };
    
    // 设置分类（如果有）
    if (form.value.categoryId) {
      clothesData.categoryId = parseInt(form.value.categoryId as string);
      
      // 获取分类名称
      const category = categories.value.find(c => c.id.toString() === form.value.categoryId);
      if (category) {
        clothesData.category = category.name;
      }
    }
    
    // 设置图片URL
    if (form.value.imageUrl) {
      clothesData.imageUrl = form.value.imageUrl;
    } else if (form.value.images.length > 0) {
      // 如果有图片但没有设置主图，将第一张设为主图
      clothesData.imageUrl = form.value.images[0];
    }
    
    // 设置图片数组
    if (form.value.images.length > 0) {
      clothesData.images = [...form.value.images];
    }
    
    // 根据模式决定是创建还是更新服装
    if (isEdit && form.value.id) {
      // 更新服装
      await clothesService.updateClothes(form.value.id, clothesData);
      showMessage('成功', '服装信息更新成功');
      // 短暂延迟后返回列表页
      setTimeout(() => {
        router.push('/admin/clothing');
      }, 1500);
    } else {
      // 创建服装
      await clothesService.createClothes(clothesData);
      showMessage('成功', '服装添加成功');
      // 短暂延迟后返回列表页
      setTimeout(() => {
        router.push('/admin/clothing');
      }, 1500);
    }
  } catch (error) {
    console.error('保存失败:', error);
    showMessage('错误', '保存服装信息失败，请稍后重试');
  } finally {
    loading.value = false;
  }
}

// 获取服装详情
const fetchClothingDetail = async (id: string) => {
  try {
    loading.value = true;
    
    // 从API获取服装详情
    const clothesId = parseInt(id);
    const clothesDetail = await clothesService.getClothesById(clothesId);
    
    if (clothesDetail) {
      // 填充表单数据
      form.value.id = clothesDetail.id;
      form.value.name = clothesDetail.name;
      form.value.categoryId = clothesDetail.categoryId?.toString() || '';
      form.value.pricePerDay = clothesDetail.pricePerDay || 0;
      form.value.deposit = clothesDetail.deposit || 0;
      form.value.stock = clothesDetail.stock;
      form.value.status = clothesDetail.status || 'available';
      form.value.description = clothesDetail.description || '';
      form.value.size = clothesDetail.size || '';
      form.value.wearingTips = clothesDetail.wearingTips || '';
      form.value.available = clothesDetail.available;
      
      // 处理图片
      form.value.imageUrl = clothesDetail.imageUrl || '';
      
      if (clothesDetail.images && clothesDetail.images.length > 0) {
        form.value.images = [...clothesDetail.images];
      } else if (clothesDetail.imageUrl) {
        form.value.images = [clothesDetail.imageUrl];
      } else {
        form.value.images = [];
      }
    }
  } catch (error) {
    console.error('获取服装详情失败:', error);
    showMessage('错误', '获取服装详情失败，请稍后重试');
  } finally {
    loading.value = false;
  }
}

// 格式化日期
const formatDate = (dateValue: string | number[] | null) => {
  if (!dateValue) return '';
  
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
      return '';
    }
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '';
  }
}

onMounted(async () => {
  // 编辑模式下获取服装详情
  if (isEdit && route.params.id) {
    await fetchClothingDetail(route.params.id as string);
  }
  
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