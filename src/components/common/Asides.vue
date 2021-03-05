<template>
  <el-aside width="200px">
    <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <!-- 一级菜单 -->
      <el-submenu index="1">
        <!-- 一级菜单的模板区 -->
        <template slot="title">
          <!-- 这是图标 -->
          <i class="el-icon-location"></i>
          <!-- 这是内容 -->
          <span>导航一</span>
        </template>
        <!-- 这是二级菜单 -->
        <!-- <el-submenu index="1-4">
          <template slot="title">选项4</template> -->
        <!-- 这是子项 -->
        <el-menu-item index="1-4-1">
          <template slot="title">
            <!-- 这是图标 -->
            <i class="el-icon-location"></i>
            <!-- 这是内容 -->
            <span>导航一</span>
          </template>
        </el-menu-item>
        <!-- </el-submenu> -->
      </el-submenu>
    </el-menu>
  </el-aside>
</template>
<script>
export default {
  name: 'Asides'
}
</script>
<style lang="scss" scoped>
.el-aside {
  background-color: #333744;
}
.el-menu {
  border-right: 0px;
}
</style>
