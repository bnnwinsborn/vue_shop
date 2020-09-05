<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="/el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加商品分类按钮 -->
      <el-row>
        <el-col>
          <el-button @click="addCateDialogVisible = true" type="primary">添加分类</el-button>
        </el-col>
        <tree-table
          :columns="columns"
          :data="catelist"
          :expand-type="false"
          :selection-type="false"
          :show-row-hover="false"
          border
          index-text="#"
          show-index
        >
          <!-- 是否有效 -->
          <template slot="isok" slot-scope="scope">
            <i
              class="el-icon-success"
              style="color:lightfreen"
              v-if="scope.row.cat_deleted === false"
            ></i>
            <i class="el-icon-error" style="color:red" v-else></i>
          </template>
          <!-- 排序 -->
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <!-- 操作 -->
          <template slot="opt" slot-scope="scope">
            <el-button
              @click="showCate(scope.row.cat_id)"
              icon="el-icon-edit"
              size="mini"
              type="primary"
            >编辑</el-button>
            <el-button
              @click="removeCate(scope.row.cat_id)"
              icon="el-icon-delete"
              size="mini"
              type="danger"
            >删除</el-button>
          </template>
        </tree-table>
        <!-- 分页 -->
        <el-pagination
          :current-page="querInfo.pagenum"
          :page-size="querInfo.pagesize"
          :page-sizes="[3, 5, 10, 15]"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </el-row>
    </el-card>
    <!-- 新增分类对话框 -->
    <el-dialog
      :visible.sync="addCateDialogVisible"
      @closed="AddDialogClose('addCateFormRef')"
      title="添加分类"
      width="50%"
    >
      <el-form
        :model="addCateFrom"
        :rules="addCateFromRules"
        label-width="120px"
        ref="addCateFormRef"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- change-on-select -->
          <el-cascader
            :options="parentlist"
            :props="cascaderProps"
            @change="handleCascaderChange"
            clearable
            v-model="selectParentCateKeys"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button @click="addCate('addCateFormRef')" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      :visible.sync="editCateDialogVisible"
      @closed="EditDialogClose('editCateFormRef')"
      title="修改分类"
      width="50%"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        label-width="80px"
        ref="editCateFormRef"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button @click="editCate" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: [],
  data () {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      catelist: [],
      parentlist: [],
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', prop: '', type: 'template', template: 'isok' },
        { label: '排序', prop: '', type: 'template', template: 'order' },
        { label: '操作', prop: '', type: 'template', template: 'opt' }
      ],
      addCateDialogVisible: false,
      addCateFrom: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFromRules: {
        cat_name: [
          { required: true, message: '请输入分类名', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: 'blur'
          }
        ]
      },
      editCateDialogVisible: false,
      editCateForm: {
        cat_name: '',
        cat_id: ''
      },
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: 'blur'
          }
        ]
      },
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: 'hover',
        children: 'children'
      },
      selectParentCateKeys: []
    }
  },
  created () {
    this.getGoodsList()
    this.getParentList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 分页
    handleSizeChange (newsize) {
      this.querInfo.pagesize = newsize
      this.getGoodsList()
    },
    handleCurrentChange (newpage) {
      this.querInfo.pagenum = newpage
      this.getGoodsList()
    },
    // 清空表单
    AddDialogClose (addCateFormRef) {
      this.$refs[addCateFormRef].resetFields()
      this.selectParentCateKeys = []
      this.addCateFrom.cat_pid = 0
      this.addCateFrom.cat_level = 0
    },
    // 添加用户
    addCate (addCateFormRef) {
      // 表单预校验
      this.$refs[addCateFormRef].validate(async (item) => {
        if (!item) return
        // 验证成功 发送请求
        const { data: res } = await this.$http.post('categories', this.addCateFrom)
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
          this.addCateDialogVisible = false
          // 重新获取用户列表
          this.getGoodsList()
        }
      })
    },
    // 查询用戶并渲染到表单
    async showCate (id) {
      this.editCateDialogVisible = true
      // console.log(id)
      const { data: res } = await this.$http.get(`categories/${id}`)
      if (res.meta.status !== 200) {
        this.$message({
          message: '失败',
          type: 'error',
          showClose: true
        })
      }
      this.$message({
        message: res.meta.msg,
        type: 'success',
        showClose: true
      })
      this.editCateForm = res.data
      console.log(this.editCateForm)
    },
    // 清空表单
    EditDialogClose (editCateFormRef) {
      this.$refs[editCateFormRef].resetFields()
    },
    // 提交修改
    editCate (id) {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.editCateForm.cat_id}`, { cat_name: this.editCateForm.cat_name })
        if (res.meta.status !== 200) {
          this.$message({
            message: '修改数据失败',
            type: 'error',
            showClose: true
          })
        } else {
          this.$message({
            message: '修改数据成功',
            type: 'success',
            showClose: true
          })
          this.getGoodsList()
          this.editCateDialogVisible = false
        }
      })
    },
    showAddCateDialog () {
      this.addCateDialogVisible = true
      this.getParentList()
    },
    // 删除
    removeCate (id) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: async action => {
          if (action === 'confirm') {
            await this.$http.delete(`categories/${id}`)
            this.$message({
              message: '删除成功',
              type: 'success',
              showClose: true
            })
            this.getGoodsList()
          }
        }
      })
    },
    async getParentList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      this.parentlist = res.data
    },
    handleCascaderChange () {
      console.log(this.selectParentCateKeys)
      if (this.selectParentCateKeys.length > 0) {
        // 则将数组中的最后一项设置为父级分类
        this.addCateFrom.cat_pid = this.selectParentCateKeys[this.selectParentCateKeys.length - 1]
        // level也要跟着发生变化
        this.addCateFrom.cat_level = this.selectParentCateKeys.length
      } else {
        this.addCateFrom.cat_pid = 0
        this.addCateFrom.cat_level = 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
