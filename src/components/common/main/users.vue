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
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true"
            >增加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot:default="scope">
            <!-- {{scope.row}} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- v-slot:default="scope" -->
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <!-- 编辑 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑用户"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 导航面包屑 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加用户提示框 -->
      <!-- addDialogVisible 控制对话框的显示隐藏 -->
      <!-- 在对话框关闭前触发的事件 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <!-- 内容主体区域 -->
        <!-- ref为名称 -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormref"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <!-- 在确定或者关闭的同时，都需要将对话框进行隐藏 -->
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
          <!-- <el-button type="primary" @click="cancelDialog">确 定</el-button> -->
        </span>
      </el-dialog>

      <!-- 修改用户表单 -->
      <el-dialog
        title="提示"
        :visible.sync="editDialogVisible"
        width="30%"
        @close="editDialogClosed"
      >
        <el-form
          :model="editForm"
          :rules="addFormRules"
          ref="editFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 为什么无法使用Vue.set方法
// import Vue from 'Vue';
export default {
  name: 'Users',
  data() {
    let checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (regEmail.test(value)) {
        return callback()
      }

      callback(new Error('请输入合法邮箱'))
    }

    let checkMobile = (rule, value, callback) => {
      const regMobile = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }

      callback(new Error('请输入合法手机号'))
    }

    return {
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制对话框的显示隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 16,
            message: '密码的长度在3~16个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      // 用于存储获取到的表单信息
      editForm: {}
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      await this.$http
        .get('users', { params: this.queryInfo })
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error(res.data.meta.msg)
          }
          this.userList = res.data.data.users
          this.total = res.data.data.total
        })
        .catch(err => {
          return this.$message.error(err)
        })
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newsize) {
      // console.log(newsize,'handleSizeChange');
      this.queryInfo.pagesize = newsize
      this.getUserList()
      console.log(this.userList)
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newpage) {
      // console.log(newpage);
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    async userStateChange(status) {
      console.log(status)
      await this.$http
        .put(`users/${status.id}/state/${status.mg_state}`)
        .then(res => {
          if (res.data.meta.status !== 200) {
            // 这里是让状态修改回去
            status.mg_state = !status.mg_state
            return this.$message.error(res.data.meta.msg)
          }
          this.$message.success(res.data.meta.msg)
        })
    },
    // cancelDialog(){
    //   this.addDialogVisible = false;
    // this.addForm.username = '';
    // this.addForm.password = '';
    // this.addForm.email = '';
    // this.addForm.mobile = '';
    // Vue.set(this.addForm, 'username', '');
    // Vue.set(this.addForm, 'password', '');
    // Vue.set(this.addForm, 'email', '');
    // Vue.set(this.addForm, 'mobile', '');
    // }
    addDialogClosed() {
      this.$refs.addFormref.resetFields()
    },
    addUser() {
      // 对表单进行预校验
      this.$refs.addFormref.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 可以发起添加用户的网络请求
        await this.$http.post('users', this.addForm).then(res => {
          console.log(res.data)
          if (res.data.meta.status != 201) {
            return this.$message.error(`添加用户失败，${res.data.meta.msg}`)
          }
          this.$message.success('添加用户成功!')
          // 隐藏添加用户的对话框
          this.addDialogVisible = false
          // 重新获取用户列表数据
          this.getUserList()
        })
      })
    },
    async showEditDialog(id) {
      console.log(id)
      await this.$http.get(`users/${id}`).then(res => {
        console.log(res.data)
        if (res.data.meta.status != 200) {
          return this.$message.error(`用户信息修改失败，${res.data.meta.msg}`)
        }
        this.editForm = res.data.data
      })
      this.editDialogVisible = true
    },
    // 重置验证结果
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        await this.$http
          .put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          .then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error(
                `用户信息修改失败，${res.data.meta.msg}`
              )
            }
            this.getUserList()
            this.$message.success('用户信息修改成功')
            this.editDialogVisible = false
          })
      })
    },
    async removeUserById(id) {
      console.log(id)
      // 弹框询问用户是否删除当前数据
      const res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          await this.$http.delete(`users/${id}`).then(res => {
            if (res.data.meta.status !== 200) {
              this.$message.error(`删除失败，${res.data.meta.msg}`)
            }
            this.$message.success('删除成功!')
            this.getUserList()
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
      console.log(res)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
  text-align: center;
}
</style>
