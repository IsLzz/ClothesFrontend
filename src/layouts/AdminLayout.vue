<template>
  <div class="min-h-screen  bg-base-200">
    <!-- 侧边栏 -->
    <div class="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" class="drawer-toggle" />
      
      <div class="drawer-content flex flex-col">
        <!-- 顶部导航栏 -->
        <div class="navbar bg-base-100 lg:hidden sticky top-0 z-30 shadow-sm">
          <div class="flex-none">
            <label for="admin-drawer" class="btn btn-square btn-ghost drawer-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div class="flex-1">
            <span class="text-xl font-bold">后台管理</span>
          </div>
        </div>

        <!-- 主要内容 -->
        <main class="flex-1 p-4 lg:p-6 transition-all duration-300 bg-base-100">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
      </div>
      
      <div class="drawer-side">
        <label for="admin-drawer" class="drawer-overlay"></label>
        <div class="menu w-64 min-h-full bg-base-100 shadow-lg">
          <!-- 侧边栏头部 -->
          <div class="px-6 py-4 border-b border-base-200">
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="w-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  <img :src="userInfo?.avatar || '/default-avatar.png'" alt="avatar" />
                </div>
              </div>
              <div>
                <div class="font-bold text-base">{{ userInfo?.nickname || userInfo?.account }}</div>
                <div class="text-xs text-base-content/60">管理员</div>
              </div>
            </div>
          </div>
          
          <!-- 导航菜单 -->
          <div class="px-3 py-4">
            <ul class="space-y-1">
              <li v-for="(item, index) in menuItems" :key="index">
                <router-link 
                  :to="item.path" 
                  class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 text-base-content/70 hover:text-primary"
                  :class="{ 'text-primary font-medium': route.path === item.path }"
                >
                  <component :is="components[item.icon]" class="h-5 w-5" />
                  {{ item.title }}
                </router-link>
              </li>
            </ul>
          </div>
          
          <!-- 底部操作 -->
          <div class="absolute bottom-0 left-0 right-0 p-3 border-t border-base-200">
            <a @click="handleLogout" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-error hover:text-error/80 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
              </svg>
              退出登录
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { h, defineComponent } from 'vue'
import type { Component } from 'vue'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const { userInfo } = storeToRefs(userStore)

interface SvgComponents {
  [key: string]: {
    template: string
  }
}

interface ComponentMap {
  [key: string]: Component
}

const svgComponents: SvgComponents = {
  'svg-dashboard': {
    template: `
      <svg xmlns="http://www.w3.org/2000/svg" :class="$attrs.class" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM8 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4zM15 3a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1h-2z" />
      </svg>
    `
  },
  'svg-clothing': {
    template: `
      <svg xmlns="http://www.w3.org/2000/svg" :class="$attrs.class" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" />
      </svg>
    `
  },
  'svg-orders': {
    template: `
      <svg xmlns="http://www.w3.org/2000/svg" :class="$attrs.class" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
      </svg>
    `
  },
  'svg-users': {
    template: `
      <svg xmlns="http://www.w3.org/2000/svg" :class="$attrs.class" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    `
  },
  'svg-categories': {
    template: `
      <svg xmlns="http://www.w3.org/2000/svg" :class="$attrs.class" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
      </svg>
    `
  },
  'svg-rentals': {
    template: `
      <svg xmlns="http://www.w3.org/2000/svg" :class="$attrs.class" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
        <path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd" />
      </svg>
    `
  }
}

const components: ComponentMap = {}
Object.entries(svgComponents).forEach(([name, component]) => {
  components[name] = defineComponent({
    inheritAttrs: true,
    setup() {
      return () => h('div', { innerHTML: component.template })
    }
  })
})

const menuItems = [
  {
    title: '仪表盘',
    path: '/admin',
    icon: 'svg-dashboard'
  },
  {
    title: '服装管理',
    path: '/admin/clothing',
    icon: 'svg-clothing'
  },
  {
    title: '订单管理',
    path: '/admin/orders',
    icon: 'svg-orders'
  },
  {
    title: '用户管理',
    path: '/admin/users',
    icon: 'svg-users'
  },
  {
    title: '分类管理',
    path: '/admin/categories',
    icon: 'svg-categories'
  },
  {
    title: '租赁管理',
    path: '/admin/rentals',
    icon: 'svg-rentals'
  }
]

const handleLogout = async () => {
  await userStore.logout()
  router.push('/auth/login')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.avatar img {
  @apply transition-all duration-300;
}


</style> 