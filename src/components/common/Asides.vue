<template>
  <el-aside :width="isCollApse? '64px':'200px'">
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EEF"
      unique-opened
      :collapse-transition="false"
      :collapse="isCollApse"
      router
      :default-active="activePath"
    >
      <!-- 一级菜单 -->
      <!-- 点击时所有标签一起展开，是因为所有标签的id相同 -->
      <el-submenu :index="item.id + ''" v-for="item in amenuList" :key="item.id">
        <!-- 一级菜单的模板区 -->
        <template slot="title">
          <!-- 这是图标 -->
          <i :class="menuPicObj[item.id]"></i>
          <!-- 这是内容 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 这是二级菜单 -->
        <!-- <el-submenu index="1-4">
          <template slot="title">选项4</template> -->
        <!-- 这是子项 -->
        <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="saveNavState('/' + subitem.path)">
          <template slot="title">
            <!-- 这是图标 -->
            <i class="el-icon-menu"></i>
            <!-- 这是内容 -->
            <span class="secSpan">{{subitem.authName}}</span>
          </template>
        </el-menu-item>
        <!-- </el-submenu> -->
      </el-submenu>
    </el-menu>
  </el-aside>
</template>
<script>
export default {
  name: 'Asides',
  props: ['amenuList'],
  data() {
    return {
      menuPicObj: {
        '125': 'el-icon-platform-eleme self',
        '103': 'el-icon-eleme self',
        '101': 'el-icon-s-tools self',
        '102': 'el-icon-user self',
        '145': 'el-icon-star-on self'
      },
      isCollApse: false,
      activePath: '',
    }
  },
  methods: {
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse(){
      this.isCollApse = !this.isCollApse;
    },
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath);
      this.activePath = activePath;
    }
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath');
  },
}
</script>
<style lang="scss" scoped>
.el-aside {
  background-color: #333744;
}
.el-menu {
  border-right: none;
}
.self{
  margin-right: 10px;
}
.secSpan{
  margin-left: 5px;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 30px;
  color: #fff;
  text-align: center;
  letter-spacing: .2em;
  cursor: pointer;
}
</style>
