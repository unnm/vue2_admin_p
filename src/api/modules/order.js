import request from '../../utils/ajax.js'

export default {
  // 请求订单数据列表
  reqOrderList(
    query = undefined,
    pagenum,
    pagesize,
    user_id = undefined,
    cc = undefined,
    pay_status = undefined,
    is_send = undefined,
    order_fapiao_title = undefined,
    order_fapiao_company = undefined,
    order_fapiao_content = undefined,
    consignee_addr = undefined
  ) {
    return request({
      url: 'orders',
      method: 'get',
      params: {
        query,
        pagenum,
        pagesize,
        user_id,
        cc,
        pay_status,
        is_send,
        order_fapiao_title,
        order_fapiao_company,
        order_fapiao_content,
        consignee_addr
      }
    })
  },

  // 查看物流信息
  // 供测试的物流单号：1106975712662
  reqKuaiDi(id) {
    return request({
      url: `/kuaidi/${id}`,
      method: 'get'
    })
  }
}
