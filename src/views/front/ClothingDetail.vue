<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 商品基本信息区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <!-- 左侧商品图片 -->
      <div class="space-y-4">
        <div class="aspect-square rounded-lg overflow-hidden bg-base-200">
          <img
            :src="clothing?.mainImage || '/placeholder.png'"
            :alt="clothing?.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="(image, index) in clothing?.images"
            :key="index"
            class="aspect-square rounded-lg overflow-hidden bg-base-200 cursor-pointer hover:ring-2 hover:ring-primary"
            @click="selectImage(image)"
          >
            <img :src="image" :alt="clothing?.title" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <!-- 右侧商品信息 -->
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-bold mb-2">{{ clothing?.title }}</h1>
          <p class="text-base-content/70">{{ clothing?.description }}</p>
        </div>

        <div class="divider"></div>

        <div class="space-y-4">
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-bold text-primary">¥{{ clothing?.price }}</span>
            <span class="text-base-content/70">/ 天</span>
          </div>

          <div class="flex items-center gap-4">
            <div class="badge badge-outline">{{ clothing?.category }}</div>
            <div class="badge badge-outline">{{ clothing?.size }}</div>
            <div class="badge badge-outline">{{ clothing?.condition }}</div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- 租赁选项 -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold">租赁选项</h3>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">租赁天数</span>
            </label>
            <div class="flex items-center gap-4">
              <input
                type="number"
                v-model="rentalDays"
                class="input input-bordered w-24"
                min="1"
                max="30"
              />
              <span class="text-base-content/70">天</span>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">取件日期</span>
            </label>
            <button 
              popovertarget="calendar-popover" 
              class="input input-bordered text-left"
              :class="{'input-error': !pickupDate}"
            >
              {{ pickupDate ? new Date(pickupDate).toLocaleDateString() : '请选择取件日期' }}
            </button>
            <div 
              popover 
              id="calendar-popover" 
              class="dropdown bg-base-100 rounded-box shadow-lg"
            >
              <calendar-date 
                class="cally" 
                :min="minPickupDate"
                :value="pickupDate"
                @change="handleDateChange"
              >
                <svg aria-label="Previous" class="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
                </svg>
                <svg aria-label="Next" class="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                </svg>
                <calendar-month></calendar-month>
              </calendar-date>
            </div>
          </div>

          <div class="alert shadow-lg">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <div>
                <h3 class="font-bold">租赁费用</h3>
                <div class="text-xs">总计：¥{{ totalPrice }}</div>
              </div>
            </div>
          </div>

          <button class="btn btn-primary btn-block gap-2" @click="handleRent">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            立即租赁
          </button>
        </div>
      </div>
    </div>

    <!-- 商品详情区域 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="tabs tabs-boxed mb-6">
          <a 
            class="tab" 
            :class="{'tab-active': activeTab === 'detail'}"
            @click="activeTab = 'detail'"
          >
            商品详情
          </a>
          <a 
            class="tab" 
            :class="{'tab-active': activeTab === 'size'}"
            @click="activeTab = 'size'"
          >
            尺码信息
          </a>
          <a 
            class="tab" 
            :class="{'tab-active': activeTab === 'service'}"
            @click="activeTab = 'service'"
          >
            租赁服务
          </a>
        </div>

        <div v-if="activeTab === 'detail'" class="space-y-4">
          <div class="prose max-w-none">
            <h4>商品描述</h4>
            <p>{{ clothing?.detailDescription }}</p>
            
            <h4>商品特点</h4>
            <ul>
              <li v-for="(feature, index) in clothing?.features" :key="index">
                {{ feature }}
              </li>
            </ul>

            <h4>商品图片</h4>
            <div class="grid grid-cols-2 gap-4">
              <img
                v-for="(image, index) in clothing?.detailImages"
                :key="index"
                :src="image"
                :alt="clothing?.title"
                class="rounded-lg"
              />
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'size'" class="space-y-4">
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>尺码</th>
                  <th>胸围</th>
                  <th>腰围</th>
                  <th>臀围</th>
                  <th>衣长</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(size, index) in clothing?.sizeChart" :key="index">
                  <td>{{ size.name }}</td>
                  <td>{{ size.bust }}</td>
                  <td>{{ size.waist }}</td>
                  <td>{{ size.hip }}</td>
                  <td>{{ size.length }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="activeTab === 'service'" class="space-y-6">
          <div class="prose max-w-none">
            <h4>租赁说明</h4>
            <ul>
              <li>租赁周期：最短1天，最长30天</li>
              <li>取件方式：门店自取或快递配送</li>
              <li>押金说明：根据商品价值收取相应押金，归还后退还</li>
              <li>洗护服务：专业干洗，确保卫生</li>
            </ul>

            <h4>温馨提示</h4>
            <ul>
              <li>请在使用前仔细检查商品</li>
              <li>爱护商品，如有损坏需照价赔偿</li>
              <li>建议提前3天预约租赁</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Toast 提示 -->
  <div class="toast toast-top toast-end z-[1000]">
    <div 
      v-show="showToast"
      class="alert shadow-lg"
      :class="[
        {
          'alert-info': toastType === 'info',
          'alert-success': toastType === 'success',
          'alert-warning': toastType === 'warning',
          'alert-error': toastType === 'error'
        },
        'transition-all duration-300 ease-in-out',
        showToast ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      ]"
    >
      <div class="flex items-center gap-2">
        <!-- 不同类型显示不同图标 -->
        <svg v-if="toastType === 'info'" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <svg v-if="toastType === 'success'" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <svg v-if="toastType === 'warning'" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <svg v-if="toastType === 'error'" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span class="flex-1">{{ toastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import 'cally'

// 声明自定义元素类型
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'calendar-date': any
      'calendar-month': any
    }
  }
}

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 模拟商品数据
const clothing = ref({
  id: 1,
  title: '优雅黑色晚礼服',
  description: '简约优雅的黑色晚礼服，适合各种正式场合',
  price: 199,
  mainImage: '/dress1.jpg',
  images: ['/dress1.jpg', '/dress2.jpg', '/dress3.jpg', '/dress4.jpg'],
  category: '晚礼服',
  size: 'M',
  condition: '9成新',
  detailDescription: '这是一件设计简约但不失优雅的黑色晚礼服。采用高质量面料制作，穿着舒适，适合各种正式场合。',
  features: [
    '高质量面料',
    '简约优雅设计',
    '适合正式场合',
    '舒适合体'
  ],
  detailImages: ['/detail1.jpg', '/detail2.jpg', '/detail3.jpg', '/detail4.jpg'],
  sizeChart: [
    { name: 'S', bust: '84cm', waist: '66cm', hip: '90cm', length: '150cm' },
    { name: 'M', bust: '88cm', waist: '70cm', hip: '94cm', length: '152cm' },
    { name: 'L', bust: '92cm', waist: '74cm', hip: '98cm', length: '154cm' }
  ]
})

