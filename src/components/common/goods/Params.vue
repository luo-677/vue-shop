<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三方分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon>
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList(){
      await this.$http.get('categories')
      .then(res => {
        if(res.data.meta.status !== 200){
          this.$message.error(this.data.meta.msg)
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.cat_opt{
  margin: 15px 0;
}
</style>