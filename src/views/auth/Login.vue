<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 p-4">
    <div class="max-w-md w-full">
      <!-- 欢迎标题 -->
      <div class="text-center mb-8">
        <h1 class="text-5xl font-bold mb-3 text-primary">欢迎回来</h1>
        <p class="text-lg text-base-content/70">登录您的账号以继续使用时尚租赁服务</p>
      </div>

      <!-- 登录卡片 -->
      <div class="card bg-base-100 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
        <div class="card-body p-8">
          <!-- 品牌Logo -->
          <div class="flex justify-center mb-8">
            <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- 账户密码登录表单 -->
            <template v-if="loginType === 'password'">
              <div class="form-control">
                <label class="label">
                  <span class="label-text text-base font-medium">账户</span>
                </label>
                <div class="relative group">
                  <input
                    type="text"
                    v-model="account"
                    placeholder="请输入邮箱或手机号"
                    class="input input-bordered w-full pl-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    :class="{
                      'input-error': accountError && isAccountTouched,
                      'input-success': !accountError && isAccountTouched && account,
                      'hover:input-primary': !accountError && !isAccountTouched
                    }"
                    required
                    @blur="handleAccountBlur"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 group-hover:text-primary transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text text-base font-medium">密码</span>
                </label>
                <div class="relative group">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    placeholder="请输入密码"
                    class="input input-bordered w-full pl-10 pr-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    :class="{
                      'input-error': passwordError && isPasswordTouched,
                      'input-success': !passwordError && isPasswordTouched && password,
                      'hover:input-primary': !passwordError && !isPasswordTouched
                    }"
                    required
                    @blur="handlePasswordBlur"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 group-hover:text-primary transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <button 
                    type="button"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-primary transition-colors duration-300"
                    @click="togglePasswordVisibility"
                  >
                    <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
                <label class="label">
                  <router-link
                    to="/auth/forgot-password"
                    class="label-text-alt link link-primary hover:link-primary-focus transition-colors duration-300"
                  >
                    忘记密码？
                  </router-link>
                </label>
              </div>
            </template>

            <!-- 邮箱验证码登录表单 -->
            <template v-if="loginType === 'emailCode'">
              <div class="form-control">
                <label class="label">
                  <span class="label-text text-base font-medium">邮箱</span>
                </label>
                <div class="relative group">
                  <input
                    type="email"
                    v-model="email"
                    placeholder="请输入邮箱"
                    class="input input-bordered w-full pl-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    :class="{
                      'input-error': emailError && isEmailTouched,
                      'input-success': !emailError && isEmailTouched && email,
                      'hover:input-primary': !emailError && !isEmailTouched
                    }"
                    required
                    @blur="handleEmailBlur"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 group-hover:text-primary transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text text-base font-medium">验证码</span>
                </label>
                <div class="flex gap-4">
                  <div class="relative group flex-1">
                    <input
                      type="text"
                      v-model="emailCode"
                      placeholder="请输入验证码"
                      class="input input-bordered w-full pl-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                      :class="{
                        'input-error': emailCodeError && isEmailCodeTouched,
                        'input-success': !emailCodeError && isEmailCodeTouched && emailCode,
                        'hover:input-primary': !emailCodeError && !isEmailCodeTouched
                      }"
                      required
                      @blur="handleEmailCodeBlur"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 group-hover:text-primary transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <button 
                    type="button" 
                    class="btn btn-outline w-32 hover:btn-primary transition-colors duration-300"
                    :class="{ 'btn-disabled': emailCountdown > 0 }"
                    @click="sendEmailCode"
                  >
                    {{ emailCountdown > 0 ? `${emailCountdown}秒后重试` : '获取验证码' }}
                  </button>
                </div>
              </div>
            </template>

            <!-- 手机验证码登录表单 -->
            <template v-if="loginType === 'phoneCode'">
              <div class="form-control">
                <label class="label">
                  <span class="label-text text-base font-medium">手机号</span>
                </label>
                <div class="relative group">
                  <input
                    type="tel"
                    v-model="phone"
                    placeholder="请输入手机号"
                    class="input input-bordered w-full pl-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    :class="{
                      'input-error': phoneError && isPhoneTouched,
                      'input-success': !phoneError && isPhoneTouched && phone,
                      'hover:input-primary': !phoneError && !isPhoneTouched
                    }"
                    required
                    @blur="handlePhoneBlur"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 group-hover:text-primary transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text text-base font-medium">验证码</span>
                </label>
                <div class="flex gap-4">
                  <div class="relative group flex-1">
                    <input
                      type="text"
                      v-model="phoneCode"
                      placeholder="请输入验证码"
                      class="input input-bordered w-full pl-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                      :class="{
                        'input-error': phoneCodeError && isPhoneCodeTouched,
                        'input-success': !phoneCodeError && isPhoneCodeTouched && phoneCode,
                        'hover:input-primary': !phoneCodeError && !isPhoneCodeTouched
                      }"
                      required
                      @blur="handlePhoneCodeBlur"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 group-hover:text-primary transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <button 
                    type="button" 
                    class="btn btn-outline w-32 hover:btn-primary transition-colors duration-300"
                    :class="{ 'btn-disabled': phoneCountdown > 0 }"
                    @click="sendPhoneCode"
                  >
                    {{ phoneCountdown > 0 ? `${phoneCountdown}秒后重试` : '获取验证码' }}
                  </button>
                </div>
              </div>
            </template>

            <!-- 记住我选项（仅在账密登录时显示） -->
            <div class="flex items-center" v-if="loginType === 'password'">
              <input type="checkbox" v-model="rememberMe" class="checkbox checkbox-primary checkbox-sm" />
              <span class="ml-2 text-sm">记住我</span>
            </div>

            <!-- 登录按钮 -->
            <div class="form-control mt-8">
              <button
                type="submit"
                class="btn btn-primary w-full h-12 text-lg font-medium"
                :class="{ 'loading': isLoading }"
                :disabled="isLoading"
              >
                <span v-if="!isLoading">登录</span>
              </button>
            </div>
          </form>
          
          <div class="divider my-8">登录方式</div>
          
          <!-- 登录方式切换 -->
          <div class="flex justify-center space-x-3 mb-6">
            <button 
              class="btn btn-outline flex-1 gap-2 hover:btn-primary transition-colors duration-300 text-sm whitespace-nowrap"
              :class="{ 'btn-primary': loginType === 'password' }"
              @click="loginType = 'password'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              账密登录
            </button>
            <button 
              class="btn btn-outline flex-1 gap-2 hover:btn-primary transition-colors duration-300 text-sm whitespace-nowrap"
              :class="{ 'btn-primary': loginType === 'emailCode' }"
              @click="loginType = 'emailCode'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              邮箱验证码
            </button>
            <button 
              class="btn btn-outline flex-1 gap-2 hover:btn-primary transition-colors duration-300 text-sm whitespace-nowrap"
              :class="{ 'btn-primary': loginType === 'phoneCode' }"
              @click="loginType = 'phoneCode'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              手机验证码
            </button>
          </div>
          
          <!-- 注册链接 -->
          <div class="text-center">
            <span class="text-base-content/70">还没有账号？</span>
            <router-link
              to="/auth/register"
              class="link link-primary ml-1 hover:link-primary-focus transition-colors duration-300"
            >
              立即注册
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()

