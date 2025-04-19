<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col gap-8">
      <!-- 分类筛选 -->
      <div class="flex justify-center gap-4 flex-wrap">
        <button
          class="btn btn-outline"
          :class="{ 'btn-primary': !currentCategory }"
          @click="handleCategoryChange(null)"
        >
          全部
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          class="btn btn-outline"
          :class="{ 'btn-primary': currentCategory === category.id }"
          @click="handleCategoryChange(category.id)"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- 加载中状态 -->
      <div v-if="isLoading && !clothingList.length" class="flex justify-center py-12">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <!-- 无数据状态 -->
      <div v-else-if="!isLoading && !clothingList.length" class="text-center py-12">
        <div class="text-base-content/50 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p>暂无数据</p>
        </div>
        <button class="btn btn-primary" @click="loadData()">刷新试试</button>
      </div>

      <!-- 服装列表 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="item in clothingList" :key="item.id" class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <figure class="px-4 pt-4">
            <img :src="item.imageUrl || 'https://via.placeholder.com/400/300'" :alt="item.name" class="rounded-xl h-64 w-full object-cover" />
          </figure>
          <div class="card-body">
            <h2 class="card-title">{{ item.name }}</h2>
            <p class="text-base-content/70 line-clamp-2">{{ item.description || '暂无描述' }}</p>
            <div class="flex justify-between items-center mt-4">
              <span class="text-xl font-bold text-primary">¥{{ item.pricePerDay }}/天</span>
              <div class="card-actions justify-end">
                <button @click="addToCart(item)" class="btn btn-outline btn-primary btn-sm">
                  加入购物车
                </button>
                <button class="btn btn-primary btn-sm" @click="viewDetail(item.id)">查看详情</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="text-center" v-if="hasMore">
        <button 
          class="btn btn-outline btn-wide"
          :class="{ 'loading': isLoading }"
          :disabled="isLoading"
          @click="loadMore"
        >
          {{ isLoading ? '加载中...' : '加载更多' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import clothesService from "@/api/services/clothesService.ts"
import type { Clothes, PaginatedResponse } from "@/api/services/clothesService.ts"
import type { Category } from "@/api/services/categoryService.ts"
import categoryService from "@/api/services/categoryService.ts"
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

// 分类数据
const categories = ref<Category[]>([])
const loading = ref(false)

// 当前选中的分类
const currentCategory = ref<number | null>(null)

// 服装列表数据
const clothingList = ref<Clothes[]>([])
const isLoading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const pageSize = ref(12)
const total = ref(0)

// 购物车提示状态
const cartMessage = ref('')
const showCartMessage = ref(false)

// 加入购物车
const addToCart = (item: any) => {
  // 构建购物车项数据
  const cartItem = {
    id: item.id,
    name: item.name,
    image: item.imageUrl || 'https://via.placeholder.com/80',
    size: item.size || 'M', // 默认尺码
    price: item.pricePerDay,
    deposit: Math.round(item.pricePerDay * 5), // 押金示例：日租金的5倍
    days: 3, // 默认租赁3天
    clothesId: item.id
  }
  
  // 添加到购物车
  cartStore.addItem(cartItem)
  cartStore.saveCart()
  
  // 显示成功提示
  alert('已添加到租赁车！')
}

// 获取分类数据
const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await categoryService.getAllCategories()
    if (response && response.length > 0) {
      categories.value = response
    } else {
      // 如果API返回失败，使用默认分类数据
      categories.value = [
        { id: 1, name: '正装' } as Category,
        { id: 2, name: '休闲装' } as Category,
        { id: 3, name: '民族服装' } as Category,
        { id: 4, name: '礼服' } as Category
      ]
    }
  } catch (error) {
    console.error('获取分类失败:', error)
    // 如果API失败，使用默认分类数据
    categories.value = [
      { id: 1, name: '正装' } as Category,
      { id: 2, name: '休闲装' } as Category,
      { id: 3, name: '民族服装' } as Category,
      { id: 4, name: '礼服' } as Category
    ]
  } finally {
    loading.value = false
  }
}

// 获取服装列表数据
const loadData = async (append = false) => {
  if (isLoading.value) return
  isLoading.value = true
  
  try {
    // 如果不是追加数据，重置列表
    if (!append) {
      clothingList.value = []
      page.value = 1
    }
    
    // 构建查询参数
    const params: any = {
      page: page.value,
      pageSize: pageSize.value
    }
    
    // 如果有分类筛选，添加分类ID
    if (currentCategory !== null && currentCategory.value) {
      params.category = currentCategory.value
    }
    
    // 调用API获取服装列表
    const response = await clothesService.getAllClothes(params.page, params.pageSize, { 
      categoryId: params.category 
    })
    
    console.log('服装列表数据:', response)
    
    if (response?.items) {
      // 如果是追加数据，合并数组
      if (append) {
        clothingList.value = [...clothingList.value, ...response.items]
      } else {
        clothingList.value = response.items
      }
      
      total.value = response.total || 0
      
      // 判断是否还有更多数据
      hasMore.value = clothingList.value.length < total.value
    } else {
      throw new Error('获取服装列表失败')
    }
  } catch (error) {
    console.error('获取服装列表失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 处理分类切换
const handleCategoryChange = (categoryId: number | null) => {
  currentCategory.value = categoryId
  // 更新 URL 参数
  router.push({
    path: '/clothing',
    query: categoryId ? { category: categoryId } : {}
  })
  // 重置列表数据
  loadData()
}

// 查看详情
const viewDetail = (id: number) => {
  router.push(`/clothing/${id}`)
}

// 加载更多
const loadMore = async () => {
  if (isLoading.value || !hasMore.value) return
  page.value++
  await loadData(true)
}

// 监听路由参数变化
watch(
  () => route.query.category,
  (newCategory) => {
    currentCategory.value = newCategory ? Number(newCategory) : null
    loadData()
  }
)

// 初始化
onMounted(() => {
  // 获取分类数据
  fetchCategories()
  
  // 从 URL 参数中获取分类
  const categoryId = route.query.category
  if (categoryId) {
    currentCategory.value = Number(categoryId)
  }
  
  // 加载服装列表数据
  loadData()
})
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

.btn {
  transition: all 0.3s ease;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 