<template>
    <div class="login_container">
        <div class="login_box">
            <div class="acatar_box">
                <img v-image-preview src="../assets/avatar.jpg" alt="">
            </div>
            <!-- 登录表单区域 -->
        <el-form :model="LoginForm" :rules="LoginFormRules" ref="resetFormRef" label-width="70px" class="login_from">
            <!-- 用户名 -->
            <el-form-item prop="username" label="账号">
              <el-input prefix-icon="iconfont icon-user" v-model="LoginForm.username"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password" label="密码:">
              <el-input prefix-icon="iconfont icon-3702mima" show-password v-model="LoginForm.password" type="password"></el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item class="btns">
                <el-button type="primary" @click="loginFrom('resetFormRef')">登录</el-button>
                <el-button type="info" @click="resetForm('resetFormRef')">重置</el-button>
            </el-form-item>
        </el-form>
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
.login_container{
    background-image: url('../assets/bg.jpg');
    background-size:100%;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #3bc0d1;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .acatar_box{
        height: 130px;
        width: 130px;
        border:1px solid #ccc;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.login_from{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns{
    display:flex;
    justify-content: center;
}
img{
  cursor: pointer;
}
</style>
