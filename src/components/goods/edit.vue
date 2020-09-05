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
    <el-card></el-card>
  </div>
</template>

<script>
export default {
  props: [],
  data () {
    return {
      getgoodslist: {}
    }
  },
  created () {
    this.getGoodslist()
  },
  methods: {
    async getGoodslist () {
      const Id = this.$route.query.goods_Id
      const { data: res } = await this.$http.get('goods/' + Id)
      this.getgoodslist = res
      console.log(this.getgoodslist)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
