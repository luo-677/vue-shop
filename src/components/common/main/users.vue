<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="box-card">
    <el-row :gutter="20">
      <el-col :span="6">
         <!-- 此处有bug，当翻页后，用户查询就不是从所有用户中进行查询了，只是查询当前页中的数据 -->
        <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
          <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary">增加用户</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="userList"
      style="width: 100%"
      border
      stripe>
      <el-table-column 
        type="index" 
        label="#">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="状态">
        <template v-slot:default="scope">
          <!-- {{scope.row}} -->
          <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
       <!-- v-slot:default="scope" -->
      <el-table-column
        label="操作">
        <template>
          <!-- 编辑 -->
          <el-tooltip class="item" effect="dark" content="编辑用户" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <!-- 删除 -->
          <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete"></el-button>
          </el-tooltip>
          <!-- 分配角色 -->
          <el-tooltip class="item" effect="dark" content="编辑用户" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    return {
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userList: [],
      total: 0
    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList(){
      await this.$http.get('users', {params: this.queryInfo})
      .then(res => {
        if(res.data.meta.status !== 200){
          return this.$message.error(res.data.meta.msg);
        }
        this.userList = res.data.data.users;
        this.total = res.data.data.total;
      })
      .catch(err => {
        return this.$message.error(err);
      })
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newsize){
      // console.log(newsize,'handleSizeChange');
      this.queryInfo.pagesize = newsize;
      this.getUserList();
      console.log(this.userList);
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newpage){
      // console.log(newpage);
      this.queryInfo.pagenum = newpage;
      this.getUserList();
    },
    async userStateChange(status){
      console.log(status);
      await this.$http.put(`users/${status.id}/state/${status.mg_state}`)
      .then(res => {
        if(res.data.meta.status !== 200){
          // 这里是让状态修改回去
          status.mg_state = !status.mg_state;
          return this.$message.error(res.data.meta.msg);
        }
        this.$message.success(res.data.meta.msg);
      })
    }
  },
  
}
</script>
<style lang="scss" scoped>
.el-table{
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination{
  margin-top: 15px;
  text-align: center;
}
</style>