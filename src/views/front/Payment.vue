<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">订单支付</h1>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center py-12">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
      
      <!-- 错误提示 -->
      <div v-else-if="error" class="alert alert-error shadow-lg mb-6">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{{ error }}</span>
        </div>
      </div>
      
      <!-- 订单信息 -->
      <div v-else-if="order" class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">订单信息</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div>
              <p class="text-sm text-gray-500">订单号</p>
              <p class="font-medium">{{ order.id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">创建时间</p>
              <p class="font-medium">{{ formatDateTime(order.createdAt) }}</p>
            </div>
          </div>
          
          <!-- 商品信息 -->
          <div class="border rounded-lg p-4 mb-4">
            <div v-for="(item, index) in order.orderItems" :key="index" class="flex gap-4 items-center mb-4">
              <div class="avatar">
                <div class="w-16 h-16 rounded">
                  <img :src="item.clothes?.imageUrl || 'https://via.placeholder.com/80'" :alt="item.clothes?.name" />
                </div>
              </div>
              <div class="flex-1">
                <h3 class="font-bold">{{ item.clothes?.name }}</h3>
                <p class="text-sm text-gray-600">
                  尺码: {{ item.clothes?.size }}
                </p>
                <p class="text-sm text-gray-600">
                  租期：{{ formatDate(item.rentalRecord?.startDate) }} 至 {{ formatDate(item.rentalRecord?.endDate) }}
                  <span class="ml-2">({{ item.rentalRecord?.rentalDays }}天)</span>
                </p>
                <p class="text-sm text-gray-600">
                  单价: ¥{{ item.pricePerDay }}/天 × {{ item.rentalRecord?.rentalDays }}天
                </p>
              </div>
              <div class="text-right">
                <p class="font-bold">¥{{ item.subtotal }}</p>
              </div>
            </div>
          </div>
          
          <!-- 支付金额 -->
          <div class="flex flex-col gap-2 mb-6">
            <div class="flex justify-between">
              <span>商品租金</span>
              <span>¥{{ order.totalAmount }}</span>
            </div>
            <div class="flex justify-between">
              <span>押金</span>
              <span>¥{{ calculateDeposit() }}</span>
            </div>
            <div class="divider my-1"></div>
            <div class="flex justify-between font-bold">
              <span>总计</span>
              <span class="text-primary">¥{{ order.totalAmount + calculateDeposit() }}</span>
            </div>
          </div>
          
          <!-- 支付方式 -->
          <div class="mb-6">
            <h3 class="font-bold mb-3">选择支付方式</h3>
            <div class="flex flex-col gap-3">
              <div class="form-control">
                <label class="label cursor-pointer justify-start gap-4">
                  <input type="radio" name="payMethod" value="alipay" class="radio radio-primary" v-model="payMethod" />
                  <span class="label-text">支付宝</span>
                </label>
              </div>
              <div class="form-control">
                <label class="label cursor-pointer justify-start gap-4">
                  <input type="radio" name="payMethod" value="wechat" class="radio radio-primary" v-model="payMethod" />
                  <span class="label-text">微信支付</span>
                </label>
              </div>
              <div class="form-control">
                <label class="label cursor-pointer justify-start gap-4">
                  <input type="radio" name="payMethod" value="credit_card" class="radio radio-primary" v-model="payMethod" />
                  <span class="label-text">银行卡</span>
                </label>
              </div>
            </div>
          </div>
          
          <!-- 支付按钮 -->
          <div class="card-actions justify-end">
            <button class="btn btn-primary" @click="handlePay" :disabled="!payMethod || processing">
              <span v-if="processing" class="loading loading-spinner"></span>
              {{ processing ? '处理中...' : '立即支付' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- 支付成功提示 -->
      <div v-if="paymentSuccess" class="alert alert-success shadow-lg my-6">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>支付成功！</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderById } from '@/api'
import orderService from '@/api/services/orderService'
import type { ApiResponse, Order } from '@/types'

const route = useRoute()
const router = useRouter()

const order = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const payMethod = ref<string>('')
const processing = ref(false)
const paymentSuccess = ref(false)

// 模拟支付处理
const handlePay = async () => {
  if (!payMethod.value) {
    return
  }
  
  processing.value = true
  
  try {
    // 计算总金额（租金+押金）
    const totalPayment = order.value.totalAmount + calculateDeposit();
    
    // 构建支付请求数据
    const paymentData = {
      orderId: order.value.id,
      paymentMethod: payMethod.value,
      amount: totalPayment
    };
    
    console.log('支付请求数据:', paymentData);
    
    // 这里应该调用支付API
    // const response = await createPayment(paymentData);
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 调用完成订单API
    try {
      // @ts-ignore
      const completeResponse = await orderService.completeOrder(order.value.id);
      console.log('订单完成状态:', completeResponse);
    } catch (completeErr) {
      console.error('完成订单失败:', completeErr);
      // 继续流程，但记录错误
    }
    
    // 支付成功
    paymentSuccess.value = true
    
    // 延迟后跳转到订单页面
    setTimeout(() => {
      router.push('/orders')
    }, 2000)
  } catch (err: any) {
    error.value = err.message || '支付处理失败，请稍后重试'
  } finally {
    processing.value = false
  }
}

// 计算押金函数（押金为总租金的50%）
const calculateDeposit = () => {
  return order.value?.totalAmount ? order.value.totalAmount * 0.5 : 0;
}

// 获取订单详情
const fetchOrderDetail = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const orderId = Number(route.params.id);
    if (!orderId) {
      throw new Error('无效的订单ID');
    }
    
    // 调用API获取订单详情
    // @ts-ignore
    const response = await getOrderById(orderId) as ApiResponse<Order>;
    
    // @ts-ignore
    if (response?.code === 200 && response?.data) {
      // @ts-ignore
      order.value = response.data;
      
      // 如果订单已支付，跳转到订单列表
      // @ts-ignore
      if (order.value.paymentStatus === 'paid') {
        router.push('/orders');
      }
    } else {
      // 如果API返回失败，使用模拟数据（仅用于开发测试）
      mockOrderData(orderId);
    }
  } catch (err: any) {
    console.error('获取订单详情失败:', err);
    // 在API不可用时使用模拟数据（仅用于开发测试）
    mockOrderData(Number(route.params.id));
  } finally {
    loading.value = false;
  }
};

// 使用模拟数据（仅用于开发和测试）
const mockOrderData = (orderId: number) => {
  // 模拟一个与后端返回格式相同的订单数据
  order.value = {
    id: orderId,
    userId: 1,
    totalAmount: 24642.00,
    status: "pending",
    paymentStatus: "unpaid",
    createdAt: "2025-04-13 23:08:40",
    orderItems: [
      {
        id: 1,
        orderId: orderId,
        clothesId: 1,
        clothes: {
          id: 1,
          name: "1231",
          description: "这是一件设计简约但不失优雅的黑色晚礼服。采用高质量面料制作，穿着舒适，适合各种正式场合。",
          size: "M",
          pricePerDay: 12321.00,
          stock: 1321320,
          category: "外套",
          imageUrl: "http://localhost:8080/uploads/2025/04/13/6b48a9b9b51948dba02d34f53e730e8c.png",
          available: true
        },
        quantity: 1,
        pricePerDay: 12321.00,
        subtotal: 24642.00,
        rentalRecord: {
          id: 1,
          orderItemId: 1,
          startDate: "2025-04-18",
          endDate: "2025-04-19",
          returned: false,
          returnDate: null,
          lateFee: 0.00,
          rentalDays: 2
        }
      }
    ]
  };
};

// 格式化日期
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '暂无数据'
  
  try {
    return new Date(dateString).toLocaleDateString('zh-CN')
  } catch (error) {
    return '日期格式错误'
  }
}

// 格式化日期时间
const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return '暂无数据'
  
  try {
    return new Date(dateString).toLocaleString('zh-CN')
  } catch (error) {
    return '日期格式错误'
  }
}

onMounted(() => {
  // 模拟数据 - 实际项目中替换为API调用
  if (route.params.id) {
    // 尝试从API获取订单详情
    fetchOrderDetail()
  } else {
    error.value = '无效的订单ID'
    loading.value = false
  }
})
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
  overflow: hidden;
}

.avatar img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 0.5rem 0;
}

/* 订单项样式 */
.border {
  border-color: rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.border:hover {

  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

/* 支付方式选择样式 */
.form-control {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  padding: 0.5rem;
  transition: all 0.3s ease;
}


/* 支付成功提示样式 */
.alert-success {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 按钮动效 */
.btn-primary:not(:disabled) {
  position: relative;
  overflow: hidden;
}

.btn-primary:not(:disabled)::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%, -50%);
  transform-origin: 50% 50%;
}

.btn-primary:not(:disabled):hover::after {
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(100, 100);
    opacity: 0;
  }
}
</style> 