// Mock用户数据
const mockUsers = [
  {
    email: 'admin@example.com',
    password: '123456',
    role: 'admin',
    theme: 'light',
    avatar: 'https://ecel.cos.ecel.cloud/avatar/2025/02/03/9929dcdfd324373f4bf1fbd9ae2e2987.png',
    phone: '13800138000',
    name: '管理员'
  },
  {
    email: 'user@example.com',
    password: '123456',
    role: 'user',
    theme: 'dark',
    avatar: 'https://ecel.cos.ecel.cloud/avatar/2025/02/03/9929dcdfd324373f4bf1fbd9ae2e2987.png',
    phone: '13800138000',
    name: '普通用户'
  }
]

const email = ref('')
const password = ref('123456')
const isLoading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)
const emailError = ref(false)
const passwordError = ref(false)
const isEmailTouched = ref(false)
const isPasswordTouched = ref(false)
const loginType = ref('password') // 修改默认登录方式为密码登录

// 手机号登录相关
const phone = ref('')
const verificationCode = ref('')
const phoneError = ref(false)
const codeError = ref(false)
const isPhoneTouched = ref(false)
const isCodeTouched = ref(false)
const countdown = ref(0)

// 账户密码登录相关
const account = ref('admin@example.com')
const accountError = ref(false)
const isAccountTouched = ref(false)

