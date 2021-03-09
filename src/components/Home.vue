<template>
  <!-- 在element中，每一个标签名都对应着一个类名 -->
  <el-container class="home_container" style="flex-direction: column">
    <!-- 头部区域 -->
    <headers></headers>
    <!-- 页面主体区域 -->
    <el-container class="mains-container">
      <!-- 页面侧边栏 -->
      <asides :amenuList="menuList"></asides>
      <!-- 页面主体区域 -->
      <mains class="mains"></mains>
    </el-container>
  </el-container>
</template>
<script>
import Headers from './common/Headers'
import Asides from './common/Asides'
import Mains from './common/Mains'
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
    }
  },
  components: {
    Headers,
    Asides,
    Mains
  },
  created() {
    this.getMenuList();
  },
  methods: {
    // 获取所有的菜单
    async getMenuList(){
      await this.$http.get('menus')
      .then(res => {
        // console.log(res.data)
        if(res.data.meta.status !== 200){
          return this.$message.err(res.data.meta.msg);
        }
        this.menuList = res.data.data;
        console.log(this.menuList);
      })
      .catch(err => {
        console.log(err);
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.home_container {
  height: 100%;
}
.mains-container{
  overflow: hidden;
}
</style>