// 租赁相关
const rentalDays = ref(1)
const pickupDate = ref('')
const activeTab = ref('detail')

// 计算最早可取件日期（明天）
const minPickupDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

// 计算总价
const totalPrice = computed(() => {
  return (clothing.value?.price || 0) * rentalDays.value
})

// 选择图片
const selectImage = (image: string) => {
  if (clothing.value) {
    clothing.value.mainImage = image
  }
}

// Toast 相关
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'info' | 'success' | 'warning' | 'error'>('info')
let toastTimer: number | null = null

// 显示 Toast 的函数
const showToastMessage = (
  message: string, 
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  duration?: number
) => {
  // 根据消息类型设置默认持续时间
  const defaultDurations = {
    info: 3000,
    success: 3000,
    warning: 3000,
    error: 3000
  }
  
  const displayDuration = duration || defaultDurations[type]
  
  // 如果已经有 Toast 显示，先清除之前的定时器
  if (showToast.value) {
    showToast.value = false
    if (toastTimer) clearTimeout(toastTimer)
    setTimeout(() => {
      showToastMessage(message, type, displayDuration)
    }, 300)
    return
  }

  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  // 设置新的定时器
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    showToast.value = false
  }, displayDuration)
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (toastTimer) clearTimeout(toastTimer)
})

// 处理租赁
const handleRent = () => {
  if (!userStore.isLoggedIn) {
    showToastMessage('请先登录后再进行租赁', 'warning', 4000)
    setTimeout(() => {
      router.push('/login')
    }, 2500)
    return
  }

  if (!pickupDate.value) {
    showToastMessage('请选择取件日期', 'error')
    return
  }

  // TODO: 处理租赁逻辑
  showToastMessage('租赁申请已提交，请等待确认', 'success')
  console.log('租赁信息：', {
    clothingId: clothing.value?.id,
    rentalDays: rentalDays.value,
    pickupDate: pickupDate.value,
    totalPrice: totalPrice.value
  })
}

// 处理日期选择
const handleDateChange = (event: any) => {
  pickupDate.value = event.target.value
  showToastMessage(
    '已选择取件日期：' + new Date(event.target.value).toLocaleDateString(), 
    'info',
    4000
  )
}
</script>

<style scoped>
.cally {
  --cally-color-primary: hsl(var(--p));
  --cally-color-primary-hover: hsl(var(--pf));
  --cally-color-primary-content: hsl(var(--pc));
  --cally-color-base: hsl(var(--b1));
  --cally-color-base-hover: hsl(var(--b2));
  --cally-color-base-content: hsl(var(--bc));
  --cally-border-radius: var(--rounded-btn, 0.5rem);
  --cally-font-family: inherit;
  padding: 1rem;
}

.cally::part(day) {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 0.875rem;
}

.cally::part(day-selected) {
  background-color: hsl(var(--p));
  color: hsl(var(--pc));
}

.cally::part(day-today) {
  border-color: hsl(var(--p));
}

.cally::part(month-title) {
  font-size: 1rem;
  font-weight: 600;
}

[popover] {
  padding: 0;
  border: none;
  border-radius: var(--rounded-box, 1rem);
  box-shadow: var(--shadow-lg);
}

.toast {
  position: fixed;
  pointer-events: none;
}

.alert {
  pointer-events: auto;
  width: auto;
  max-width: 90vw;
  padding: 1rem;
  border-radius: var(--rounded-box, 1rem);
  display: flex;
  align-items: center;
}

.transition-all {
  transition-property: all;
}

.duration-300 {
  transition-duration: 300ms;
}

.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