// 邮箱验证码登录相关
const emailCode = ref('')
const emailCodeError = ref(false)
const isEmailCodeTouched = ref(false)
const emailCountdown = ref(0)

// 手机验证码登录相关
const phoneCode = ref('')
const phoneCodeError = ref(false)
const isPhoneCodeTouched = ref(false)
const phoneCountdown = ref(0)

// 邮箱验证规则
const validateEmail = () => {
  if (!email.value && isEmailTouched.value) {
    emailError.value = true
    return false
  }
  
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (!emailRegex.test(email.value) && isEmailTouched.value) {
    emailError.value = true
    return false
  }
  
  emailError.value = false
  return true
}

// 密码验证规则
const validatePassword = () => {
  if (!password.value && isPasswordTouched.value) {
    passwordError.value = true
    return false
  }
  
  if (password.value.length < 6 && isPasswordTouched.value) {
    passwordError.value = true
    return false
  }
  
  if (password.value.length > 20 && isPasswordTouched.value) {
    passwordError.value = true
    return false
  }
  
  if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(password.value) && isPasswordTouched.value) {
    passwordError.value = true
    return false
  }
  
  passwordError.value = false
  return true
}

// 手机号验证规则
const validatePhone = () => {
  if (!phone.value && isPhoneTouched.value) {
    phoneError.value = true
    return false
  }
  
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(phone.value) && isPhoneTouched.value) {
    phoneError.value = true
    return false
  }
  
  phoneError.value = false
  return true
}

// 验证码验证规则
const validateCode = (code: string, isCodeTouched: boolean) => {
  if (!code && isCodeTouched) {
    return false
  }
  
  return /^\d{6}$/.test(code)
}

// 监听输入变化
watch(email, () => {
  if (isEmailTouched.value) {
    validateEmail()
  }
})

watch(password, () => {
  if (isPasswordTouched.value) {
    validatePassword()
  }
})

watch(phone, () => {
  if (isPhoneTouched.value) {
    validatePhone()
  }
})

watch(verificationCode, () => {
  if (isCodeTouched.value) {
    validateCode(verificationCode.value, isCodeTouched.value)
  }
})

watch(account, () => {
  if (isAccountTouched.value) {
    validateAccount()
  }
})

watch(emailCode, () => {
  if (isEmailCodeTouched.value) {
    emailCodeError.value = !validateCode(emailCode.value, isEmailCodeTouched.value)
  }
})

watch(phoneCode, () => {
  if (isPhoneCodeTouched.value) {
    phoneCodeError.value = !validateCode(phoneCode.value, isPhoneCodeTouched.value)
  }
})

const handleEmailBlur = () => {
  isEmailTouched.value = true
  validateEmail()
}

const handlePasswordBlur = () => {
  isPasswordTouched.value = true
  validatePassword()
}

const handlePhoneBlur = () => {
  isPhoneTouched.value = true
  validatePhone()
}

const handleCodeBlur = () => {
  isCodeTouched.value = true
  validateCode(verificationCode.value, isCodeTouched.value)
}

const handleAccountBlur = () => {
  isAccountTouched.value = true
  validateAccount()
}

const handleEmailCodeBlur = () => {
  isEmailCodeTouched.value = true
  emailCodeError.value = !validateCode(emailCode.value, isEmailCodeTouched.value)
}

const handlePhoneCodeBlur = () => {
  isPhoneCodeTouched.value = true
  phoneCodeError.value = !validateCode(phoneCode.value, isPhoneCodeTouched.value)
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Mock登录验证
const mockLogin = (email: string, password: string): Promise<{ success: boolean; user?: any }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email && u.password === password)
      if (user) {
        resolve({ success: true, user })
      } else {
        resolve({ success: false })
      }
    }, 1000) // 模拟网络延迟
  })
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!validatePhone()) {
    return
  }
  
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  
  // TODO: 调用发送验证码的API
  console.log('发送验证码到手机号：', phone.value)
}

