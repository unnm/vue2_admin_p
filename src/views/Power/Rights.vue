<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="{ row }">
            <el-tag v-if="row.level === '0'">{{ '一级' }}</el-tag>
            <el-tag type="success" v-else-if="row.level === '1'">{{
              '二级'
            }}</el-tag>
            <el-tag type="warning" v-else>{{ '三级' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Rights',
    data() {
      return {
        // 权限列表数据
        rightsList: []
      }
    },
    created() {
      this.getRightsList('list')
    },
    methods: {
      // 获取权限列表数据
      async getRightsList(type = 'list') {
        const result = await this.$API.power.reqRightsList(type)
        if (result.meta.status !== 200) {
          return this.$message.error('获取权限列表失败！')
        }
        this.rightsList = result.data
      }
    }
  }
</script>
