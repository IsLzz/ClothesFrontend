import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  // 前台展示端
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/front/Home.vue')
      },
      {
        path: 'clothing',
        name: 'clothing-list',
        component: () => import('@/views/front/ClothingList.vue')
      },
      {
        path: 'clothing/:id',
        name: 'clothing-detail',
        component: () => import('@/views/front/ClothingDetail.vue')
      },
      {
        path: 'cart',
        name: 'cart',
        component: () => import('@/views/front/Cart.vue')
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/views/front/Orders.vue')
      },
      {
        path: 'payment/:id',
        name: 'payment',
        component: () => import('@/views/front/Payment.vue')
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/front/Profile.vue')
      }
    ]
  },
  // 认证页面
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/auth/Login.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/auth/Register.vue')
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/auth/ForgotPassword.vue')
      }
    ]
  },
  // 后台管理端
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'clothing',
        name: 'admin-clothing',
        component: () => import('@/views/admin/clothing/List.vue')
      },
      {
        path: 'clothing/create',
        name: 'admin-clothing-create',
        component: () => import('@/views/admin/clothing/Edit.vue')
      },
      {
        path: 'clothing/:id/edit',
        name: 'admin-clothing-edit',
        component: () => import('@/views/admin/clothing/Edit.vue')
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('@/views/admin/orders/List.vue')
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/views/admin/users/List.vue')
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('@/views/admin/categories/List.vue')
      },
      {
        path: 'rentals',
        name: 'admin-rentals',
        component: () => import('@/views/admin/rentals/List.vue')
      },
      {
        path: 'rentals/:id',
        name: 'admin-rental-detail',
        component: () => import('@/views/admin/rentals/Detail.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // 增加安全检查，避免JSON解析错误
  let user = null
  let token = null
  let userRole = 'guest'
  
  try {
    // 获取token
    const data = JSON.parse(localStorage.getItem('user') || '{}')
    
    const storedToken = data.token
    if (storedToken && storedToken !== 'undefined' && storedToken !== 'null') {
      token = storedToken
    }
    
    // 获取用户信息
    const userData = data.userInfo
    
    if (userData && userData !== 'undefined' && userData !== 'null') {
      try {
        if (userData) {
          user = userData
          
          // 根据API接口，用户数据中的角色信息存储在roles字段
          if (user.roles) {
            // 角色可能是字符串，如 "ADMIN,USER" 或单个 "ADMIN"
            userRole = user.roles
          }
        }
      } catch (e) {
        // 解析user JSON数据失败
      }
    }
  } catch (error) {
    // 处理用户认证状态时出错
    // 清除可能损坏的数据
    localStorage.removeItem('user')
  }
  
  // 公开页面（无需登录）
  const publicPages = [
    '/auth/login',
    '/auth/register', 
    '/auth/forgot-password',
    '/',  // 首页
    '/clothing',  // 服装列表页
  ]
  // 动态路由也需要加入白名单
  if (to.path.startsWith('/clothing/') && to.name === 'clothing-detail') {
    publicPages.push(to.path)
  }
  const authRequired = !publicPages.includes(to.path)
  
  // 需要管理员权限的页面
  const adminRequired = to.matched.some((record) => record.meta.requiresAdmin)
  
  // 已登录用户访问登录页时重定向到首页
  if (token && publicPages.includes(to.path) && to.path.startsWith('/auth/')) {
    return next('/')
  }

  // 未登录用户访问需要登录的页面时重定向到登录页
  if (authRequired && !token) {
    return next({
      path: '/auth/login',
      query: { redirect: to.fullPath }  // 保存原目标路径
    })
  }
  
  // 非管理员访问管理页面时重定向到首页
  if (adminRequired && (!userRole.includes('ADMIN'))) {
    return next('/')
  }
  
  // 其他情况放行
  next()
})

export default router
