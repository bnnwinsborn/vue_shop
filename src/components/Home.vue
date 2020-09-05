<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <h1>GAL</h1>
        <span>电商后台管理系统</span>
      </div>
      <div>
        <el-button @click="index" type="primary">首页</el-button>
        <el-button @click="logout" type="info">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div @click="toggleCollapse" class="toggle-button">|||</div>
        <el-menu
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activePath"
          active-text-color="#409eff"
          background-color="#333744"
          router
          text-color="#fff"
          unique-opened
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" :key="item.id" v-for="(item) in menuList">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path+''"
              :key="subItem.id"
              @click="saveactivePath('/'+subItem.path)"
              v-for="subItem in item.children"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主题区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  props: [],
  data () {
    return {
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: sessionStorage.activePath
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    index () {
      this.$router.push('/welcome')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(res)
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveactivePath (path) {
      // 保存链接的激活状态
      this.activePath = path
      sessionStorage.activePath = this.activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      padding-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
