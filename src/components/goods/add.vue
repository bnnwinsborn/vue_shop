<template>
  <div>
    <h3>添加商品</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert :closable="false" center show-icon title="添加商品信息" type="info"></el-alert>
      <el-steps :active="activeIndex - 0" :space="200" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        class="demo-ruleForm"
        label-position="top"
        label-width="100px"
        ref="ruleForm"
      >
        <el-tabs
          :before-leave="beforeTabLeave"
          @tab-click="handelTabClick"
          tab-position="left"
          v-model="activeIndex"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
                clearable
                expandTrigger="hover"
                v-model="addForm.goods_cat"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :key="item.attr_id" :label="item.attr_name" v-for="item in manyTableDate">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :key="index" :label="val" border v-for="(val,index) in item.attr_vals"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :key="item.attr_id" :label="item.attr_name" v-for="item in onlyTableDate">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="url"
              :file-list="fileList"
              :headers="headersObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              class="upload-demo"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button @click="add" class="btnAdd" type="primary">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog :visible.sync="dialogVisible" title="图片展示" width="30%">
      <img :src="previewPath" alt style="width:100%;" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  props: [],
  data () {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: '0',
        goods_weight: '0',
        goods_number: '0',
        goods_cat: [],
        pics: [],
        goods_introduce: ''
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      catelist: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyTableDate: [],
      onlyTableDate: [],
      url: 'http://129.211.95.165:8888/api/private/v1/upload',
      headersObj: {
        Authorization: sessionStorage.getItem('token')
      },
      previewPath: '',
      dialogVisible: false
    }
  },
  created () {
    this.getcatList()
  },
  methods: {
    async getcatList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        this.$message({
          message: '获取数据失败',
          type: 'error',
          showClose: true
        })
      }
      this.catelist = res.data
    },
    handleChange () {
      if (this.addForm.goods_cat.length < 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave (avtiveName, oldactiveName) {
      if (oldactiveName !== '0') {
        // 在第一个标签页的时候
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.error('请选择商品的分类')
          return false
        } else if (this.addForm.goods_name.trim() === '') {
          this.$message.error('请输入商品名称')
          return false
        } else if (this.addForm.goods_price.trim() === '0') {
          this.$message.error('请输入商品价格')
          return false
        } else if (this.addForm.goods_weight.trim() === '0') {
          this.$message.error('请输入商品重量')
          return false
        } else if (this.addForm.goods_number.trim() === '0') {
          this.$message.error('请输入商品数量')
          return false
        }
      }
    },
    async handelTabClick () {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableDate = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals
        })
        this.onlyTableDate = res.data
      }
    },
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.dialogVisible = true
    },
    handleRemove (file) {
      const path = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(item => item.pics === path)
      this.addForm.pics.splice(index, 1)
    },
    handleSuccess (response) {
      this.addForm.pics.push({
        pic: response.data.tmp_path
      })
      console.log(this.addForm.pics)
    },
    add () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) {
          return this.$message({
            message: '请填写必要的商品信息',
            type: 'error',
            showClose: true
          })
        }
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        const attrs = []
        this.manyTableDate.forEach(item => {
          attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          })
        })
        this.onlyTableDate.forEach(item => {
          attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          })
        })
        form.attrs = attrs
        // 发送请求完成商品的添加,商品名称必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        // 编程式导航跳转到商品列表
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      return this.addForm.goods_cat.length !== 3 ? null : this.addForm.goods_cat[2]
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.btnAdd {
  margin-top: 15px;
}
</style>
