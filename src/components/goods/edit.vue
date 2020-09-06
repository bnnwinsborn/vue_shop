<template>
  <div>
    <h3>修改商品</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品修改</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert :closable="false" center show-icon title="编辑商品信息" type="info"></el-alert>
      <el-steps :active="activeIndex - 0" :space="200" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="editForm"
        :rules="editFormRules"
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
            <el-form-item label="商品名称:" prop="goods_name">
              <el-input v-model="editForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格:" prop="goods_price">
              <el-input v-model="editForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量:" prop="goods_weight">
              <el-input v-model="editForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量:" prop="goods_number">
              <el-input v-model="editForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品状态:">
              <el-tag type="info" v-if="editForm.goods_state === '0'">未通过</el-tag>
              <el-tag type="danger" v-else-if="editForm.goods_state === '1'">审核中</el-tag>
              <el-tag type="success" v-else>已审核</el-tag>
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
            <quill-editor v-model="editForm.goods_introduce"></quill-editor>
            <el-button @click="edit" class="btnEdit" type="primary">编辑商品</el-button>
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
export default {
  props: [],
  data () {
    return {
      Id: this.$route.query.goods_Id,
      getgoodslist: {},
      activeIndex: '0',
      editForm: {
        goods_name: '',
        goods_price: '0',
        goods_weight: '0',
        goods_number: '0',
        goods_state: '0',
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      editFormRules: {
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
    this.getGoodslist()
  },
  methods: {
    async getGoodslist () {
      const { data: res } = await this.$http.get('goods/' + this.Id)
      this.editForm = res.data
    },
    beforeTabLeave () { },
    async handelTabClick () {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`goods/${this.Id}`, { params: { sel: 'many' } })
        res.data.attrs.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableDate = res.data.attrs
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`goods/${this.Id}`, { params: { sel: 'only' } })
        res.data.attrs.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals
        })
        this.onlyTableDate = res.data.attrs
      }
    },
    handleChange () { },
    handlePreview () { },
    handleRemove () { },
    handleSuccess () { },
    edit () { }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.btnEdit {
  margin-top: 15px;
}
</style>
