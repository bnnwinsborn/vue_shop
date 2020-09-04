import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/Login.vue'
import home from '../components/Home.vue'
import welcome from '../components/Welcome.vue'
import users from '../components/users/users.vue'
import rights from '../components/rights/rights.vue'
import roles from '../components/roles/roles.vue'
import goodscate from '../components/goods/goodscate.vue'
import parmas from '../components/goods/parmas.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: welcome
      },
      {
        path: '/users',
        name: 'users',
        component: users
      },
      {
        path: '/rights',
        name: 'rights',
        component: rights
      },
      {
        path: '/roles',
        name: 'roles',
        component: roles
      },
      {
        path: '/categories',
        name: 'goodscate',
        component: goodscate
      },
      {
        path: '/params',
        name: 'parmas',
        component: parmas
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const toKen = window.sessionStorage.getItem('token')
  if (!toKen) next('/login')
  next()
})

export default router
