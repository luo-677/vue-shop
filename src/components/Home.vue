<template>
  <!-- 在element中，每一个标签名都对应着一个类名 -->
  <el-container class="home_container" style="flex-direction: column">
    <!-- 头部区域 -->
    <headers></headers>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 页面侧边栏 -->
      <asides></asides>
      <!-- 页面主体区域 -->
      <mains></mains>
    </el-container>
  </el-container>
</template>
<script>
import Headers from './common/Headers'
import Asides from './common/Asides'
import Mains from './common/Mains'
export default {
  name: 'Home',
  components: {
    Headers,
    Asides,
    Mains
  }
}
</script>
<style lang="scss" scoped>
.home_container {
  height: 100%;
}
</style>
