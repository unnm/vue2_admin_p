import request from '../../utils/ajax.js'

export default {
  // 基于时间统计的折线图数据
  reqReportChart() {
    return request({
      url: 'reports/type/1',
      method: 'get'
    })
  }
}
