<template>
  <div class="min-h-[calc(100vh-4rem)] flex flex-col">
    <div class="container mx-auto px-4 py-8 flex-1">
      <h1 class="text-3xl font-bold mb-8 text-center md:text-left">个人资料</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 左侧个人信息卡片 -->
        <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div class="card-body items-center text-center">
            <div class="relative group">
              <div class="avatar mb-6">
                <div class="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img :src="userInfo?.avatar || '/default-avatar.png'" alt="avatar" class="object-cover" />
                </div>
              </div>
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="btn btn-circle btn-sm btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <h2 class="text-2xl font-bold mb-2">{{ userInfo?.username }}</h2>
            <p class="text-base-content/60 mb-6">{{ userInfo?.email }}</p>
            
            <div class="w-full space-y-4">
              <button class="btn btn-primary btn-block gap-2" @click="showEditProfile = true">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                编辑资料
              </button>
              <button class="btn btn-outline btn-block gap-2" @click="showChangePassword = true">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                修改密码
              </button>
            </div>
          </div>
        </div>
        
        <!-- 右侧详细信息 -->
        <div class="md:col-span-2 space-y-8">
          <!-- 基本信息卡片 -->
          <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div class="card-body">
              <div class="flex justify-between items-center mb-6">
                <h3 class="card-title text-xl">基本信息</h3>
                <button class="btn btn-ghost btn-sm" @click="toggleEditing">
                  {{ isEditing ? '保存' : '编辑' }}
                </button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">用户名</span>
                  </label>
                  <input
                    type="text"
                    v-model="form.username"
                    class="input input-bordered"
                    :class="{'input-primary': isEditing}"
                    :disabled="!isEditing"
                  />
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">手机号</span>
                  </label>
                  <input
                    type="tel"
                    v-model="form.phone"
                    class="input input-bordered"
                    :class="{'input-primary': isEditing}"
                    :disabled="!isEditing"
                  />
                </div>
                
                <div class="form-control md:col-span-2">
                  <label class="label">
                    <span class="label-text font-medium">邮箱</span>
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
          <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div class="card-body">
              <div class="flex justify-between items-center mb-6">
                <h3 class="card-title text-xl">收货地址</h3>
                <button class="btn btn-primary btn-sm gap-2" @click="showAddAddress = true">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  添加地址
                </button>
              </div>
              
              <div class="space-y-4">
                <div
                  v-for="address in addresses"
                  :key="address.id"
                  class="card bg-base-200 hover:bg-base-300 transition-colors duration-200"
                >
                  <div class="card-body p-4">
                    <div class="flex justify-between items-start">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <span class="font-bold text-lg">{{ address.name }} {{ address.phone }}</span>
                          <span v-if="address.isDefault" class="badge badge-primary">默认地址</span>
                        </div>
                        <div class="text-base-content/70">{{ address.address }}</div>
                      </div>
                      <div class="flex gap-2 ml-4">
                        <button class="btn btn-ghost btn-sm" @click="editAddress(address)">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button class="btn btn-ghost btn-sm text-error" @click="deleteAddress(address.id)">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑地址模态框 -->
    <dialog :class="{'modal': true, 'modal-open': showAddAddress}">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-lg mb-6">{{ editingAddress ? '编辑地址' : '添加新地址' }}</h3>
        
        <form @submit.prevent="handleAddressSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">收货人姓名</span>
              </label>
              <input
                type="text"
                v-model="addressForm.name"
                class="input input-bordered"
                placeholder="请输入收货人姓名"
                required
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">手机号码</span>
              </label>
              <input
                type="tel"
                v-model="addressForm.phone"
                class="input input-bordered"
                placeholder="请输入手机号码"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">省份</span>
              </label>
              <select 
                v-model="addressForm.province"
                class="select select-bordered w-full"
                required
                @change="handleProvinceChange"
              >
                <option value="">请选择省份</option>
                <option 
                  v-for="province in provinces" 
                  :key="province.code" 
                  :value="province.name"
                >
                  {{ province.name }}
                </option>
              </select>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">城市</span>
              </label>
              <select 
                v-model="addressForm.city"
                class="select select-bordered w-full"
                required
                @change="handleCityChange"
                :disabled="!addressForm.province"
              >
                <option value="">请选择城市</option>
                <option 
                  v-for="city in cities" 
                  :key="city.code" 
                  :value="city.name"
                >
                  {{ city.name }}
                </option>
              </select>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">区/县</span>
              </label>
              <select 
                v-model="addressForm.district"
                class="select select-bordered w-full"
                required
                :disabled="!addressForm.city"
              >
                <option value="">请选择区/县</option>
                <option 
                  v-for="district in districts" 
                  :key="district.code" 
                  :value="district.name"
                >
                  {{ district.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">详细地址</span>
            </label>
            <textarea
              v-model="addressForm.detailAddress"
              class="textarea textarea-bordered h-24"
              placeholder="请输入详细地址，如街道名称、门牌号等"
              required
            ></textarea>
          </div>

          <div class="form-control">
            <label class="label cursor-pointer justify-start gap-2">
              <input 
                type="checkbox" 
                v-model="addressForm.isDefault" 
                class="checkbox checkbox-primary"
              />
              <span class="label-text">设为默认地址</span>
            </label>
          </div>

          <div class="modal-action">
            <button type="button" class="btn" @click="closeAddressModal">取消</button>
            <button type="submit" class="btn btn-primary">确定</button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeAddressModal">关闭</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import axios from 'axios'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 表单状态
const isEditing = ref(false)
const showEditProfile = ref(false)
const showChangePassword = ref(false)
const showAddAddress = ref(false)
const editingAddress = ref<Address | null>(null)

// 表单数据
const form = reactive({
  username: userInfo.value?.username || '',
  email: userInfo.value?.email || '',
  phone: userInfo.value?.phone || ''
})

// 地址表单数据
const addressForm = reactive({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  isDefault: false
})

// 省市区数据接口类型定义
interface RegionData {
  code: string
  name: string
  py: string
  cities?: {
    code: string
    name: string
    py: string
    areas?: {
      code: string
      name: string
      py: string
    }[]
  }[]
}

// 省市区数据
const provinces = ref<RegionData[]>([])
const allRegionData = ref<RegionData[]>([])

// 获取省市区数据
const fetchRegionData = async () => {
  try {
    const response = await axios.get('https://api.roxmotor.top/pb/address')
    if (response.data.code === 0) {
      allRegionData.value = response.data.data
      provinces.value = response.data.data
    }
  } catch (error) {
    console.error('获取省市区数据失败:', error)
  }
}

// 计算当前可选城市列表
const cities = computed(() => {
  if (!addressForm.province) return []
  const province = allRegionData.value.find(p => p.name === addressForm.province)
  return province?.cities || []
})

// 计算当前可选区县列表
const districts = computed(() => {
  if (!addressForm.city) return []
  const province = allRegionData.value.find(p => p.name === addressForm.province)
  const city = province?.cities?.find(c => c.name === addressForm.city)
  return city?.areas || []
})

// 地址数据
interface Address {
  id: number
  name: string
  phone: string
  province: string
  city: string
  district: string
  detailAddress: string
  address: string
  isDefault: boolean
}

const addresses = ref<Address[]>([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '市辖区',
    district: '朝阳区',
    detailAddress: '某某街道某某小区1号楼1单元101室',
    address: '北京市朝阳区某某街道某某小区1号楼1单元101室',
    isDefault: true
  }
])

// 编辑状态切换
const toggleEditing = () => {
  if (isEditing.value) {
    // TODO: 保存修改
    isEditing.value = false
  } else {
    isEditing.value = true
  }
}

// 地址操作
const editAddress = (address: Address) => {
  editingAddress.value = address
  addressForm.name = address.name
  addressForm.phone = address.phone
  addressForm.province = address.province
  addressForm.city = address.city
  addressForm.district = address.district
  addressForm.detailAddress = address.detailAddress
  addressForm.isDefault = address.isDefault
  showAddAddress.value = true
}

const deleteAddress = async (id: number) => {
  if (confirm('确定要删除这个地址吗？')) {
    addresses.value = addresses.value.filter(addr => addr.id !== id)
  }
}

// 关闭地址模态框
const closeAddressModal = () => {
  showAddAddress.value = false
  editingAddress.value = null
  addressForm.name = ''
  addressForm.phone = ''
  addressForm.province = ''
  addressForm.city = ''
  addressForm.district = ''
  addressForm.detailAddress = ''
  addressForm.isDefault = false
}

// 提交地址表单
const handleAddressSubmit = () => {
  const fullAddress = `${addressForm.province}${addressForm.city === '市辖区' ? '' : addressForm.city}${addressForm.district}${addressForm.detailAddress}`
  
  if (editingAddress.value) {
    // 编辑现有地址
    const index = addresses.value.findIndex(addr => addr.id === editingAddress.value?.id)
    if (index !== -1) {
      addresses.value[index] = {
        ...editingAddress.value,
        name: addressForm.name,
        phone: addressForm.phone,
        province: addressForm.province,
        city: addressForm.city,
        district: addressForm.district,
        detailAddress: addressForm.detailAddress,
        address: fullAddress,
        isDefault: addressForm.isDefault
      }
      
      // 如果设为默认地址，需要将其他地址的默认状态取消
      if (addressForm.isDefault) {
        addresses.value.forEach((addr, i) => {
          if (i !== index) {
            addr.isDefault = false
          }
        })
      }
    }
  } else {
    // 添加新地址
    const newAddress = {
      id: Date.now(),
      name: addressForm.name,
      phone: addressForm.phone,
      province: addressForm.province,
      city: addressForm.city,
      district: addressForm.district,
      detailAddress: addressForm.detailAddress,
      address: fullAddress,
      isDefault: addressForm.isDefault
    }
    
    // 如果设为默认地址，需要将其他地址的默认状态取消
    if (addressForm.isDefault) {
      addresses.value.forEach(addr => {
        addr.isDefault = false
      })
    }
    
    addresses.value.push(newAddress)
  }
  closeAddressModal()
}

// 监听省份变化
const handleProvinceChange = () => {
  addressForm.city = ''
  addressForm.district = ''
}

// 监听城市变化
const handleCityChange = () => {
  addressForm.district = ''
}

// 页面加载时获取省市区数据
onMounted(() => {
  fetchRegionData()
})
</script> 