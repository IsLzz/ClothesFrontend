# Scaffold 项目接口文档

本文档描述了 Scaffold 项目中所有可用的 API 接口。

## 目录

1. [认证接口](#认证接口)
   - [用户注册](#用户注册)
   - [用户登录](#用户登录)
   - [获取当前用户信息](#获取当前用户信息)
   - [用户登出](#用户登出)
   - [验证令牌](#验证令牌)
   - [安全测试接口](#安全测试接口)

2. [用户管理接口](#用户管理接口)
   - [分页查询用户列表](#分页查询用户列表)
   - [根据ID查询用户](#根据id查询用户)
   - [用户注册](#用户注册-1)
   - [更新用户信息](#更新用户信息)
   - [删除用户](#删除用户)

3. [文件管理接口](#文件管理接口)
   - [上传图片](#上传图片)
   - [获取文件](#获取文件)

4. [服装管理接口](#服装管理接口)
   - [创建服装](#创建服装)
   - [更新服装](#更新服装)
   - [删除服装](#删除服装)
   - [根据ID查询服装](#根据id查询服装)
   - [分页查询服装](#分页查询服装)
   - [按分类查询服装](#按分类查询服装)
   - [搜索服装](#搜索服装)

5. [服装分类管理接口](#服装分类管理接口)
   - [创建分类](#创建分类)
   - [更新分类](#更新分类)
   - [删除分类](#删除分类)
   - [根据ID查询分类](#根据id查询分类)
   - [查询所有分类](#查询所有分类)

6. [订单管理接口](#订单管理接口)
   - [创建订单](#创建订单)
   - [查询订单列表](#查询订单列表)
   - [查询用户订单](#查询用户订单)
   - [根据ID查询订单](#根据id查询订单)
   - [取消订单](#取消订单)
   - [完成订单](#完成订单)
   - [更新订单状态](#更新订单状态)

7. [租赁管理接口](#租赁管理接口)
   - [获取用户的所有租赁记录](#获取用户的所有租赁记录)
   - [根据ID查询租赁记录](#根据id查询租赁记录)
   - [查询所有未归还的租赁记录](#查询所有未归还的租赁记录)
   - [归还服装](#归还服装)
   - [延长租赁时间](#延长租赁时间)

8. [支付管理接口](#支付管理接口)
   - [创建支付](#创建支付)
   - [查询支付状态](#查询支付状态)
   - [申请退款](#申请退款)
   - [查询订单支付记录](#查询订单支付记录)

## 通用响应格式

所有接口都使用统一的响应格式：

```json
{
  "code": 200,          // 响应状态码
  "message": "成功",     // 响应消息
  "data": { ... },      // 响应数据，可能为对象、数组或空
  "time": "2024-04-04 23:59:59" // 响应时间
}
```

### 常见状态码

| 状态码 | 描述 |
| ----- | ---- |
| 200   | 成功 |
| 400   | 参数错误 |
| 401   | 未认证 |
| 403   | 无权限 |
| 500   | 服务器错误 |

---

## 认证接口

### 用户注册

- **URL**: `/auth/register`
- **方法**: `POST`
- **描述**: 注册新用户
- **权限要求**: 无需认证

**请求体**:

```json
{
  "account": "test123",
  "password": "123456",
  "nickname": "测试用户",
  "email": "test@example.com",
  "phone": "13800138000",
  "avatar": "https://example.com/avatar.jpg",
  "gender": 1
}
```

**字段说明**:

| 字段名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| account | String | 是 | 账号，3-50字符，只能包含字母、数字、下划线和短横线 |
| password | String | 是 | 密码，6-100字符 |
| nickname | String | 是 | 昵称，2-50字符 |
| email | String | 否 | 邮箱，必须符合邮箱格式 |
| phone | String | 否 | 手机号，必须符合手机号格式 |
| avatar | String | 否 | 头像URL |
| gender | Integer | 否 | 性别：0-未知，1-男，2-女，默认0 |

**响应示例**:

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "id": 1,
    "account": "test123",
    "nickname": "测试用户",
    "email": "test@example.com",
    "phone": "13800138000",
    "avatar": "https://example.com/avatar.jpg",
    "gender": 1,
    "roles": "USER",
    "createTime": "2024-04-04 23:59:59"
  },
  "time": "2024-04-04 23:59:59"
}
```

### 用户登录

- **URL**: `/auth/login`
- **方法**: `POST`
- **描述**: 用户登录获取认证令牌
- **权限要求**: 无需认证

**请求体**:

```json
{
  "account": "test123",
  "password": "123456"
}
```

**字段说明**:

| 字段名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| account | String | 是 | 账号，3-50字符 |
| password | String | 是 | 密码，6-100字符 |

**响应示例**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "user": {
      "id": 1,
      "account": "test123",
      "nickname": "测试用户",
      "email": "test@example.com",
      "phone": "13800138000",
      "avatar": "https://example.com/avatar.jpg",
      "gender": 1,
      "roles": "USER",
      "lastLoginTime": "2024-04-04 23:59:59",
      "lastLoginIp": "127.0.0.1",
      "createTime": "2024-04-04 23:59:59"
    }
  },
  "time": "2024-04-04 23:59:59"
}
```

### 获取当前用户信息

- **URL**: `/auth/user-info`
- **方法**: `GET`
- **描述**: 获取当前登录用户的详细信息
- **权限要求**: 需要认证

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "account": "test123",
    "nickname": "测试用户",
    "email": "test@example.com",
    "phone": "13800138000",
    "avatar": "https://example.com/avatar.jpg",
    "gender": 1,
    "roles": "USER",
    "lastLoginTime": "2024-04-04 23:59:59",
    "lastLoginIp": "127.0.0.1",
    "createTime": "2024-04-04 23:59:59"
  },
  "time": "2024-04-04 23:59:59"
}
```

### 用户登出

- **URL**: `/auth/logout`
- **方法**: `POST`
- **描述**: 用户登出系统
- **权限要求**: 需要认证

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "登出成功",
  "data": null,
  "time": "2024-04-04 23:59:59"
}
```

### 验证令牌

- **URL**: `/auth/validate`
- **方法**: `POST`
- **描述**: 验证JWT令牌是否有效
- **权限要求**: 无需认证

**请求参数**:

| 参数名 | 类型 | 位置 | 必填 | 描述 |
| ----- | ---- | ---- | ---- | ---- |
| token | String | query | 是 | 需要验证的JWT令牌 |

**响应示例**:

```json
{
  "code": 200,
  "message": "成功",
  "data": true,
  "time": "2024-04-04 23:59:59"
}
```

### 安全测试接口

- **URL**: `/auth/secured`
- **方法**: `GET`
- **描述**: 用于测试JWT认证
- **权限要求**: 需要认证

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "成功",
  "data": "这是一个受保护的端点，需要JWT认证才能访问",
  "time": "2024-04-04 23:59:59"
}
```

---

## 用户管理接口

### 分页查询用户列表

- **URL**: `/users`
- **方法**: `GET`
- **描述**: 分页查询用户列表
- **权限要求**: 需要ADMIN角色

**请求参数**:

| 参数名 | 类型 | 位置 | 必填 | 描述 |
| ----- | ---- | ---- | ---- | ---- |
| page | Integer | query | 否 | 页码，默认1 |
| pageSize | Integer | query | 否 | 每页数量，默认10，最大100 |

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "items": [
      {
        "id": 1,
        "account": "test123",
        "nickname": "测试用户",
        "email": "test@example.com",
        "phone": "13800138000",
        "avatar": "https://example.com/avatar.jpg",
        "gender": 1,
        "roles": "USER",
        "lastLoginTime": "2024-04-04 23:59:59",
        "lastLoginIp": "127.0.0.1",
        "createTime": "2024-04-04 23:59:59"
      }
    ],
    "total": 1
  },
  "time": "2024-04-04 23:59:59"
}
```

### 根据ID查询用户

- **URL**: `/users/{id}`
- **方法**: `GET`
- **描述**: 根据ID查询用户信息
- **权限要求**: 需要ADMIN角色或当前用户查询自己的信息

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 用户ID |

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "account": "test123",
    "nickname": "测试用户",
    "email": "test@example.com",
    "phone": "13800138000",
    "avatar": "https://example.com/avatar.jpg",
    "gender": 1,
    "roles": "USER",
    "lastLoginTime": "2024-04-04 23:59:59",
    "lastLoginIp": "127.0.0.1",
    "createTime": "2024-04-04 23:59:59"
  },
  "time": "2024-04-04 23:59:59"
}
```

### 用户注册

- **URL**: `/users/register`
- **方法**: `POST`
- **描述**: 注册新用户
- **权限要求**: 无需认证

**请求体**:

```json
{
  "account": "test123",
  "password": "123456",
  "nickname": "测试用户",
  "email": "test@example.com",
  "phone": "13800138000",
  "avatar": "https://example.com/avatar.jpg",
  "gender": 1
}
```

**字段说明**:

| 字段名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| account | String | 是 | 账号，3-50字符，只能包含字母、数字、下划线和短横线 |
| password | String | 是 | 密码，6-100字符 |
| nickname | String | 是 | 昵称，2-50字符 |
| email | String | 否 | 邮箱，必须符合邮箱格式 |
| phone | String | 否 | 手机号，必须符合手机号格式 |
| avatar | String | 否 | 头像URL |
| gender | Integer | 否 | 性别：0-未知，1-男，2-女，默认0 |

**响应示例**:

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "id": 1,
    "account": "test123",
    "nickname": "测试用户",
    "email": "test@example.com",
    "phone": "13800138000",
    "avatar": "https://example.com/avatar.jpg",
    "gender": 1,
    "roles": "USER",
    "createTime": "2024-04-04 23:59:59"
  },
  "time": "2024-04-04 23:59:59"
}
```

### 更新用户信息

- **URL**: `/users/{id}`
- **方法**: `PUT`
- **描述**: 更新用户信息
- **权限要求**: 需要ADMIN角色或当前用户更新自己的信息

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 用户ID |

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "password": "654321",
  "nickname": "新昵称",
  "email": "new@example.com",
  "phone": "13900139000",
  "avatar": "https://example.com/new-avatar.jpg",
  "gender": 2
}
```

**字段说明**:

| 字段名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| password | String | 否 | 密码，6-100字符 |
| nickname | String | 是 | 昵称，2-50字符 |
| email | String | 否 | 邮箱，必须符合邮箱格式 |
| phone | String | 否 | 手机号，必须符合手机号格式 |
| avatar | String | 否 | 头像URL |
| gender | Integer | 否 | 性别：0-未知，1-男，2-女 |

**响应示例**:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "account": "test123",
    "nickname": "新昵称",
    "email": "new@example.com",
    "phone": "13900139000",
    "avatar": "https://example.com/new-avatar.jpg",
    "gender": 2,
    "roles": "USER",
    "lastLoginTime": "2024-04-04 23:59:59",
    "lastLoginIp": "127.0.0.1",
    "createTime": "2024-04-04 23:59:59"
  },
  "time": "2024-04-04 23:59:59"
}
```

### 删除用户

- **URL**: `/users/{id}`
- **方法**: `DELETE`
- **描述**: 删除用户
- **权限要求**: 需要ADMIN角色

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 用户ID |

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": true,
  "time": "2024-04-04 23:59:59"
}
```

---

## 文件管理接口

### 上传图片

- **URL**: `/files/upload`
- **方法**: `POST`
- **描述**: 上传图片文件，支持jpg、jpeg、png、gif、bmp、webp格式
- **权限要求**: 无需认证

**请求参数**:

| 参数名 | 类型 | 位置 | 必填 | 描述 |
| ----- | ---- | ---- | ---- | ---- |
| file | File | form-data | 是 | 要上传的图片文件（大小不超过10MB） |

**响应示例**:

```json
{
  "code": 200,
  "message": "文件上传成功",
  "data": {
    "filename": "example.jpg",
    "size": 1024000,
    "contentType": "image/jpeg",
    "url": "http://localhost:8080/files/upload/2024/04/04/abc123def456.jpg"
  },
  "time": "2024-04-04 23:59:59"
}
```

### 获取文件

- **URL**: `/files/{year}/{month}/{day}/{fileName}`
- **方法**: `GET`
- **描述**: 通过文件路径获取并展示文件
- **权限要求**: 无需认证

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| year | String | 是 | 年份（如2024） |
| month | String | 是 | 月份（如04） |
| day | String | 是 | 日期（如04） |
| fileName | String | 是 | 文件名（包含扩展名） |

**响应**:

文件内容（图片、文档等，根据文件类型返回适当的Content-Type）

---

## 服装管理接口

### 创建服装

- **URL**: `/clothes`
- **方法**: `POST`
- **描述**: 创建新服装
- **权限要求**: 需要ADMIN角色

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "name": "夏季休闲连衣裙",
  "description": "轻薄透气的面料，适合夏季穿着",
  "size": "M",
  "pricePerDay": 39.99,
  "stock": 10,
  "category": "连衣裙",
  "imageUrl": "http://localhost:8080/files/2024/04/04/dress.jpg"
}
```

**字段说明**:

| 字段名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| name | String | 是 | 服装名称 |
| description | String | 否 | 服装描述 |
| size | String | 是 | 服装尺码 |
| pricePerDay | BigDecimal | 是 | 每日租金，必须大于0 |
| stock | Integer | 是 | 库存数量，必须大于等于0 |
| category | String | 否 | 服装分类 |
| imageUrl | String | 否 | 图片URL |

**响应示例**:

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 1,
    "name": "夏季休闲连衣裙",
    "description": "轻薄透气的面料，适合夏季穿着",
    "size": "M",
    "pricePerDay": 39.99,
    "stock": 10,
    "category": "连衣裙",
    "imageUrl": "http://localhost:8080/files/2024/04/04/dress.jpg",
    "available": true
  },
  "time": "2024-04-04 23:59:59"
}
```

### 更新服装

- **URL**: `/clothes/{id}`
- **方法**: `PUT`
- **描述**: 更新服装信息
- **权限要求**: 需要ADMIN角色

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 服装ID |

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "name": "夏季高级休闲连衣裙",
  "description": "升级版轻薄透气的面料，适合夏季穿着",
  "size": "L",
  "pricePerDay": 49.99,
  "stock": 5,
  "category": "连衣裙",
  "imageUrl": "http://localhost:8080/files/2024/04/04/dress-updated.jpg"
}
```

**字段说明**: 同创建服装接口

**响应示例**:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "name": "夏季高级休闲连衣裙",
    "description": "升级版轻薄透气的面料，适合夏季穿着",
    "size": "L",
    "pricePerDay": 49.99,
    "stock": 5,
    "category": "连衣裙",
    "imageUrl": "http://localhost:8080/files/2024/04/04/dress-updated.jpg",
    "available": true
  },
  "time": "2024-04-04 23:59:59"
}
```

### 删除服装

- **URL**: `/clothes/{id}`
- **方法**: `DELETE`
- **描述**: 删除服装
- **权限要求**: 需要ADMIN角色

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 服装ID |

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": true,
  "time": "2024-04-04 23:59:59"
}
```

### 根据ID查询服装

- **URL**: `/clothes/{id}`
- **方法**: `GET`
- **描述**: 根据ID查询服装详情
- **权限要求**: 无需认证

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 服装ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "name": "夏季休闲连衣裙",
    "description": "轻薄透气的面料，适合夏季穿着",
    "size": "M",
    "pricePerDay": 39.99,
    "stock": 10,
    "category": "连衣裙",
    "imageUrl": "http://localhost:8080/files/2024/04/04/dress.jpg",
    "available": true
  },
  "time": "2024-04-04 23:59:59"
}
```

### 分页查询服装

- **URL**: `/clothes`
- **方法**: `GET`
- **描述**: 分页查询可用服装
- **权限要求**: 无需认证

**请求参数**:

| 参数名 | 类型 | 位置 | 必填 | 描述 |
| ----- | ---- | ---- | ---- | ---- |
| page | Integer | query | 否 | 页码，默认1 |
| pageSize | Integer | query | 否 | 每页数量，默认10 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "name": "夏季休闲连衣裙",
      "description": "轻薄透气的面料，适合夏季穿着",
      "size": "M",
      "pricePerDay": 39.99,
      "stock": 10,
      "category": "连衣裙",
      "imageUrl": "http://localhost:8080/files/2024/04/04/dress.jpg",
      "available": true
    },
    {
      "id": 2,
      "name": "男士正装西服",
      "description": "适合正式场合穿着的高级西装",
      "size": "XL",
      "pricePerDay": 89.99,
      "stock": 5,
      "category": "西装",
      "imageUrl": "http://localhost:8080/files/2024/04/04/suit.jpg",
      "available": true
    }
  ],
  "time": "2024-04-04 23:59:59"
}
```

### 按分类查询服装

- **URL**: `/clothes/category/{category}`
- **方法**: `GET`
- **描述**: 按分类查询可用服装
- **权限要求**: 无需认证

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| category | String | 是 | 服装分类名称 |

**请求参数**:

| 参数名 | 类型 | 位置 | 必填 | 描述 |
| ----- | ---- | ---- | ---- | ---- |
| page | Integer | query | 否 | 页码，默认1 |
| pageSize | Integer | query | 否 | 每页数量，默认10 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "name": "夏季休闲连衣裙",
      "description": "轻薄透气的面料，适合夏季穿着",
      "size": "M",
      "pricePerDay": 39.99,
      "stock": 10,
      "category": "连衣裙",
      "imageUrl": "http://localhost:8080/files/2024/04/04/dress.jpg",
      "available": true
    }
  ],
  "time": "2024-04-04 23:59:59"
}
```

### 搜索服装

- **URL**: `/clothes/search`
- **方法**: `GET`
- **描述**: 根据关键字搜索服装
- **权限要求**: 无需认证

**请求参数**:

| 参数名 | 类型 | 位置 | 必填 | 描述 |
| ----- | ---- | ---- | ---- | ---- |
| keyword | String | query | 是 | 搜索关键字，会匹配名称、描述和分类 |
| page | Integer | query | 否 | 页码，默认1 |
| pageSize | Integer | query | 否 | 每页数量，默认10 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "name": "夏季休闲连衣裙",
      "description": "轻薄透气的面料，适合夏季穿着",
      "size": "M",
      "pricePerDay": 39.99,
      "stock": 10,
      "category": "连衣裙",
      "imageUrl": "http://localhost:8080/files/2024/04/04/dress.jpg",
      "available": true
    }
  ],
  "time": "2024-04-04 23:59:59"
}
```

---

## 服装分类管理接口

### 创建分类

- **URL**: `/categories`
- **方法**: `POST`
- **描述**: 创建新的服装分类
- **权限要求**: 需要ADMIN角色

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "name": "连衣裙",
  "description": "各种风格的连衣裙",
  "parentId": null,
  "sort": 1,
  "status": 1
}
```

**字段说明**:

| 字段名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| name | String | 是 | 分类名称 |
| description | String | 否 | 分类描述 |
| parentId | Long | 否 | 父分类ID，顶级分类为null |
| sort | Integer | 否 | 排序序号，默认0 |
| status | Integer | 否 | 状态：0-禁用，1-启用，默认1 |

**响应示例**:

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 1,
    "name": "连衣裙",
    "description": "各种风格的连衣裙",
    "parentId": null,
    "sort": 1,
    "status": 1,
    "createTime": "2024-04-04 23:59:59"
  },
  "time": "2024-04-04 23:59:59"
}
```

### 更新分类

- **URL**: `/categories/{id}`
- **方法**: `PUT`
- **描述**: 更新服装分类信息
- **权限要求**: 需要ADMIN角色

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 分类ID |

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "name": "夏季连衣裙",
  "description": "适合夏季穿着的各种连衣裙",
  "parentId": null,
  "sort": 2,
  "status": 1
}
```

**字段说明**: 同创建分类接口

**响应示例**:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "name": "夏季连衣裙",
    "description": "适合夏季穿着的各种连衣裙",
    "parentId": null,
    "sort": 2,
    "status": 1,
    "createTime": "2024-04-04 23:59:59",
    "updateTime": "2024-04-05 10:00:00"
  },
  "time": "2024-04-05 10:00:00"
}
```

### 删除分类

- **URL**: `/categories/{id}`
- **方法**: `DELETE`
- **描述**: 删除服装分类
- **权限要求**: 需要ADMIN角色

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 分类ID |

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": true,
  "time": "2024-04-05 10:00:00"
}
```

### 根据ID查询分类

- **URL**: `/categories/{id}`
- **方法**: `GET`
- **描述**: 根据ID查询分类详情
- **权限要求**: 无需认证

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 分类ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "name": "夏季连衣裙",
    "description": "适合夏季穿着的各种连衣裙",
    "parentId": null,
    "sort": 2,
    "status": 1,
    "createTime": "2024-04-04 23:59:59",
    "updateTime": "2024-04-05 10:00:00"
  },
  "time": "2024-04-05 10:00:00"
}
```

### 查询所有分类

- **URL**: `/categories`
- **方法**: `GET`
- **描述**: 查询所有服装分类，可选择是否以树形结构返回
- **权限要求**: 无需认证

**请求参数**:

| 参数名 | 类型 | 位置 | 必填 | 描述 |
| ----- | ---- | ---- | ---- | ---- |
| treeMode | Boolean | query | 否 | 是否以树形结构返回，默认false |

**响应示例1** (列表模式):

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "name": "夏季连衣裙",
      "description": "适合夏季穿着的各种连衣裙",
      "parentId": null,
      "sort": 2,
      "status": 1,
      "createTime": "2024-04-04 23:59:59"
    },
    {
      "id": 2,
      "name": "西装",
      "description": "正装西装",
      "parentId": null,
      "sort": 3,
      "status": 1,
      "createTime": "2024-04-04 23:59:59"
    }
  ],
  "time": "2024-04-05 10:00:00"
}
```

**响应示例2** (树形结构):

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "name": "夏季连衣裙",
      "description": "适合夏季穿着的各种连衣裙",
      "parentId": null,
      "sort": 2,
      "status": 1,
      "createTime": "2024-04-04 23:59:59",
      "children": [
        {
          "id": 3,
          "name": "短款连衣裙",
          "description": "短款夏季连衣裙",
          "parentId": 1,
          "sort": 1,
          "status": 1,
          "createTime": "2024-04-04 23:59:59",
          "children": []
        }
      ]
    },
    {
      "id": 2,
      "name": "西装",
      "description": "正装西装",
      "parentId": null,
      "sort": 3,
      "status": 1,
      "createTime": "2024-04-04 23:59:59",
      "children": []
    }
  ],
  "time": "2024-04-05 10:00:00"
}
```

---

## 订单管理接口

### 创建订单

- **URL**: `/orders`
- **方法**: `POST`
- **描述**: 创建新订单
- **权限要求**: 需要USER或ADMIN角色

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "userId": 1,
  "items": [
    {
      "clothesId": 1,
      "quantity": 1,
      "days": 5,
      "startDate": "2024-04-10",
      "endDate": "2024-04-15"
    },
    {
      "clothesId": 2,
      "quantity": 2,
      "days": 3,
      "startDate": "2024-04-10",
      "endDate": "2024-04-13"
    }
  ]
}
```

**字段说明**:

| 字段名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| userId | Long | 是 | 用户ID |
| items | Array | 是 | 订单项列表 |
| items.clothesId | Long | 是 | 服装ID |
| items.quantity | Integer | 是 | 租赁数量 |
| items.days | Integer | 是 | 租赁天数 |
| items.startDate | Date | 是 | 租赁开始日期（ISO格式：yyyy-MM-dd） |
| items.endDate | Date | 是 | 租赁结束日期（ISO格式：yyyy-MM-dd） |

**响应示例**:

```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "id": 1,
    "userId": 1,
    "totalAmount": 299.95,
    "status": "pending",
    "paymentStatus": "unpaid",
    "createdAt": "2024-04-04 23:59:59",
    "orderItems": [
      {
        "id": 1,
        "orderId": 1,
        "clothesId": 1,
        "quantity": 1,
        "pricePerDay": 39.99,
        "days": 5,
        "startDate": "2024-04-10",
        "endDate": "2024-04-15",
        "subtotal": 199.95
      },
      {
        "id": 2,
        "orderId": 1,
        "clothesId": 2,
        "quantity": 2,
        "pricePerDay": 16.67,
        "days": 3,
        "startDate": "2024-04-10",
        "endDate": "2024-04-13",
        "subtotal": 100.02
      }
    ]
  },
  "time": "2024-04-04 23:59:59"
}
```

### 查询订单列表

- **URL**: `/orders`
- **方法**: `GET`
- **描述**: 分页查询所有订单
- **权限要求**: 需要ADMIN角色

**请求参数**:

| 参数名 | 类型 | 位置 | 必填 | 描述 |
| ----- | ---- | ---- | ---- | ---- |
| page | Integer | query | 否 | 页码，默认1 |
| pageSize | Integer | query | 否 | 每页数量，默认10，最大100 |

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "items": [
      {
        "id": 1,
        "userId": 1,
        "totalAmount": 299.95,
        "status": "pending",
        "paymentStatus": "unpaid",
        "createdAt": "2024-04-04 23:59:59",
        "orderItems": [
          {
            "id": 1,
            "orderId": 1,
            "clothesId": 1,
            "quantity": 1,
            "pricePerDay": 39.99,
            "days": 5,
            "startDate": "2024-04-10",
            "endDate": "2024-04-15",
            "subtotal": 199.95
          }
        ]
      }
    ],
    "total": 1
  },
  "time": "2024-04-04 23:59:59"
}
```

### 查询用户订单

- **URL**: `/orders/user/{userId}`
- **方法**: `GET`
- **描述**: 分页查询指定用户的订单
- **权限要求**: 需要ADMIN角色或用户本人

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| userId | Long | 是 | 用户ID |

**请求参数**:

| 参数名 | 类型 | 位置 | 必填 | 描述 |
| ----- | ---- | ---- | ---- | ---- |
| page | Integer | query | 否 | 页码，默认1 |
| pageSize | Integer | query | 否 | 每页数量，默认10，最大100 |

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "items": [
      {
        "id": 1,
        "userId": 1,
        "totalAmount": 299.95,
        "status": "pending",
        "paymentStatus": "unpaid",
        "createdAt": "2024-04-04 23:59:59",
        "orderItems": [
          {
            "id": 1,
            "orderId": 1,
            "clothesId": 1,
            "quantity": 1,
            "pricePerDay": 39.99,
            "days": 5,
            "startDate": "2024-04-10",
            "endDate": "2024-04-15",
            "subtotal": 199.95
          }
        ]
      }
    ],
    "total": 1
  },
  "time": "2024-04-04 23:59:59"
}
```

### 根据ID查询订单

- **URL**: `/orders/{id}`
- **方法**: `GET`
- **描述**: 根据ID查询订单详情
- **权限要求**: 需要ADMIN角色或订单所有者

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 订单ID |

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "userId": 1,
    "totalAmount": 299.95,
    "status": "pending",
    "paymentStatus": "unpaid",
    "createdAt": "2024-04-04 23:59:59",
    "orderItems": [
      {
        "id": 1,
        "orderId": 1,
        "clothesId": 1,
        "quantity": 1,
        "pricePerDay": 39.99,
        "days": 5,
        "startDate": "2024-04-10",
        "endDate": "2024-04-15",
        "subtotal": 199.95
      }
    ]
  },
  "time": "2024-04-04 23:59:59"
}
```

### 取消订单

- **URL**: `/orders/{id}/cancel`
- **方法**: `PUT`
- **描述**: 取消订单
- **权限要求**: 需要ADMIN角色或订单所有者

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 订单ID |

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "订单取消成功",
  "data": true,
  "time": "2024-04-04 23:59:59"
}
```

### 完成订单

- **URL**: `/orders/{id}/complete`
- **方法**: `PUT`
- **描述**: 将订单标记为已完成
- **权限要求**: 需要ADMIN角色

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 订单ID |

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "订单完成",
  "data": true,
  "time": "2024-04-04 23:59:59"
}
```

### 更新订单状态

- **URL**: `/orders/{id}/status`
- **方法**: `PUT`
- **描述**: 更新订单状态
- **权限要求**: 需要ADMIN角色

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 订单ID |

**请求参数**:

| 参数名 | 类型 | 位置 | 必填 | 描述 |
| ----- | ---- | ---- | ---- | ---- |
| status | String | query | 是 | 新状态：pending(待处理), confirmed(已确认), canceled(已取消), completed(已完成) |

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "订单更新成功",
  "data": true,
  "time": "2024-04-04 23:59:59"
}
```

---

## 租赁管理接口

### 获取用户的所有租赁记录

- **URL**: `/rentals/user/{userId}`
- **方法**: `GET`
- **描述**: 获取指定用户的所有租赁记录
- **权限要求**: 需要ADMIN角色或用户本人

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| userId | Long | 是 | 用户ID |

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "orderItemId": 1,
      "userId": 1,
      "clothesId": 1,
      "startDate": "2024-04-10",
      "endDate": "2024-04-15",
      "returned": false,
      "returnDate": null,
      "lateFee": null,
      "rentalDays": 5
    }
  ],
  "time": "2024-04-04 23:59:59"
}
```

### 根据ID查询租赁记录

- **URL**: `/rentals/{id}`
- **方法**: `GET`
- **描述**: 根据ID查询租赁记录详情
- **权限要求**: 需要ADMIN角色或租赁所有者

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 租赁记录ID |

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "orderItemId": 1,
    "userId": 1,
    "clothesId": 1,
    "startDate": "2024-04-10",
    "endDate": "2024-04-15",
    "returned": false,
    "returnDate": null,
    "lateFee": null,
    "rentalDays": 5
  },
  "time": "2024-04-04 23:59:59"
}
```

### 查询所有未归还的租赁记录

- **URL**: `/rentals/not-returned`
- **方法**: `GET`
- **描述**: 查询所有未归还的租赁记录
- **权限要求**: 需要ADMIN角色

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "orderItemId": 1,
      "userId": 1,
      "clothesId": 1,
      "startDate": "2024-04-10",
      "endDate": "2024-04-15",
      "returned": false,
      "returnDate": null,
      "lateFee": null,
      "rentalDays": 5
    }
  ],
  "time": "2024-04-04 23:59:59"
}
```

### 归还服装

- **URL**: `/rentals/{id}/return`
- **方法**: `PUT`
- **描述**: 标记租赁记录为已归还状态
- **权限要求**: 需要ADMIN角色

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 租赁记录ID |

**请求参数**:

| 参数名 | 类型 | 位置 | 必填 | 描述 |
| ----- | ---- | ---- | ---- | ---- |
| returnDate | Date | query | 是 | 归还日期（ISO格式：yyyy-MM-dd） |
| lateFee | BigDecimal | query | 否 | 逾期费用，如果不提供会自动计算 |

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "服装归还成功",
  "data": true,
  "time": "2024-04-04 23:59:59"
}
```

### 延长租赁时间

- **URL**: `/rentals/{id}/extend`
- **方法**: `PUT`
- **描述**: 延长租赁时间
- **权限要求**: 需要ADMIN角色或租赁所有者

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 租赁记录ID |

**请求参数**:

| 参数名 | 类型 | 位置 | 必填 | 描述 |
| ----- | ---- | ---- | ---- | ---- |
| endDate | Date | query | 是 | 新的结束日期（ISO格式：yyyy-MM-dd） |

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "租赁延期成功",
  "data": {
    "id": 1,
    "orderItemId": 1,
    "userId": 1,
    "clothesId": 1,
    "startDate": "2024-04-10",
    "endDate": "2024-04-20",
    "returned": false,
    "returnDate": null,
    "lateFee": null,
    "rentalDays": 10
  },
  "time": "2024-04-04 23:59:59"
}
```

---

## 支付管理接口

### 创建支付

- **URL**: `/payments`
- **方法**: `POST`
- **描述**: 为订单创建支付记录
- **权限要求**: 需要USER或ADMIN角色

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "orderId": 1,
  "paymentMethod": "alipay",
  "amount": 299.95
}
```

**字段说明**:

| 字段名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| orderId | Long | 是 | 订单ID |
| paymentMethod | String | 是 | 支付方式：credit_card(信用卡), paypal, wechat(微信), alipay(支付宝) |
| amount | BigDecimal | 是 | 支付金额 |

**响应示例**:

```json
{
  "code": 200,
  "message": "支付创建成功",
  "data": {
    "id": 1,
    "orderId": 1,
    "paymentMethod": "alipay",
    "paymentStatus": "pending",
    "transactionId": "PAY20240404235959001",
    "amount": 299.95,
    "createdAt": "2024-04-04 23:59:59",
    "payUrl": "https://pay.example.com/pay?orderId=1&token=abc123"
  },
  "time": "2024-04-04 23:59:59"
}
```

### 查询支付状态

- **URL**: `/payments/{id}`
- **方法**: `GET`
- **描述**: 查询支付记录状态
- **权限要求**: 需要USER或ADMIN角色

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 支付记录ID |

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "orderId": 1,
    "paymentMethod": "alipay",
    "paymentStatus": "completed",
    "transactionId": "PAY20240404235959001",
    "amount": 299.95,
    "createdAt": "2024-04-04 23:59:59",
    "completedAt": "2024-04-05 00:05:00"
  },
  "time": "2024-04-05 10:00:00"
}
```

### 申请退款

- **URL**: `/payments/{id}/refund`
- **方法**: `POST`
- **描述**: 申请退款
- **权限要求**: 需要ADMIN角色

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| id | String | 是 | 支付记录ID |

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "refundReason": "用户取消订单",
  "refundAmount": 299.95
}
```

**字段说明**:

| 字段名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| refundReason | String | 是 | 退款原因 |
| refundAmount | BigDecimal | 是 | 退款金额，不能大于原支付金额 |

**响应示例**:

```json
{
  "code": 200,
  "message": "退款申请成功",
  "data": {
    "id": 1,
    "orderId": 1,
    "paymentMethod": "alipay",
    "paymentStatus": "refunded",
    "transactionId": "PAY20240404235959001",
    "refundId": "REF20240405100000001",
    "amount": 299.95,
    "refundAmount": 299.95,
    "refundReason": "用户取消订单",
    "createdAt": "2024-04-04 23:59:59",
    "completedAt": "2024-04-05 00:05:00",
    "refundedAt": "2024-04-05 10:00:00"
  },
  "time": "2024-04-05 10:00:00"
}
```

### 查询订单支付记录

- **URL**: `/payments/order/{orderId}`
- **方法**: `GET`
- **描述**: 查询订单的所有支付记录
- **权限要求**: 需要ADMIN角色或订单所有者

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| orderId | String | 是 | 订单ID |

**请求头**:

```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "orderId": 1,
      "paymentMethod": "alipay",
      "paymentStatus": "refunded",
      "transactionId": "PAY20240404235959001",
      "refundId": "REF20240405100000001",
      "amount": 299.95,
      "refundAmount": 299.95,
      "createdAt": "2024-04-04 23:59:59",
      "completedAt": "2024-04-05 00:05:00",
      "refundedAt": "2024-04-05 10:00:00"
    }
  ],
  "time": "2024-04-05 10:00:00"
}
```
