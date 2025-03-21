<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center text-2xl font-bold mb-6">登录</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">邮箱</span>
            </label>
            <input
              type="email"
              v-model="email"
              placeholder="请输入邮箱"
              class="input input-bordered"
              required
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">密码</span>
            </label>
            <input
              type="password"
              v-model="password"
              placeholder="请输入密码"
              class="input input-bordered"
              required
            />
            <label class="label">
              <router-link
                to="/auth/forgot-password"
                class="label-text-alt link link-hover"
              >
                忘记密码？
              </router-link>
            </label>
          </div>
          
          <div class="form-control mt-6">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isLoading"
            >
              {{ isLoading ? '登录中...' : '登录' }}
            </button>
          </div>
        </form>
        
        <div class="divider">或者</div>
        
        <router-link
          to="/auth/register"
          class="btn btn-outline btn-block"
        >
          注册新账号
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    const success = await userStore.login(email.value, password.value)
    if (success) {
      router.push('/')
    }
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script> 