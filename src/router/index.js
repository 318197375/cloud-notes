import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/Login',
    name: 'Login',
    meta: {
      title: "登录页面"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login')
  },
  {
    path: '/',
    name: 'Menu',
    meta: {
      title: "云笔记主页"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Menu')
  },
  // {
  //   path: '/Markdown',
  //   name: 'Markdown',
  //   meta: {
  //     title: "云笔记主页"
  //   },
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Markdown')
  // },
  {
    path: '/Register',
    name: 'Register',
    meta: {
      title: "注册页面"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Register')
  },
  {
    path: '/User',
    name: 'User',
    meta: {
      title: "个人空间"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/User')
  },
  {
    path: '/ArticleInfo',
    name: 'ArticleInfo',
    meta: {
      title: "笔记中心"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ArticleInfo')

  },
  // {
  //   path: '/ArticleCreate',
  //   name: 'ArticleCreate',
  //
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/ArticleCreate')
  // },
  {
    path: '/ArticleContent',
    name: 'ArticleContent',
    meta: {
      title: "笔记编写"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ArticleContent')
  },
  {
    path: '/ArticleShow',
    name: 'ArticleShow',
    meta: {
      title: "查看笔记"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ArticleShow')
  },
  {
    path: '/Message/:messageCounter/:defaultActive',
    name: 'Message',
    meta: {
      title: "消息中心"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Message')
  },
  {
    path: '/CollectShow/:defaultActive',
    name: 'CollectShow',
    meta: {
      title: "收藏中心"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/CollectShow')
  },
  {
    path: '/PowerManage/:defaultActive',
    name: 'PowerManage',
    meta: {
      title: "权限管理中心"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/PowerManage')
  },
  {
    path: '/RePwd',
    name: 'PowerManage',
    meta: {
      title: "找回密码"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/RePwd')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.meta.title) {
    document.title = to.meta.title;
  }

  next();
})

export default router
