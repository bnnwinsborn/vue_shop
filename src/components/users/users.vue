<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片式图区域 -->
    <el-card>
      <!--  -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" @click="getUserList" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="adddialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--  -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch @change="userStateChange(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showUser(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="adddialogVisible" width="50%" @closed="AddDialogClose('addFormRef')">
      <el-form :model="addFrom" :rules="addFromRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser('addFormRef')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
<el-dialog title="用户" :visible.sync="editdialogVisible" width="50%" @closed="EditDialogClose('editFormRef')">
      <el-form :model="editFrom" :rules="editFromRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editFrom.username" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser('editFormRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: [],
  data () {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, cb) => {
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (reg.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      adddialogVisible: false,
      addFrom: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFromRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editdialogVisible: false,
      editFrom: {
        username: '',
        email: '',
        mobile: ''
      },
      editFromRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userList = res.data.users
      this.total = res.data.total
      //   console.log(res)
    },
    // 改变每页多少条
    handleSizeChange (size) {
      this.queryInfo.pagesize = size
      this.getUserList()
    },
    // 具体的页面
    handleCurrentChange (num) {
      this.queryInfo.pagenum = num
      this.getUserList()
    },
    // 修改用户状态
    async userStateChange (row) {
      await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      this.$message({
        message: '修改用户状态成功',
        type: 'success',
        showClose: true
      })
    },
    // 清空表单
    AddDialogClose (addFormRef) {
      this.$refs[addFormRef].resetFields()
    },
    // 添加用户
    addUser (addFormRef) {
      // 表单预校验
      this.$refs[addFormRef].validate(async item => {
        if (!item) return
        // 验证成功 发送请求
        const { data: res } = await this.$http.post('users', this.addFrom)
        if (res.meta.status !== 201) {
          this.$message({
            message: res.meta.msg,
            type: 'error',
            showClose: true
          })
        } else {
          this.$message({
            message: res.meta.msg,
            type: 'success',
            showClose: true
          })
          // 关闭对话框
          this.adddialogVisible = false
          // 重新获取用户列表
          this.getUserList()
        }
      })
    },
    // 查询用戶并渲染到表单
    async showUser (id) {
      // console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return
      }
      this.$message({
        message: res.meta.msg,
        type: 'success',
        showClose: true
      })
      this.editFrom = res.data
      this.editdialogVisible = true
    },
    // 清空校验状态
    EditDialogClose (editFormRef) {
      this.$refs[editFormRef].resetFields()
    },
    // 提交修改
    editUser (editFormRef) {
      this.$refs[editFormRef].validate(async item => {
        if (!item) return
        const { data: res } = await this.$http.put('users/' + this.editFrom.id, this.editFrom)
        console.log(res)
        if (res.meta.status !== 200) {
          return
        }
        this.editdialogVisible = false
        this.getUserList()
        this.$message({
          message: res.meta.msg,
          type: 'success',
          showClose: true
        })
      })
    },
    // 删除用户
    removeUserById (id) {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: async action => {
          if (action === 'confirm') {
            await this.$http.delete('users/' + id)
            this.$message({
              message: '删除成功',
              type: 'success',
              showClose: true
            })
            this.getUserList()
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
