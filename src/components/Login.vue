<template>
  <div class="login_container">
    <div class="login_box">
      <div class="acatar_box">
        <img alt src="../assets/avatar.jpg" v-image-preview />
        <p>GLA电商后台管理系统</p>
      </div>

      <!-- 登录表单区域 -->
      <el-form
        :model="LoginForm"
        :rules="LoginFormRules"
        class="login_from"
        label-width="70px"
        ref="resetFormRef"
      >
        <!-- 用户名 -->
        <el-form-item label="账号:" prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="LoginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码:" prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            show-password
            type="password"
            v-model="LoginForm.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button @click="loginFrom('resetFormRef')" round type="primary">登录</el-button>
          <el-button @click="resetForm('resetFormRef')" round type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="welcome_box">
      <div class="one">Welcome</div>
      <div class="two">GLA全球电商平台，全球重大项目物流一站式解决方案</div>
    </div>
    <div class="icon">
      <i prefix-icon="iconfont icon-pingguo"></i>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      LoginForm: {
        username: 'admin',
        password: '123456'
      },
      //  表单验证对象(用户名和密码)
      LoginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm (resetFormRef) {
      // console.log(this)
      // 重置文本框的内容resetFileds()
      this.$refs[resetFormRef].resetFields()
    },
    loginFrom (resetFormRef) {
      this.$refs[resetFormRef].validate(async item => {
        // console.log(item)
        if (!item) return
        const { data: res } = await this.$http.post('login', this.LoginForm)
        // console.log('res', res)
        if (res.meta.status !== 200) {
          this.$message({
            message: '登陆失败',
            type: 'error',
            showClose: true
          })
        } else {
          this.$message({
            message: '登录成功',
            type: 'success',
            showClose: true
          })
          sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-image: url('../assets/bg.jpg');
  background-size: 100%;
  height: 100%;
}
.login_box {
  width: 400px;
  height: 100%;
  background-color: #fff;
  // border-radius: 5px;
  position: absolute;
  top: 0;
  left: 0;
  .acatar_box {
    height: 165px;
    width: 165px;
    border: 1px solid #ccc;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    top: 25%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_from {
  position: absolute;
  bottom: 20%;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: center;
}
img {
  cursor: pointer;
}
.welcome_box {
  color: #66b1ff;
  position: absolute;
  top: 10%;
  right: 30%;
  .one {
    font-size: 60px;
    padding-left: 10px;
  }
}
.icon {
  position: absolute;
  right: 0;
  bottom: 0;
  color: #fff;
  font-size: 30pxx;
}
</style>
