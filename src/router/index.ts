import { createRouter, createWebHistory } from 'vue-router'
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
  const token = localStorage.getItem('token')
  const userRole = JSON.parse(localStorage.getItem('user') || '{}').role
  
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
  const adminRequired = to.matched.some((record: RouteRecordRaw) => record.meta.requiresAdmin)
  
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
  if (adminRequired && userRole !== 'admin') {
    return next('/')
  }
  
  // 其他情况放行
  next()
})

export default router 
 