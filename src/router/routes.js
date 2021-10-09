export default [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: () => import('@/views/Home/Welcome/Welcome.vue')
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('@/views/User/Users.vue')
      },
      {
        path: '/rights',
        name: 'Rights',
        component: () => import('@/views/Power/Rights.vue')
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () => import('@/views/Power/Roles.vue')
      },
      {
        path: '/categories',
        name: 'Category',
        component: () => import('@/views/Goods/Category.vue')
      },
      {
        path: '/params',
        name: 'GoodsParams',
        component: () => import('@/views/Goods/GoodsParams.vue')
      },
      {
        path: '/goods',
        name: 'GoodsList',
        component: () => import('@/views/Goods/GoodsList.vue')
      },
      {
        path: '/goods/add',
        name: 'AddGoods',
        component: () => import('@/views/Goods/AddGoods.vue')
      },
      {
        path: '/orders',
        name: 'OrderList',
        component: () => import('@/views/Order/OrderList.vue')
      },
      {
        path: '/reports',
        name: 'Report',
        component: () => import('@/views/Report/Report.vue')
      }
    ]
  }
]
