import { createRouter, createWebHistory } from 'vue-router'

import LayoutView from '@/views/layout/index.vue'
import IndexView from '@/views/index/index.vue'
import ClazzView from '@/views/clazz/index.vue'
import StuView from '@/views/stu/index.vue'
import DeptView from '@/views/dept/index.vue'
import EmpView from '@/views/emp/index.vue'
import EmpReportView from '@/views/report/emp/index.vue'
import StuReportView from '@/views/report/stu/index.vue'
import LogView from '@/views/log/index.vue'
import LoginView from '@/views/login/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/index' },
    { path: '/login', name: 'login', component: LoginView },
    {
      path: '/',
      component: LayoutView,
      children: [
        { path: 'index', name: 'index', component: IndexView },
        { path: 'clazz', name: 'clazz', component: ClazzView },
        { path: 'stu', name: 'stu', component: StuView },
        { path: 'dept', name: 'dept', component: DeptView },
        { path: 'emp', name: 'emp', component: EmpView },
        { path: 'report', redirect: '/report/emp' },
        { path: 'report/emp', name: 'empReport', component: EmpReportView },
        { path: 'report/stu', name: 'stuReport', component: StuReportView },
        { path: 'log', name: 'log', component: LogView }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
    return
  }

  const loginUserStr = localStorage.getItem('loginUser')
  if (!loginUserStr) {
    next('/login')
    return
  }

  try {
    const loginUser = JSON.parse(loginUserStr)
    if (loginUser && loginUser.token) {
      next()
      return
    }
  } catch (error) {
    localStorage.removeItem('loginUser')
  }

  next('/login')
})

export default router
