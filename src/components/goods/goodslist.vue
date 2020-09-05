<template>
  <div>
    <h3>商品列表</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable placeholder="请输入内容" v-model="queryInfo.query">
            <el-button @click="getGoodsList" icon="el-icon-search" slot="append"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="gotoAdd" type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="95px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="125px">
          <template slot-scope="scope">
            <el-button
              @click="editGoods(scope.row.goods_id)"
              icon="el-icon-edit"
              size="mini"
              type="primary"
            ></el-button>
            <el-button
              @click="removeGoods(scope.row.goods_id)"
              icon="el-icon-delete"
              size="mini"
              type="danger"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[3, 5, 10, 15]"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 保存商品列表信息
      goodsList: [],
      // 总数据条数
      total: 0,
      editgoodslist: {}
    }
  },
  created () { this.getGoodsList() },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message({
          message: '获取商品列表失败',
          type: 'error',
          showClose: true
        })
      } else {
        this.$message({
          message: '获取商品列表成功',
          type: 'success',
          showClose: true
        })
        this.goodsList = res.data.goods
        this.total = res.data.total
      }
    },
    handleCurrentChange (num) {
      this.queryInfo.pagenum = num
      this.getGoodsList()
    },
    handleSizeChange (size) {
      this.queryInfo.pagesize = size
      this.getGoodsList()
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 携带参数跳转到编辑页面
    async editGoods (id) {
      const { data: res } = await this.$http.get(`goods/${id}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message({
          message: '获取数据失败',
          type: 'error',
          showClose: true
        })
      }
      this.$message({
        message: '获取数据成功',
        type: 'success',
        showClose: true
      })
      this.getGoodsList = res.data
      // const goodslist = res.data
      this.$router.push({
        path: '/goods/edit',
        query: {
          goods_Id: res.data.goods_id
        }
      })
    },
    async removeGoods (id) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: async action => {
          if (action === 'confirm') {
            await this.$http.delete(`goods/${id}`)
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
    gotoAdd () {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
