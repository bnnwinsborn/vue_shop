<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="addRole" type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column label type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',index1 === 0?'bdtop':'','vcenter']"
              :key="item1.id"
              v-for="(item1,index1) in scope.row.children"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag type>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[index2 === 0?'':'bdtop','vcenter']"
                  :key="item2.id"
                  v-for="(item2,index2) in item1.children"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      :key="item3.id"
                      @close="removeRightsById(scope.row,item3.id)"
                      closable
                      type="warning"
                      v-for="(item3) in item2.children"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              @click="showUser(scope.row.id)"
              icon="el-icon-edit"
              size="mini"
              type="primary"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
              @click="removeRolesById(scope.row.id)"
              icon="el-icon-delete"
              size="mini"
              type="danger"
            >删除</el-button>
            <!-- 分配角色按钮 -->
            <el-button
              @click="showSetRightDialog(scope.row)"
              icon="el-icon-setting"
              size="mini"
              type="warning"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限户对话框 -->
    <el-dialog
      :visible.sync="setRightDialogVisible"
      @close="handleDialogClose"
      title="分配权限"
      width="50%"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :default-checked-keys="defKeys"
        :props="treeProps"
        default-expand-all
        node-key="id"
        ref="treeRef"
        show-checkbox
      ></el-tree>
      <span class="dialog-footer" slot="footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button @click="setRight" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      :visible.sync="addRightDialogVisible"
      @closed="addRoleColse('addRoleRef')"
      title="添加角色"
      width="50%"
    >
      <el-form :model="addRoleFrom" :rules="addFromRules" label-width="80px" ref="addRoleRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="addRightDialogVisible = false" type="info">取 消</el-button>
        <el-button @click="getRoles('addRoleRef')" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      :visible.sync="editdialogVisible"
      @closed="EditDialogClose('editFormRef')"
      title="编辑角色"
      width="50%"
    >
      <el-form :model="editFrom" :rules="editFromRules" label-width="80px" ref="editFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button @click="editUser('editFormRef')" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: [],
  data () {
    return {
      rolesList: [],
      addRoleFrom: {
        roleName: '',
        roleDesc: ''
      },
      addFromRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ]
      },
      editFrom: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      editFromRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ]
      },
      addRightDialogVisible: false,
      editdialogVisible: false,
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      checkedKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRolesLiset()
  },
  methods: {
    async getRolesLiset () {
      const { data: res } = await this.$http.get('roles')
      this.rolesList = res.data
    },
    // 添加角色
    addRole () {
      this.addRightDialogVisible = true
    },
    // 清空表单
    addRoleColse (addRoleRef) {
      this.$refs[addRoleRef].resetFields()
    },
    // 提交角色
    getRoles (addRoleRef) {
      this.$refs[addRoleRef].validate(async item => {
        if (!item) return
        // 验证成功 发送请求
        const { data: res } = await this.$http.post('roles', this.addRoleFrom)
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
          this.getRolesLiset()
          this.addRightDialogVisible = false
        }
      })
    },
    EditDialogClose (editFormRef) {
      this.$refs[editFormRef].resetFields()
    },
    // 查询角色并渲染到表单
    async showUser (id) {
      // console.log(id)
      const { data: res } = await this.$http.get('roles/' + id)
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
    // 提交修改
    editUser (editFormRef) {
      this.$refs[editFormRef].validate(async (item) => {
        if (!item) return
        const { data: res } = await this.$http.put(
          'roles/' + this.editFrom.roleId,
          this.editFrom
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return
        }
        this.editdialogVisible = false
        this.getRolesLiset()
        this.$message({
          message: res.meta.msg,
          type: 'success',
          showClose: true
        })
      })
    },
    // 删除角色
    removeRolesById (id) {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: async (action) => {
          if (action === 'confirm') {
            await this.$http.delete('roles/' + id)
            this.$message({
              message: '删除成功',
              type: 'success',
              showClose: true
            })
            this.getRolesLiset()
          }
        }
      })
    },
    removeRightsById (role, rightId) {
      this.$confirm('是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: async (action) => {
          console.log(action)
          if (action === 'confirm') {
            const { data: res } = await this.$http.delete(
              `roles/${role.id}/rights/${rightId}`
            )
            this.$message({
              message: '删除成功',
              type: 'success',
              showClose: true
            })
            role.children = res.data
          }
        }
      })
    },
    async setRight () {
      const rids = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      await this.$http.post('roles/' + this.roleId + '/rights', {
        rids: rids.join(',')
      })
      this.$message({
        message: '分配成功',
        type: 'success',
        showClose: true
      })
      this.getRolesLiset()
      this.setRightDialogVisible = false
    },
    async showSetRightDialog (row) {
      this.roleId = row.id
      const { data: res } = await this.$http.get('rights/tree')
      this.getLeafkeys(row)
      this.rightslist = res.data
      this.setRightDialogVisible = true
    },
    getLeafkeys (item) {
      if (!item.children) {
        this.checkedKeys.push(item.id)
      } else {
        item.children.forEach(subItem => {
          this.getLeafkeys(subItem)
        })
      }
    },
    handleDialogClose () {
      this.defKeys = []
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px #ccc solid;
}
.bdbottom {
  border-bottom: 1px #ccc solid;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
