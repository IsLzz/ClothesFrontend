<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center text-2xl font-bold mb-6">注册账号</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">用户名</span>
            </label>
            <input
              type="text"
              v-model="username"
              placeholder="请输入用户名"
              class="input input-bordered"
              required
            />
          </div>
          
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
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">确认密码</span>
            </label>
            <input
              type="password"
              v-model="confirmPassword"
              placeholder="请再次输入密码"
              class="input input-bordered"
              required
            />
          </div>
          
          <div class="form-control mt-6">
            <button
              type="submit"
              class="btn btn-primary w-full"
              :disabled="isLoading || !isFormValid"
            >
              {{ isLoading ? '注册中...' : '注册' }}
            </button>
          </div>
        </form>
        
        <div class="divider">或者</div>
        
        <router-link
          to="/auth/login"
          class="btn btn-outline btn-block"
        >
          返回登录
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import request from '@/api/request'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const isFormValid = computed(() => {
  return (
    username.value.length >= 3 &&
    email.value.includes('@') &&
    password.value.length >= 6 &&
    password.value === confirmPassword.value
  )
})

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  try {
    isLoading.value = true
    const response = await request.post('/auth/register', {
      username: username.value,
      email: email.value,
      password: password.value
    })
    
    // 注册成功后自动登录
    await userStore.login(email.value, password.value)
    router.push('/')
  } catch (error) {
    console.error('Registration failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script> 