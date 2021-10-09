import request from '../../utils/ajax.js'

export default {
  // 请求商品分类数据列表
  reqGoodsCateList(type = 3, pagenum = undefined, pagesize = undefined) {
    return request({
      url: '/categories',
      method: 'get',
      params: { type, pagenum, pagesize }
    })
  },

  // 添加分类
  reqAddCate(cat_pid, cat_name, cat_level) {
    return request({
      url: '/categories',
      method: 'post',
      data: { cat_pid, cat_name, cat_level }
    })
  },

  // 根据 id 查询分类
  reqCateById(id) {
    return request({
      url: `/categories/${id}`
    })
  },

  // 编辑提交分类
  reqEditCate(id, cat_name) {
    return request({
      url: `/categories/${id}`,
      data: { cat_name }
    })
  },

  // 删除分类
  reqDeleteCate(id) {
    return request({
      url: `/categories/${id}`,
      method: 'delete'
    })
  },

  // 获取参数列表数据
  // sel 不能为空，值为only或many，分别代表静态参数或动态参数
  reqCateList(id, sel) {
    return request({
      url: `categories/${id}/attributes`,
      method: 'get',
      params: { sel }
    })
  },

  // 添加动态参数或静态属性
  reqAddCateAttr(id, attr_name, attr_sel, attr_vals = undefined) {
    return request({
      url: `categories/${id}/attributes`,
      method: 'post',
      data: { attr_name, attr_sel, attr_vals }
    })
  },

  // 根据id查询参数
  reqCateAttrById(id, attrId, attr_sel, attr_vals = undefined) {
    return request({
      url: `categories/${id}/attributes/${attrId}`,
      method: 'get',
      params: { attr_sel, attr_vals }
    })
  },

  // 编辑提交参数
  reqSubmitCateAttr(id, attrId, attr_name, attr_sel, attr_vals = undefined) {
    return request({
      url: `categories/${id}/attributes/${attrId}`,
      method: 'put',
      data: { attr_name, attr_sel, attr_vals }
    })
  },

  // 删除参数
  reqDeleteCateAttr(id, attrId) {
    return request({
      url: `categories/${id}/attributes/${attrId}`,
      method: 'delete'
    })
  },

  // 获取商品列表数据
  reqGoodsList(query = undefined, pagenum, pagesize) {
    return request({
      url: 'goods',
      method: 'get',
      params: { query, pagenum, pagesize }
    })
  },

  // 删除商品
  reqDeleteGoodsById(id) {
    return request({
      url: `goods/${id}`,
      method: 'delete'
    })
  },

  // 添加商品
  reqAddGoods(
    goods_name,
    goods_cat,
    goods_price,
    goods_number,
    goods_weight,
    goods_introduce = undefined,
    pics = undefined,
    attrs = undefined
  ) {
    return request({
      url: 'goods',
      method: 'post',
      data: {
        goods_name,
        goods_cat,
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics,
        attrs
      }
    })
  }
}
