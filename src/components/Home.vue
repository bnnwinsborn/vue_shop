<template>
<div>
<el-button type="info" @click="logout">退出</el-button>
</div>
</template>

<script>
export default {
  props: [],
  data () {
    return {

    }
  },
  created () {

  },
  methods: {
    logout () {
      sessionStorage.clear()
      this.$router.push('/Login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
