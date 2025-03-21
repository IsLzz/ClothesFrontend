<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">个人资料</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 左侧个人信息 -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <div class="flex flex-col items-center">
            <div class="avatar mb-4">
              <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img :src="userInfo?.avatar || '/default-avatar.png'" alt="avatar" />
              </div>
            </div>
            <h2 class="text-xl font-bold">{{ userInfo?.username }}</h2>
            <p class="text-gray-500">{{ userInfo?.email }}</p>
          </div>
          
          <div class="divider"></div>
          
          <div class="space-y-2">
            <button class="btn btn-outline btn-block" @click="showEditProfile = true">
              编辑资料
            </button>
            <button class="btn btn-outline btn-block" @click="showChangePassword = true">
              修改密码
            </button>
          </div>
        </div>
      </div>
      
      <!-- 右侧详细信息 -->
      <div class="md:col-span-2 space-y-6">
        <!-- 基本信息卡片 -->
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h3 class="card-title">基本信息</h3>
            <div class="space-y-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">用户名</span>
                </label>
                <input
                  type="text"
                  v-model="form.username"
                  class="input input-bordered"
                  :disabled="!isEditing"
                />
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">手机号</span>
                </label>
                <input
                  type="tel"
                  v-model="form.phone"
                  class="input input-bordered"
                  :disabled="!isEditing"
                />
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">邮箱</span>
                </label>
                <input
                  type="email"
                  v-model="form.email"
                  class="input input-bordered"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- 收货地址卡片 -->
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <h3 class="card-title">收货地址</h3>
              <button class="btn btn-primary btn-sm" @click="showAddAddress = true">
                添加地址
              </button>
            </div>
            
            <div class="space-y-4">
              <div
                v-for="address in addresses"
                :key="address.id"
                class="flex justify-between items-start p-4 border rounded-lg"
              >
                <div>
                  <div class="font-bold">{{ address.name }} {{ address.phone }}</div>
                  <div class="text-gray-600">{{ address.address }}</div>
                </div>
                <div class="space-x-2">
                  <button class="btn btn-ghost btn-sm" @click="editAddress(address)">
                    编辑
                  </button>
                  <button class="btn btn-ghost btn-sm" @click="deleteAddress(address.id)">
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 表单状态
const isEditing = ref(false)
const showEditProfile = ref(false)
const showChangePassword = ref(false)
const showAddAddress = ref(false)

// 表单数据
const form = reactive({
  username: userInfo.value?.username || '',
  email: userInfo.value?.email || '',
  phone: userInfo.value?.phone || ''
})

// 地址数据
interface Address {
  id: number
  name: string
  phone: string
  address: string
}

const addresses = ref<Address[]>([])

// 地址操作
const editAddress = (address: Address) => {
  // 实现编辑地址逻辑
}

const deleteAddress = async (id: number) => {
  // 实现删除地址逻辑
}
</script> 