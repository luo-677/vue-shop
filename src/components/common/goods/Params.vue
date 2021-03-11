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
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon>
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectCateKeys"
            :options="cateList"
            :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children' }"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>

      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="openDialog">添加参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" @click="editForm(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete"
                @click="deleteForm(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled" @click="openDialog">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" @click="editForm(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete"
                @click="deleteForm(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="modifyDialogVisible"
      width="50%"
      @close="modifyDialogClose">
      <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="modifyForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      selectCateKeys: [],
      // 被激活的页签名称
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      modifyDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: 
          [
            {required: true, message: '请输入参数名称', trigger: 'blur'}
          ]
      },
      modifyForm: {
        attr_name: ''
      },
      modifyFormRules: {
        attr_name: 
          [
            {required: true, message: '请输入参数名称', trigger: 'blur'}
          ]
      },
      editAttrId: 0,
      editCateId: 0
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
          return this.$message.error(res.data.meta.msg)
        }
        this.cateList = res.data.data
        console.log(this.cateList)
      })
    },
    handleChange(){
      // 只能选中三级分类
      if(this.selectCateKeys.length !== 3){
        // 数组清空的方式需要进行验证，要使用最节省性能的方式进行清空
        this.selectCateKeys = []
        return
      }
      this.getParamsData()
      console.log(this.selectCateKeys);
    },
    // 点击tab页签出发的处理函数
    handleTabClick(){
      console.log(this.activeName)
      this.getParamsData()
    },
    async getParamsData(){
      // 根据id，sel进行数据请求
      await this.$http.get(`categories/${this.cateId}/attributes`,{
        params: {
          sel: this.activeName
        }
      })
      .then(res => {
        if(res.data.meta.status !== 200){
          return this.$message.error(this.data.meta.msg)
        }
        console.log(res.data.data)
        if(this.activeName === 'many'){
          this.manyTableData = res.data.data
        }else{
          this.onlyTableData = res.data.data
        }
      })
    },
    openDialog(){
      this.addDialogVisible = true
    },
    addDialogClose(){
      this.$refs.addFormRef.resetFields()
    },
    modifyDialogClose(){
      this.$refs.modifyFormRef.resetFields()
    },
    addParams(){
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return
        await this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        .then(res => {
          if(res.data.meta.status !== 201){
            return this.$message.error(res.data.meta.msg)
          }
          console.log(res.data.data)
          this.$message.success(res.data.meta.msg)
          this.addDialogVisible = false
          this.getParamsData()
        })
      })
    },
    editForm(row){
      this.editAttrId = row.attr_id
      this.modifyForm.attr_name = row.attr_name
      this.modifyDialogVisible = true
    },
    modifyParams(){
      console.log(this.cateId,this.editAttrId,this.modifyForm.attr_name)
      this.$refs.modifyFormRef.validate(async valid => {
        if(!valid) return
        await this.$http.put(`categories/${this.cateId}/attributes/${this.editAttrId}`,{
            attr_name: this.modifyForm.attr_name,
            attr_sel: this.activeName
        })
        .then(res => {
          if(res.data.meta.status !== 200){
            return this.$message.error(res.data.meta.msg)
          }
          console.log(res.data.data)
          this.$message.success(res.data.meta.msg)
          this.modifyDialogVisible = false
          this.getParamsData()
        })
      })
    },
    // deleteForm(row){
    //   this.editAttrId = row.attr_id
    //   this.editCateId = row.cat_id
    //   console.log(this.editAttrId,this.editCateId)
    //   this.modifyDialogVisible = true
    // },
    deleteForm(row) {
      this.editAttrId = row.attr_id
      this.editCateId = row.cat_id
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete(`categories/${this.editCateId}/attributes/${this.editAttrId}`)
        .then(res => {
          if(res.data.meta.status !== 200){
            return this.$message.error(res.data.meta.msg)
          }
          this.$message.success(res.data.meta.msg)
          this.getParamsData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })        
      })
    }
  },
  computed: {
    // 返回一个布尔值
    isBtnDisabled(){
      if(this.selectCateKeys.length){
        return false
      }else{
        return true
      }
    },
    cateId(){
      if(this.selectCateKeys.length === 3){
        return this.selectCateKeys[2]
      }
      return null
    },
    titleText(){
      if(this.activeName === "many"){
        return "动态参数"
      }else{
        return "静态属性"
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.cat_opt{
  margin: 15px 0;
}
.el-table{
  margin-top: 15px;
}
</style>