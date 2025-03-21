# 服装租赁平台

## 技术栈

- 框架：Vue 3 + TypeScript + Vite
- UI框架：Tailwind CSS + DaisyUI
- 状态管理：Pinia + 持久化
- HTTP客户端：Axios
- 路由：Vue Router
- 后端对接：Spring Boot REST API

## 开发环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- Vue.js DevTools (浏览器插件)

## 项目结构

```bash
src/
├─ api/            # API配置和请求封装
│  └─ request.ts   # Axios实例和拦截器
├─ assets/         # 静态资源
├─ components/     # 通用组件
├─ layouts/        # 页面布局
│  ├─ MainLayout.vue    # 主布局
│  └─ AuthLayout.vue    # 认证页面布局
├─ router/         # 路由配置
│  └─ index.ts     # 路由定义和守卫
├─ stores/         # Pinia状态管理
│  ├─ user.ts      # 用户状态
│  └─ cart.ts      # 购物车状态
├─ types/          # TypeScript类型定义
│  └─ index.ts     # 通用类型定义
├─ views/          # 页面组件
│  ├─ Home.vue     # 首页
│  ├─ auth/        # 认证相关页面
│  └─ user/        # 用户相关页面
├─ App.vue         # 根组件
└─ main.ts         # 应用入口
```

## 主要功能模块

### 1. 用户系统

- 登录/注册
  - 邮箱登录
  - 手机号登录（计划中）
  - 第三方登录（计划中）
- 个人信息管理
  - 基本信息修改
  - 头像上传
  - 地址管理
- 租赁历史查看
  - 订单列表
  - 订单详情
  - 评价系统

### 2. 商品系统

- 服装分类浏览
  - 分类筛选
  - 价格筛选
  - 尺码筛选
  - 品牌筛选
- 商品详情展示
  - 多图展示
  - 尺码选择
  - 库存状态
  - 租赁规则
- 尺寸选择器
  - 尺码对照表
  - 尺码推荐
- 租赁时间选择
  - 日历选择
  - 租期计算
  - 价格计算

### 3. 订单系统

- 租赁车管理
  - 添加/删除商品
  - 修改租赁时间
  - 价格实时计算
- 订单提交
  - 地址选择
  - 支付方式选择
  - 优惠券使用
- 支付集成
  - 支付宝（计划中）
  - 微信支付（计划中）
- 订单状态跟踪
  - 订单状态更新
  - 物流信息查询
  - 归还提醒

## 开发指南

### 环境设置
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 代码规范
- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 遵循Vue 3组合式API风格指南
- 使用TypeScript强类型

### Git提交规范
提交信息格式：
```
<type>(<scope>): <subject>

<body>

<footer>
```

type类型：
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建

## 扩展建议

1. 支付集成
   - 接入支付宝/微信支付SDK
   - 实现支付流程
   - 处理支付回调

2. 服装推荐系统
   - 基于用户行为的推荐
   - 基于商品相似度的推荐
   - 季节性推荐

3. AR试衣功能
   - 集成Three.js
   - 实现模型加载
   - 实现姿态估计

4. 后台管理系统
   - 商品管理
   - 订单管理
   - 用户管理
   - 数据统计

5. 实时库存系统
   - WebSocket实时更新
   - 库存锁定机制
   - 超时释放机制

## 常见问题

1. 样式不生效
   - 检查tailwind.config.js配置
   - 确保正确导入了CSS文件
   - 检查类名是否正确

2. 跨域问题
   - 开发环境配置代理
   - 生产环境配置CORS
   - 检查请求头设置

3. 状态持久化
   - 使用pinia-plugin-persistedstate
   - 配置持久化选项
   - 处理敏感数据

4. 主题切换
   - 使用DaisyUI的主题系统
   - 实现主题持久化
   - 添加主题切换组件

## API文档

### 基础配置
```typescript
// 基础URL
const BASE_URL = 'http://api.example.com'

// 请求超时
const TIMEOUT = 10000
```

### 接口列表
1. 用户相关
```typescript
// 登录
POST /api/auth/login
// 注册
POST /api/auth/register
// 获取用户信息
GET /api/user/profile
```

2. 商品相关
```typescript
// 获取商品列表
GET /api/clothing
// 获取商品详情
GET /api/clothing/:id
// 获取分类列表
GET /api/categories
```

3. 订单相关
```typescript
// 创建订单
POST /api/orders
// 获取订单列表
GET /api/orders
// 获取订单详情
GET /api/orders/:id
```