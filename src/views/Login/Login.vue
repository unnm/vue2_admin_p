<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="~@/assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="handleLogin('numberValidateForm')"
            >登录</el-button
          >
          <el-button type="info" @click="resetLoginForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        // 登录表单的数据绑定对象
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        // 表单验证规则对象
        loginFormRules: {
          // 用户名验证规则
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          // 密码验证规则
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 点击登录
      handleLogin() {
        this.$refs.loginFormRef.validate(async (valid) => {
          if (valid) {
            // 前端验证通过
            // 整理请求参数
            const { username, password } = this.loginForm
            const result = await this.$API.user.reqLogin(username, password)
            // console.log(result)
            if (result.meta.status === 200) {
              // 登录成功
              this.$message.success('登录成功！')
              // 保存token
              sessionStorage.setItem('token', result.data.token)
              // 跳转至首页
              this.$router.push('/home')
            } else {
              // 登录失败
              this.$message.error('登录失败！')
              return false
            }
          } else {
            // 前端验证失败
            this.$message.error('表单项不符合要求')
            return false
          }
        })
      },
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields()
      }
    }
  }
</script>

<style scoped lang="less">
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
    position: relative;

    .login_box {
      position: relative;
      width: 450px;
      height: 300px;
      background-color: #fff;
      border-radius: 5px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .avatar_box {
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        box-shadow: 0 0 10px #ddd;
        padding: 10px;
        background-color: #fff;

        img {
          width: 100%;
          height: 100%;
          background-color: #eee;
          border-radius: 50%;
        }
      }

      // 登录区域
      .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;

        // 登录按钮
        .btns {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
</style>