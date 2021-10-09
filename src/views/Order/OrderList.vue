<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="10">
        <!-- 搜索区域 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="260px">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100px">
        </el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="100px">
          <template slot-scope="{ row }">
            <el-tag type="success" v-if="row.order_pay === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100px">
        </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="{ row }">
            {{ row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              title="修改订单地址"
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              title="物流信息"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            @change="handleCascaderChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 展示物流进度的对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <!-- Timeline时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
  // 本地模拟的数据
  import cityData from './citydata.js'
  import progressInfo from './progressInfo.json'

  export default {
    name: 'OrderList',

    data() {
      return {
        queryInfo: {
          query: '', // 查询关键字参数
          pagenum: 1, // 当前页码
          pagesize: 10 // 每页显示条数
        },
        // 总数据条数
        total: 0,
        // 订单列表数据
        orderList: [],
        // 修改地址的对话框的显示与隐藏
        addressDialogVisible: false,
        addressForm: {
          address1: [],
          address2: ''
        },
        addressFormRules: {
          address1: [
            { required: true, message: '请选择省市区/县', trigger: 'blur' }
          ],
          address2: [
            { required: true, message: '请填写详细地址', trigger: 'blur' }
          ]
        },
        // 本地的省市区/县数据
        cityData: cityData,
        // 物流信息对话框的显示与隐藏
        progressDialogVisible: false,
        // 物流信息（接口出错，此处用本地模拟的数据）
        progressInfo: progressInfo.data
      }
    },

    created() {
      this.getOrderList()
    },

    methods: {
      // 请求参数列表数据
      async getOrderList() {
        const { query, pagenum, pagesize } = this.queryInfo
        const res = await this.$API.order.reqOrderList(query, pagenum, pagesize)
        if (res.meta.status !== 200) {
          return this.$message.error('获取订单列表失败！')
        }
        this.$message.success('获取订单列表成功！')
        this.total = res.data.total
        this.orderList = res.data.goods
      },
      // 	pageSize 改变时会触发
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getOrderList()
      },
      // currentPage 改变时会触发
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getOrderList()
      },
      // 展示修改地址的对话框
      showBox() {
        this.addressDialogVisible = true
      },
      // 监听修改地址对话框的关闭事件
      addressDialogClosed() {
        this.$refs.addressFormRef.resetFields()
      },
      handleCascaderChange() {
        console.log(this.addressForm.address1)
      },
      async showProgressBox() {
        // 供测试的物流单号：1106975712662
        // const testId = '1106975712662'
        // const res = await this.$API.order.reqKuaiDi(testId)
        // if (res.meta.status !== 200) {
        //   return this.$message.error('获取物流信息失败！')
        // }
        // this.$message.success('获取物流信息成功！')
        // this.progressInfo = res.data
        this.progressDialogVisible = true
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-cascader {
    width: 100%;
  }
</style>