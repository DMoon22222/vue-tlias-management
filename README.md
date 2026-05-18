# Tlias 智能学习辅助系统前端

这是一个基于 `Vue 3 + Vite + Element Plus + Axios + Vue Router` 开发的后台管理前端项目，用于对接 Tlias 智能学习辅助系统后端，完成基础信息维护、班级学员管理、数据统计和日志查看等功能。

项目当前已经对接以下业务模块：

- 登录与登录态校验
- 首页布局与菜单导航
- 部门管理
- 员工管理
- 班级管理
- 学员管理
- 员工信息统计
- 学员信息统计
- 日志信息统计

## 技术栈

- `Vue 3`
- `Vite`
- `Vue Router 4`
- `Element Plus`
- `Axios`
- `ECharts`

## 运行环境

- `Node.js` 16 及以上
- `npm`
- 已启动的后端服务，默认地址为 `http://localhost:8080`

## 安装依赖

```bash
npm install
```

## 启动项目

```bash
npm run dev
```

默认开发地址通常为：

```text
http://localhost:5173
```

## 生产构建

```bash
npm run build
```

## 代码检查

```bash
npm run lint
```

## 接口代理说明

项目在 [vite.config.js](/C:/Users/15614/Desktop/vue/vue-tlias-management/vue-tlias-management/vite.config.js:1) 中配置了开发代理：

- 前端请求 `/api/**`
- Vite 自动转发到 `http://localhost:8080/**`

例如：

- 前端请求：`/api/emps`
- 实际后端请求：`http://localhost:8080/emps`

## 登录态说明

项目当前采用本地存储 + 路由守卫 + 请求拦截的方式维护登录状态。

- 登录成功后，会将后端返回的登录信息保存到 `localStorage` 中的 `loginUser`
- 路由守卫会检查是否存在有效 `token`
- 请求拦截器会自动把 `token` 放到请求头中
- 当后端返回 `401` 时，前端会清除本地登录信息并跳回登录页

相关文件：

- [src/router/index.js](/C:/Users/15614/Desktop/vue/vue-tlias-management/vue-tlias-management/src/router/index.js:1)
- [src/utils/request.js](/C:/Users/15614/Desktop/vue/vue-tlias-management/vue-tlias-management/src/utils/request.js:1)
- [src/views/login/index.vue](/C:/Users/15614/Desktop/vue/vue-tlias-management/vue-tlias-management/src/views/login/index.vue:1)

## 项目目录

```text
vue-tlias-management
├─ public
├─ src
│  ├─ api
│  │  ├─ clazz.js
│  │  ├─ dept.js
│  │  ├─ emp.js
│  │  ├─ log.js
│  │  ├─ login.js
│  │  ├─ report.js
│  │  └─ stu.js
│  ├─ assets
│  ├─ router
│  │  └─ index.js
│  ├─ utils
│  │  └─ request.js
│  ├─ views
│  │  ├─ clazz
│  │  ├─ dept
│  │  ├─ emp
│  │  ├─ index
│  │  ├─ layout
│  │  ├─ log
│  │  ├─ login
│  │  ├─ report
│  │  └─ stu
│  ├─ App.vue
│  └─ main.js
├─ package.json
└─ vite.config.js
```

## 功能模块说明

### 1. 登录模块

- 员工登录
- 登录成功后保存用户信息
- 无登录信息时自动跳转登录页

### 2. 系统信息管理

- 部门管理
  - 列表查询
  - 新增部门
  - 编辑部门
  - 删除部门
- 员工管理
  - 条件分页查询
  - 新增员工
  - 编辑员工
  - 单个删除 / 批量删除
  - 头像上传
  - 工作经历维护

### 3. 班级学员管理

- 班级管理
  - 条件分页查询
  - 新增班级
  - 编辑班级
  - 删除班级
- 学员管理
  - 条件分页查询
  - 新增学员
  - 编辑学员
  - 单个删除 / 批量删除
  - 违纪处理

### 4. 数据统计管理

- 员工信息统计
  - 员工职位统计柱状图
  - 员工性别统计环形图
- 学员信息统计
  - 班级人数统计柱状图
  - 学员学历统计环形图
- 日志信息统计
  - 操作日志分页查询
  - 支持查看请求参数摘要

## 主要页面文件

- [src/views/layout/index.vue](/C:/Users/15614/Desktop/vue/vue-tlias-management/vue-tlias-management/src/views/layout/index.vue:1)
- [src/views/dept/index.vue](/C:/Users/15614/Desktop/vue/vue-tlias-management/vue-tlias-management/src/views/dept/index.vue:1)
- [src/views/emp/index.vue](/C:/Users/15614/Desktop/vue/vue-tlias-management/vue-tlias-management/src/views/emp/index.vue:1)
- [src/views/clazz/index.vue](/C:/Users/15614/Desktop/vue/vue-tlias-management/vue-tlias-management/src/views/clazz/index.vue:1)
- [src/views/stu/index.vue](/C:/Users/15614/Desktop/vue/vue-tlias-management/vue-tlias-management/src/views/stu/index.vue:1)
- [src/views/report/emp/index.vue](/C:/Users/15614/Desktop/vue/vue-tlias-management/vue-tlias-management/src/views/report/emp/index.vue:1)
- [src/views/report/stu/index.vue](/C:/Users/15614/Desktop/vue/vue-tlias-management/vue-tlias-management/src/views/report/stu/index.vue:1)
- [src/views/log/index.vue](/C:/Users/15614/Desktop/vue/vue-tlias-management/vue-tlias-management/src/views/log/index.vue:1)

## 后端对接说明

本前端项目假设后端已提供以下能力：

- 登录接口：`POST /login`
- 部门接口：`/depts`
- 员工接口：`/emps`
- 班级接口：`/clazzs`
- 学员接口：`/students`
- 统计接口：`/report/**`
- 日志接口：`/log/page`
- 上传接口：`/upload`

如果后端接口路径、字段名或认证方式发生变化，需要同步调整：

- `src/api/*`
- `src/utils/request.js`
- 对应页面中的表单字段与表格列

## 开发建议

- 新增模块时优先先补 `src/api`，再补页面逻辑
- 列表页统一保持“查询条件 + 表格 + 分页 + 对话框”的结构
- 如果对接新接口，先确认返回结构是否仍为：

```json
{
  "code": 1,
  "msg": "success",
  "data": {}
}
```

## 注意事项

- 统计页面依赖 `echarts`
- 开发环境依赖 Vite 代理，请确保后端运行在 `8080` 端口
- 若页面刷新后被自动跳回登录页，请先确认：
  - 浏览器本地是否存在 `loginUser`
  - 后端登录过滤器是否已启用
  - 后端返回的 `token` 是否有效

## 当前状态

这个项目目前已经从初始模板扩展为一个可联调的教学管理后台前端骨架，适合继续补充：

- 修改密码
- 首页仪表盘
- 更完整的异常处理
- 统一表单抽象
- 主题与样式优化