// 账户验证规则
const validateAccount = () => {
  if (!account.value && isAccountTouched.value) {
    accountError.value = true
    return false
  }
  
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  const phoneRegex = /^1[3-9]\d{9}$/
  
  if (!emailRegex.test(account.value) && !phoneRegex.test(account.value) && isAccountTouched.value) {
    accountError.value = true
    return false
  }
  
  accountError.value = false
  return true
}

// 发送邮箱验证码
const sendEmailCode = async () => {
  if (!validateEmail()) {
    return
  }
  
  emailCountdown.value = 60
  const timer = setInterval(() => {
    emailCountdown.value--
    if (emailCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  
  // TODO: 调用发送邮箱验证码的API
  console.log('发送验证码到邮箱：', email.value)
}

// 发送手机验证码
const sendPhoneCode = async () => {
  if (!validatePhone()) {
    return
  }
  
  phoneCountdown.value = 60
  const timer = setInterval(() => {
    phoneCountdown.value--
    if (phoneCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  
  // TODO: 调用发送手机验证码的API
  console.log('发送验证码到手机：', phone.value)
}

// 修改登录处理函数
const handleSubmit = async () => {
  try {
    isLoading.value = true
    let loginResult = { success: false, user: null }

    switch (loginType.value) {
      case 'password':
        isAccountTouched.value = true
        isPasswordTouched.value = true
        
        if (!validateAccount() || !validatePassword()) {
          isLoading.value = false
          return
        }
        
        // 判断账号类型（邮箱或手机号）并调用相应的登录方法
        const isEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(account.value)
        loginResult = await mockLogin(account.value, password.value)
        break

      case 'emailCode':
        isEmailTouched.value = true
        isEmailCodeTouched.value = true
        
        if (!validateEmail() || !validateCode(emailCode.value, isEmailCodeTouched.value)) {
          isLoading.value = false
          return
        }
        
        // TODO: 实现邮箱验证码登录逻辑
        loginResult = { success: true, user: mockUsers[1] }
        break

      case 'phoneCode':
        isPhoneTouched.value = true
        isPhoneCodeTouched.value = true
        
        if (!validatePhone() || !validateCode(phoneCode.value, isPhoneCodeTouched.value)) {
          isLoading.value = false
          return
        }
        
        // TODO: 实现手机验证码登录逻辑
        loginResult = { success: true, user: mockUsers[1] }
        break
    }

    const { success, user } = loginResult
    
    if (success && user) {
      // 更新用户状态到 store
      await userStore.setUser({
        id: Date.now(),  // 模拟用户ID
        username: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: new Date().toISOString()
      })

      // 设置 token
      const token = 'mock_token_' + Date.now()
      localStorage.setItem('token', token)
      userStore.$patch({ token })

      // 设置主题
      if (user.theme) {
        themeStore.setTheme(user.theme)
      } else {
        themeStore.initTheme()
      }

      if (rememberMe.value && loginType.value === 'password') {
        localStorage.setItem('rememberedAccount', account.value)
      } else {
        localStorage.removeItem('rememberedAccount')
      }
      
      router.push('/')
    } else {
      switch (loginType.value) {
        case 'password':
          passwordError.value = true
          break
        case 'emailCode':
          emailCodeError.value = true
          break
        case 'phoneCode':
          phoneCodeError.value = true
          break
      }
    }
  } catch (error: any) {
    console.error('Login failed:', error)
    switch (loginType.value) {
      case 'password':
        passwordError.value = true
        break
      case 'emailCode':
        emailCodeError.value = true
        break
      case 'phoneCode':
        phoneCodeError.value = true
        break
    }
  } finally {
    isLoading.value = false
  }
}

// 页面加载时检查是否有记住的账号
onMounted(() => {
  const rememberedAccount = localStorage.getItem('rememberedAccount')
  if (rememberedAccount) {
    account.value = rememberedAccount
    rememberMe.value = true
  }
})
</script> 