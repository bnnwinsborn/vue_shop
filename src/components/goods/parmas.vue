<template>
  <div>
    <h3>分类参数</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 :closable="false"(是否展示“X”号) show-icon(显示图标) -->
      <el-alert :closable="false" show-icon title="注意：只允许为第三级分类设置相关参数" type="warning"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
            clearable
            v-model="selectedCateKeys"
          ></el-cascader>
        </el-col>
        <el-col></el-col>
      </el-row>
      <el-tabs @tab-click="handleTabClick" v-model="activeName">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            :disabled="isButtonDisabled"
            @click="addDialogVisible=true"
            size="mini"
            type="primary"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  @close="handleClose(index,scope.row)"
                  closable
                  v-for="(item,index) in  scope.row.attr_vals"
                >{{item}}</el-tag>
                <el-input
                  @blur="handleInputConfirm(scope.row)"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  class="input-new-tag"
                  ref="saveTagInput"
                  size="small"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                ></el-input>
                <el-button
                  @click="showInput(scope.row)"
                  class="button-new-tag"
                  size="small"
                  v-else
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                >编辑</el-button>
                <el-button
                  @click="removeByAttrId(scope.row.attr_id)"
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            :disabled="isButtonDisabled"
            @click="addDialogVisible=true"
            size="mini"
            type="primary"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  @close="handleClose(index,scope.row)"
                  closable
                  v-for="(item,index) in  scope.row.attr_vals"
                >{{item}}</el-tag>
                <el-input
                  @blur="handleInputConfirm(scope.row)"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  class="input-new-tag"
                  ref="saveTagInput"
                  size="small"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                ></el-input>
                <el-button
                  @click="showInput(scope.row)"
                  class="button-new-tag"
                  size="small"
                  v-else
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                >编辑</el-button>
                <el-button
                  @click="removeByAttrId(scope.row.attr_id)"
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数或属性对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      @close="addDialogClosed"
      width="50%"
    >
      <!-- 添加表单 -->
      <el-form :model="addForm" :rules="addFormRules" label-width="100px" ref="addFormRef">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button @click="addParams" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数或属性对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      @close="editDialogClosed"
      width="50%"
    >
      <!-- 添加表单 -->
      <el-form :model="editForm" :rules="editFormRules" label-width="100px" ref="editFormRef">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button @click="editParams" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: [],
  data () {
    return {
      // 分类列表
      cateList: [],
      // 用户在级联下拉菜单中选中的分类id
      selectedCateKeys: [],
      // 配置级联菜单中数据如何展示
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many',
      // 用来保存动态参数数据
      manyTableData: [],
      // 用来保存静态属性数据
      onlyTableData: [],
      // 控制添加参数的对话框的显示与影藏
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: { attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }] },
      editDialogVisible: false,
      editForm: { attr_name: '' },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async handleInputConfirm (row) {
      row.inputVisible = false
      if (row.inputValue.trim().length !== 0) {
        row.attr_vals.push(row.inputValue)
        row.inputValue = ''
        await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: this.activeName, attr_vals: row.attr_vals.join(' ') })
        this.$message({
          message: '添加属性成功',
          type: 'success',
          showClose: true
        })
        this.getParamsData()
      }
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        // 让文本框自动获得焦点
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async getCateList () {
      // 获取所有的商品分类列表
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error('获取分类数据失败')
      }
      // 将数据列表赋值给cateList
      this.cateList = res.data
      // //保存总数据条数
      // this.total = res.data.total
      //   console.log(res.data);
    },
    // 级联选择框选中项变化，会触发这个函数
    async handleChange () {
      // 当用户在级联菜单中选择内容改变时触发
      // console.log(this.selectedCateKeys)
      this.getParamsData()
    },
    // tab 页签点击事件的处理函数
    handleTabClick () {
      // console.log(this.activeName)
      this.getParamsData()
    },
    async getParamsData () {
      if (this.selectedCateKeys.length < 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      const { data: res } = await this.$http.get('categories/' + this.cateId + '/attributes', { params: { sel: this.activeName } })
      // 将获取到的数据中的attr_vals字符串转换为数组
      res.data.forEach(item => {
        // 添加一个bool值控制文本框的显示或者隐藏
        item.inputVisible = false
        // 添加一个inputValue保存文本框值
        item.inputValue = ''
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
      })
      // console.log(res)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
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
          this.addDialogVisible = false
          this.getParamsData()
        }
      })
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,
        { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) {
        this.$message({
          message: '获取数据失败',
          type: 'error',
          showClose: true
        })
      }
      this.editForm = res.data
      // 显示修改参数.属性对话框
      this.editDialogVisible = true
    },
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
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
          this.getParamsData()
          this.editDialogVisible = false
        }
      })
    },
    removeByAttrId (id) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: async action => {
          if (action === 'confirm') {
            await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
            this.$message({
              message: '删除成功',
              type: 'success',
              showClose: true
            })
            this.getParamsData()
          }
        }
      })
    }
  },
  computed: {
    // 添加计算属性用来获取按钮禁用与否
    isButtonDisabled () {
      return this.selectedCateKeys.length !== 3
    },
    // 获取选中的三级分类id
    cateId () {
      return this.selectedCateKeys.length !== 3 ? null : this.selectedCateKeys[2]
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px;
}
</style>
