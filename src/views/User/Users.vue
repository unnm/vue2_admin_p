<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8"
          ><el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <el-button type="primary" @click="addOrEditUser(true)"
              >添加用户</el-button
            >
          </div></el-col
        >
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="{ row }">
            <el-switch v-model="row.mg_state" @change="userStateChange(row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="{ row }">
            <!-- 修改按钮 -->
            <el-tooltip
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="addOrEditUser(false, row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      :title="isAddUser ? '添加用户' : '修改用户信息'"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed()"
    >
      <!-- 内容主体区域 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="addForm.username"
            :disabled="!isAddUser"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="isAddUser">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'User',
    data() {
      // 自定义的邮箱校验规则
      var checkEmail = (rule, value, callback) => {
        const regEmail =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (regEmail.test(value)) {
          callback()
        } else {
          callback(new Error('请输入合法的邮箱'))
        }
      }

      // 自定义的手机号校验规则
      var checkMobile = (rule, value, callback) => {
        const regMobile =
          /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)) {
          callback()
        } else {
          callback(new Error('手机号码格式不正确'))
        }
      }

      return {
        // 获取用户列表的参数对象
        queryInfo: {
          query: '',
          pagenum: 1, // 当前页数
          pagesize: 2 // 当前每页显示多少条数据
        },
        userList: [],
        total: 0,
        addDialogVisible: false, // 控制添加用户的对话框的显示与隐藏
        isAddUser: true, // 添加或修改用户的标识
        // 添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: '',
          id: ''
        },
        // 添加表单的验证规则对象
        addFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            {
              min: 3,
              max: 10,
              message: '用户名的长度在 3 到 10 个字符之间',
              trigger: 'blur'
            }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {
              min: 6,
              max: 15,
              message: '密码的长度在 6 到 15 个字符之间',
              trigger: 'blur'
            }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' }, // 验证邮箱是否为空
            { validator: checkEmail, trigger: 'blur' } // 验证邮箱是否合法
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' }, // 验证手机号是否为空
            { validator: checkMobile, trigger: 'blur' } // 验证手机号是否合法
          ]
        },
        // 控制分配角色对话框的显示与隐藏
        setRoleDialogVisible: false,
        // 需要被分配角色的用户信息
        userInfo: {},
        // 所有角色的数据列表
        rolesList: [],
        // 已选中的角色id值
        selectedRoleId: ''
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        const { query, pagenum, pagesize } = this.queryInfo
        const result = await this.$API.user.reqUserList(query, pagenum, pagesize)
        if (result.meta.status !== 200) {
          return this.$message.error('获取用户列表失败！')
        }
        this.userList = result.data.users
        this.total = result.data.total
      },
      // 监听pageSize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      // 监听页码值改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      // 监听switch开关状态的改变
      async userStateChange(userinfo) {
        const result = await this.$API.user.reqUserState(
          userinfo.id,
          userinfo.mg_state
        )
        if (result.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state
          return this.$message.error('更新用户状态失败!')
        }
        this.$message.success('更新用户状态成功！')
      },
      // 监听添加用户对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      // 添加或修改用户的回调函数
      async addOrEditUser(flag, id) {
        this.isAddUser = flag
        this.addDialogVisible = true
        if (id) {
          const result = await this.$API.user.reqUserInfo(id)
          if (result.meta.status !== 200) {
            return this.$message.error('查询用户信息失败！')
          }
          this.addForm = { ...result.data }
        }
      },
      // 点击确定按钮，提交表单
      submitForm() {
        this.$refs.addFormRef.validate(async (valid) => {
          if (valid) {
            // 验证通过，可以发起网络请求
            // 收集请求数据
            const { username, password, email, mobile, id } = this.addForm
            // 判断是添加用户还是修改用户
            if (this.isAddUser) {
              // 添加用户
              const result = await this.$API.user.addUser(
                username,
                password,
                email,
                mobile
              )
              if (result.meta.status !== 201) {
                return this.$message.error('添加用户失败！')
              }
              this.$message.success('添加用户成功！')
            } else {
              // 修改用户
              const result = await this.$API.user.reqEditUserInfo(
                id,
                email,
                mobile
              )
              if (result.meta.status !== 200) {
                return this.$message.error('修改用户信息失败！')
              }
              this.$message.success('修改用户信息成功！')
            }
            this.addDialogVisible = false
            this.getUserList()
          } else {
            // 验证未通过
            this.$message.error('表单验证未通过，请检查表单项')
            return false
          }
        })
      },
      // 删除用户的回调函数
      async deleteUser(id) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该用户, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch((err) => err)
        // 如果用户点击确认，则返回值为字符串 confirm
        // 如果用户确认取消，则返回值为字符串 cancel
        if (confirmResult === 'cancel') {
          // 取消删除
          return this.$message.info('已取消删除')
        } else if (confirmResult === 'confirm') {
          // 确认删除
          const result = await this.$API.user.reqDeleteUser(id)
          if (result.meta.status !== 200) {
            return this.$message.error('删除用户失败')
          }
          this.$message.success('删除成功!')
          this.getUserList()
        }
      },
      // 展示分配角色的对话框
      async setRole(userInfo) {
        this.userInfo = userInfo
        // 在展示对话框之前获取所有的角色列表
        const result = await this.$API.power.reqRolesList()
        if (result.meta.status !== 200) {
          return this.$message.error('获取角色列表失败！')
        }
        this.rolesList = result.data
        this.setRoleDialogVisible = true
      },
      // 点击按钮，分配角色
      async saveRoleInfo() {
        if (!this.selectedRoleId) {
          return this.$message.warning('请选择要分配的角色！')
        }
        const result = await this.$API.user.reqSetRoleRight(
          this.userInfo.id,
          this.selectedRoleId
        )
        if (result.meta.status !== 200) {
          return this.$message.error('分配角色失败！')
        }
        this.$message.success('分配角色成功！')
        this.getUserList()
        this.setRoleDialogVisible = false
      },
      // 监听分配角色对话框的关闭事件
      setRoleDialogClosed() {
        this.selectedRoleId = ''
        this.userInfo = {}
      }
    }
  }
</script>
