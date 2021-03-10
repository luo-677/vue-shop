<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row style="margin-bottom: 14px">
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 新旧写法不能进行混淆 -->
        <template v-slot:isok="scope">
          <div>
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
              style="color: lightgreen"
            ></i>
            <i class="el-icon-error" v-else style="color: red"></i>
          </div>
        </template>
        <template v-slot:order="scope">
          <div>
            <!-- <el-tag :type="{scope: scope,data: 'data'} | changeLevel()">yiji</el-tag> -->
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </div>
        </template>
        <template v-slot:opt="scope">
          <div>
            <!-- 编辑用于修改分类名称 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showEditCateDialog(scope.row)"
              >编 辑</el-button
            >
            <!-- 删除用于删除当前分类 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteCate(scope.row)"
              >删 除</el-button
            >
          </div>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 14px"
      >
      </el-pagination>

      <!-- 分页 -->
    </el-card>

    <!-- 添加分了的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 用于指定数据源 -->
          <el-cascader
            v-model="selectedKeys"
            :options="ParentCateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              checkStrictly: true
            }"
            @change="parentCateChange"
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类名称 -->
    <el-dialog
      title="请修改分类名称"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editNameFormClose"
    >
      <el-form
        :model="editNameForm"
        :rules="editNameRules"
        ref="editNameFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="editName">
          <el-input v-model="editNameForm.editName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editName">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品分类的数据列表，默认为空
      catelist: [],
      // 商品列表总数
      total: 0,
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        cat_level: 0
      },
      // 添加验证对象
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },

      // 修改分类名称
      editNameForm: {
        editId: 0,
        editName: ''
      },
      editNameRules: {
        editName: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      // 为table指定列表定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        // 有效性状态显示
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        //
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      ParentCateList: [],
      selectedKeys: []
    }
  },
  // filters: {
  //   changeLevel({scope,data}){
  //     if(scope.row.cat_level === 0){
  //       data = "primary"
  //     }else if(scope.row.cat_level === 1){
  //       data = "success"
  //     }else{
  //       data = "warning"
  //     }
  //   }
  // },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      await this.$http
        .get('categories', {
          params: this.queryInfo
        })
        .then(async res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error(`数据请求错误，${res.data.meta.msg}`)
          }
          this.catelist = res.data.data.result
          this.total = res.data.data.total
        })
    },
    // 监听pagesize改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级列表
    async getParentCateList() {
      await this.$http
        .get('categories', {
          params: {
            type: 2
          }
        })
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error(`数据获取失败，${res.data.meta.msg}`)
          }
          this.ParentCateList = res.data.data
          console.log(res)
        })
    },
    parentCateChange() {
      // console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        await this.$http.post('categories', this.addCateForm).then(res => {
          if (res.data.meta.status !== 201) {
            return this.$message.error(res.data.meta.msg)
          }
          this.$message.success(res.data.meta.msg)
          this.getCateList()
          this.addCateDialogVisible = false
        })
      })
    },
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    deleteCate(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          console.log(2222)
          if (row._normalIndex === 1 && this.queryInfo.pagenum > 0) {
            this.queryInfo.pagenum--
          }
          await this.$http
            .delete(`categories/${row.cat_id}`)
            .then(res => {
              if (res.data.meta.status !== 200) {
                return this.$message.error(res.data.meta.msg)
              }
              this.getCateList()
              console.log(this.total, this.catelist)
              this.$message.success(res.data.meta.msg)
            })
            .catch(err => {
              this.$message.error(err.data.meta.msg)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    showEditCateDialog(row) {
      this.editCateDialogVisible = true
      this.editNameForm.editId = row.cat_id
      this.editNameForm.editName = row.cat_name
    },
    editNameFormClose() {
      this.$refs.editNameFormRef.resetFields()
    },
    editName() {
      this.$refs.editNameFormRef.validate(async valid => {
        if (!valid) return
        await this.$http
          .put(`categories/${this.editNameForm.editId}`, {
            cat_name: this.editNameForm.editName
          })
          .then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error(res.data.meta.msg)
            }
            this.$message.success(res.data.meta.msg)
            this.getCateList()
            this.editCateDialogVisible = false
          })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
<style lang="scss">
.el-cascader-panel {
  height: 300px;
}
</style>
