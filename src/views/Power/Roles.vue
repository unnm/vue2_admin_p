<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <el-row
              :class="['vcenter', 'bdbottom', index1 === 0 ? 'bdtop' : '']"
              v-for="(item1, index1) in row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for循环 嵌套渲染二级权限 -->
                <el-row
                  :class="['vcenter', index2 === 0 ? '' : 'bdtop']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRightById(row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 通过 for循环 嵌套渲染三级权限 -->
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column prop="name" label="操作" width="300px">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightDialog(row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        ref="treeRef"
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Roles',
    data() {
      return {
        // 角色列表数据
        rolesList: [],
        // 控制分配权限对话框的显示与隐藏
        setRightDialogVisible: false,
        // 权限列表数据
        rightsList: [],
        // 树形控件的属性绑定对象
        treeProps: {
          label: 'authName', // 指定看到的是哪一个字段属性
          children: 'children' // 指定父子嵌套用的是哪一个属性
        },
        // 默认选中的节点id值数组
        defaultCheckedKeys: [],
        // 当前即将分配权限的角色id
        roleId: ''
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      // 获取角色列表数据
      async getRolesList() {
        const result = await this.$API.power.reqRolesList()
        if (result.meta.status !== 200) {
          return this.$message.error('获取角色列表数据失败！')
        }
        this.rolesList = result.data
      },
      // 根据id删除对应的权限
      async removeRightById(role, rightId) {
        // 弹框提示用户是否要删除
        const confirmResult = await this.$confirm(
          '此操作将永久删除该文件, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch((err) => err)
        if (confirmResult === 'cancel') {
          // 取消删除
          return this.$message.info('已取消删除')
        } else if (confirmResult === 'confirm') {
          // 确认删除
          const result = await this.$API.power.reqDeleteRoleRight(
            role.id,
            rightId
          )
          if (result.meta.status !== 200) {
            return this.$message.error('删除权限失败！')
          }
          this.$message.success('删除权限成功！')
          // 若重新发请求获取所有角色列表数据，则表格会重新渲染，其打开状态会被取消
          // this.getRolesList()
          // 注意：响应的数据中包含了当前角色下最新的权限数据
          role.children = result.data
        }
      },
      // 展示分配的对话框
      async showSetRightDialog(role) {
        this.roleId = role.id
        // 获取所有的权限数据
        const result = await this.$API.power.reqRightsList('tree')
        if (result.meta.status !== 200) {
          return this.$message.error('获取权限数据失败！')
        }
        // 把获取到的权限数据保存到data中
        this.rightsList = result.data
        // 递归收集所有的三级权限id
        this.getLeafKeys(role, this.defaultCheckedKeys)
        this.setRightDialogVisible = true
      },
      // 通过递归的形式，收集角色下所有三级权限的id，并保存到 defaultCheckedKeys 数组中
      getLeafKeys(node, arr) {
        // 如果当前 node 节点不包含 children 属性，则是三级节点
        if (!node.children) {
          return arr.push(node.id)
        }
        // 否则就不是三级节点
        node.children.forEach((item) => {
          this.getLeafKeys(item, arr)
        })
      },
      //监听分配权限对话框的关闭事件
      setRightDialogClosed() {
        this.defaultCheckedKeys = []
      },
      // 点击按钮为角色分配权限
      async allotRights() {
        const tree = this.$refs.treeRef
        const keys = [...tree.getCheckedKeys(), ...tree.getHalfCheckedKeys()]
        const idStr = keys.join(',')
        const result = await this.$API.power.reqRoleRight(this.roleId, idStr)
        if (result.meta.status !== 200) {
          return this.$message.error('分配权限失败！')
        }
        this.$message.success('分配权限成功！')
        this.getRolesList()
        this.setRightDialogVisible = false
      }
    }
  }
</script>

<style scoped lang="less">
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  // 纵向居中对齐
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>