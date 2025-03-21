<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col gap-8">
      <!-- 分类筛选 -->
      <div class="flex justify-center gap-4">
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

      <!-- 服装列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="item in clothingList" :key="item.id" class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <figure class="px-4 pt-4">
            <img :src="item.image" :alt="item.name" class="rounded-xl h-64 w-full object-cover" />
          </figure>
          <div class="card-body">
            <h2 class="card-title">{{ item.name }}</h2>
            <p class="text-base-content/70">{{ item.description }}</p>
            <div class="flex justify-between items-center mt-4">
              <span class="text-xl font-bold text-primary">¥{{ item.price }}/天</span>
              <button class="btn btn-primary" @click="viewDetail(item.id)">查看详情</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="text-center" v-if="hasMore">
        <button 
          class="btn btn-outline btn-wide"
          :class="{ 'loading': isLoading }"
          @click="loadMore"
        >
          加载更多
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 分类数据
const categories = ref([
  { id: 1, name: '正装' },
  { id: 2, name: '休闲装' },
  { id: 3, name: '民族服装' },
  { id: 4, name: '礼服' }
])

// 当前选中的分类
const currentCategory = ref<number | null>(null)

// 服装列表数据
const clothingList = ref([
  {
    id: 1,
    name: '黑色西装套装',
    description: '经典黑色西装，适合商务场合',
    price: 99,
    image: 'https://picsum.photos/400/300'
  },
  {
    id: 2,
    name: '白色连衣裙',
    description: '优雅白色连衣裙，适合各种场合',
    price: 79,
    image: 'https://picsum.photos/400/301'
  },
  // 更多示例数据...
])

const isLoading = ref(false)
const hasMore = ref(true)
const page = ref(1)

// 处理分类切换
const handleCategoryChange = (categoryId: number | null) => {
  currentCategory.value = categoryId
  // 更新 URL 参数
  router.push({
    path: '/clothing',
    query: categoryId ? { category: categoryId } : {}
  })
  // 重置列表数据
  page.value = 1
  // TODO: 重新加载数据
}

// 查看详情
const viewDetail = (id: number) => {
  router.push(`/clothing/${id}`)
}

// 加载更多
const loadMore = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    page.value++
    // TODO: 加载更多数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 模拟没有更多数据
    if (page.value >= 3) {
      hasMore.value = false
    }
  } finally {
    isLoading.value = false
  }
}

// 监听路由参数变化
watch(
  () => route.query.category,
  (newCategory) => {
    currentCategory.value = newCategory ? Number(newCategory) : null
  }
)

// 初始化
onMounted(() => {
  // 从 URL 参数中获取分类
  const categoryId = route.query.category
  if (categoryId) {
    currentCategory.value = Number(categoryId)
  }
})
</script> 