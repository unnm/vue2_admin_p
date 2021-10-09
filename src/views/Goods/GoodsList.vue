<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="{ row }">
            {{ row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'GoodsList',

    data() {
      return {
        // 查询参数对象
        queryInfo: {
          query: '', // 查询关键字
          pagenum: 1, // 当前页码
          pagesize: 10 // 每页显示条数
        },
        // 商品列表数据
        goodsList: [],
        // 总数据条数
        total: 0
      }
    },

    components: {},

    created() {
      this.getGoodsList()
    },

    mounted() {},

    computed: {
      // 商品创建时间
      goodsAddTime() {
        return 3
      }
    },

    methods: {
      // 根据分页获取对应的商品列表数据
      async getGoodsList() {
        const { query, pagenum, pagesize } = this.queryInfo
        const res = await this.$API.goods.reqGoodsList(query, pagenum, pagesize)
        if (res.meta.status !== 200) {
          this.$message.error('获取商品列表数据失败！')
        }
        this.$message.success('获取商品列表数据成功！')
        this.goodsList = res.data.goods
        this.total = res.data.total
      },
      // 每页条数改变的回调函数
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getGoodsList()
      },
      // 当前页码值改变的回调函数'
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getGoodsList()
      },
      async removeById(goods_id) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该商品, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch((err) => err)
        if (confirmResult === 'cancel') {
          return this.$message.info('已取消删除！')
        }
        const res = await this.$API.goods.reqDeleteGoodsById(goods_id)
        if (res.meta.status !== 200) {
          return this.$message.error('删除商品失败！')
        }
        this.$message.success('删除商品成功！')
        this.getGoodsList()
      },
      // 点击添加商品按钮，去往添加商品页面
      goAddPage() {
        this.$router.push('/goods/add')
      }
    }
  }
</script>

<style lang="less" scoped>
</style>