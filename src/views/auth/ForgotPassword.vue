<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center text-2xl font-bold mb-6">找回密码</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">邮箱</span>
            </label>
            <input
              type="email"
              v-model="email"
              placeholder="请输入注册时使用的邮箱"
              class="input input-bordered"
              required
            />
          </div>
          
          <div class="form-control mt-6">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isLoading"
            >
              {{ isLoading ? '发送中...' : '发送重置密码邮件' }}
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/api/request'

const router = useRouter()
const email = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    await request.post('/auth/forgot-password', {
      email: email.value
    })
    // 显示成功消息
    alert('重置密码邮件已发送，请查收')
    router.push('/auth/login')
  } catch (error) {
    console.error('Failed to send reset email:', error)
  } finally {
    isLoading.value = false
  }
}
</script> 