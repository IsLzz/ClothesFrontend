<template>
  <div class="min-h-screen bg-base-100">
    <!-- 导航栏 -->
    <nav class="navbar bg-base-200 shadow-lg">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><router-link to="/" class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              首页
            </router-link></li>
            <li><router-link to="/cart" class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              购物车
            </router-link></li>
            <li><router-link to="/orders" class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              我的订单
            </router-link></li>
          </ul>
        </div>
        <router-link to="/" class="btn btn-ghost text-xl gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          服装租赁
        </router-link>
      </div>
      
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1 gap-2">
          <li>
            <router-link to="/" class="flex items-center gap-2 hover:bg-primary hover:text-primary-content">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              首页
            </router-link>
          </li>
          <li>
            <router-link to="/cart" class="flex items-center gap-2 hover:bg-primary hover:text-primary-content">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              购物车
            </router-link>
          </li>
          <li>
            <router-link to="/orders" class="flex items-center gap-2 hover:bg-primary hover:text-primary-content">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              我的订单
            </router-link>
          </li>
        </ul>
      </div>
      
      <div class="navbar-end">
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 stroke-current" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <div class="dropdown-content bg-base-200 text-base-content rounded-box top-px max-h-[70vh] w-56 overflow-y-auto shadow-2xl mt-4">
            <div class="grid grid-cols-1 gap-3 p-3" tabindex="0">
              <div v-for="theme in themeStore.themes" 
                :key="theme"
                class="outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 cursor-pointer"
                :class="{ 'outline': theme === themeStore.currentTheme }"
                @click="themeStore.setTheme(theme)"
              >
                <div :data-theme="theme" class="bg-base-100 text-base-content w-full font-sans hover:bg-base-200 transition-colors">
                  <div class="grid grid-cols-5 grid-rows-3">
                    <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                      <div class="flex-grow">
                        <div class="font-bold text-sm capitalize">{{ theme }}</div>
                        <div class="text-xs opacity-70">
                          {{ theme === themeStore.currentTheme ? '当前主题' : '点击切换' }}
                        </div>
                      </div>
                      <div class="flex flex-shrink-0 flex-wrap gap-1">
                        <div class="bg-primary w-2 rounded"></div>
                        <div class="bg-secondary w-2 rounded"></div>
                        <div class="bg-accent w-2 rounded"></div>
                        <div class="bg-neutral w-2 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dropdown dropdown-end" v-if="isLoggedIn">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img :src="userInfo?.avatar || '/default-avatar.png'" alt="avatar" />
            </div>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><router-link to="/profile">个人资料</router-link></li>
            <li><a @click="handleLogout">退出登录</a></li>
          </ul>
        </div>
        <router-link v-else to="/auth/login" class="btn btn-primary">登录</router-link>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="container mx-auto px-4 py-8">
      <router-view></router-view>
    </main>

    <!-- 页脚 -->
    <footer class="footer footer-center p-4 bg-base-200 text-base-content">
      <div>
        <p>Copyright © 2024 - All rights reserved by Fashion Rental</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'

const userStore = useUserStore()
const router = useRouter()
const { isLoggedIn, userInfo } = storeToRefs(userStore)
const themeStore = useThemeStore()

const handleLogout = async () => {
  await userStore.logout()
  router.push('/auth/login')
}
</script> 