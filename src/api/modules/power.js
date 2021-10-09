import request from '../../utils/ajax.js'

export default {
  // 获取所有权限列表数据
  reqRightsList(type) {
    return request({
      url: `/rights/${type}`,
      method: 'get'
    })
  },

  // 获取所有角色列表数据
  reqRolesList() {
    return request({
      url: '/roles',
      method: 'get'
    })
  },

  // 删除角色指定权限
  reqDeleteRoleRight(roleId, rightId) {
    return request({
      url: `roles/${roleId}/rights/${rightId}`,
      method: 'delete'
    })
  },

  // 角色授权
  reqRoleRight(roleId, rids) {
    return request({
      url: `roles/${roleId}/rights`,
      method: 'post',
      data: { rids }
    })
  }
}
