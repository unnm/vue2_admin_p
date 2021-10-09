// 这个文件写的都是函数，我们叫接口请求函数
// 以后我们的每个接口都对应一个函数，如果想要拿相关接口的数据，只需要调用相关的接口请求函数即可
import request from '../../utils/ajax.js'

// axios使用：函数用法、对象用法
// 三种参数：params参数、query参数、请求体参数
// 1) params参数：是在url中携带的，属于路径的一部分
// 2) query参数：可以在url当中携带，以？分隔，后面就是query参数
//           也可以在配置对象当中去配置，而配置的属性名叫params
// 3) 请求体参数：是在配置对象当中data里面配置，请求方式是put和post才有请求体参数
/*
axios({
  url: 'localhost:8080/userinfo/hehe?name=joker',
  method: ,
  params: {
    // 特别注意：这里代表query参数
    name: 'joker'
  },
  data: {
    // 这里配的是请求体参数
  }
}) */

// 请求三级分类列表数据
// /qpi/product/getBaseCategooryList
// get
// 无参数
/* export const reqCategoryList = () => {
  return request({
    url: '/get/product/getBaseCategoryList',
    method: 'get'
  })
} */
// 验证请求是否成功
// reqCategoryList() // 这里如果要调用，得把模块引入到main当中

// 请求登录
export const reqLogin = (username, password) => {
  return request({
    url: '/login',
    method: 'post',
    data: { username, password }
  })
}

// 请求左侧菜单权限
export const reqMenuList = () => {
  return request({
    url: '/menus',
    method: 'get'
  })
}

// 获取用户列表数据
export const reqUserList = (query, pagenum, pagesize) => {
  return request({
    url: '/users',
    method: 'get',
    params: { query, pagenum, pagesize }
  })
}

// 修改用户状态
export const reqUserState = (uId, type) => {
  return request({
    url: `users/${uId}/state/${type}`,
    method: 'put'
  })
}

// 添加用户
export const addUser = (username, password, email, mobile) => {
  return request({
    url: '/users',
    method: 'post',
    data: { username, password, email, mobile }
  })
}

// 根据ID查询用户信息
export const reqUserInfo = id => {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

// 根据ID修改用户信息
export const reqEditUserInfo = (id, email, mobile) => {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data: { email, mobile }
  })
}

// 删除单个用户
export const reqDeleteUser = id => {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

// 分配用户角色
export const reqSetRoleRight = (id, rid) => {
  return request({
    url: `users/${id}/roles`,
    method: 'put',
    data: { rid }
  })
}
