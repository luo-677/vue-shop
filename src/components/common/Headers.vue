<template>
  <el-header>
    <div class="header_left">
      <img src="../../assets/logo.png" alt="" />
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </el-header>
</template>

<script>
export default {
  name: 'Headers',
  methods: {
    // 退出功能
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header_left {
  height: 40px;
  display: flex;
  img {
    height: 100%;
  }
  span {
    font-size: 30px;
    margin-left: 10px;
    color: #fff;
  }
}
</style>
