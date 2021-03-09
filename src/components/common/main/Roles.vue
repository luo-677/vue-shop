<template>
  <div>
    <!-- ctrl + j 隐藏面板 -->
    <!-- 面包屑导航，组件化！ -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="defkeys = []"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 所有角色的列表数据
      rolelist: [],
      setRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id值数组
      defkeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      await this.$http.get('roles').then(res => {
        console.log(res.data)
        if (res.data.meta.status !== 200) {
          return this.$message.error(`获取角色列表失败，${res.data.meta.msg}`)
        }
        this.rolelist = res.data.data
        console.log(this.rolelist)
      })
    },
    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$http
            .delete(`roles/${role.id}/rights/${rightId}`)
            .then(res => {
              if (res.data.meta.status !== 200) {
                return this.$message.error(`删除失败，${res.data.meta.msg}`)
              }
              this.$message.success('删除成功')
              // 不能使用调用接口进行刷新，会让整个页面进行刷新
              // this.getRolesList()
              // 接口返回的数据中自带了最新的权限，所以只需要将最新的权限赋值给对应的属性即可
              role.children = res.data.data
            })
            .catch(err => {
              return this.$message.error(`操作失败，${err.data.meta.msg}`)
            })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    async showSetRightDialog(role) {
      this.roleId = role.id
      await this.$http.get('rights/tree').then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取权限数据失败')
        }
        // 把获取到的权限数据保存到data中
        this.rightsList = res.data.data
        console.log('分配权限')
        console.log(this.rightsList)
        this.getLeafKeys(role, this.defkeys)
        this.setRightDialogVisible = true
      })
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，则为三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 递归函数，进行逐层判断
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 点击为角色分配权限
    async allotRights() {
      // console.log('在这里',this.$refs.treeRef.getCheckedKeys())
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const idStr = keys.join(',')
      // console.log(idStr)
      await this.$http
        .post(`roles/${this.roleId}/rights`, {
          rids: idStr
        })
        .then(res => {
          if (res.data.meta.status !== 200) {
            this.$message.error(`更新失败，${res.data.meta.msg}`)
          }
          this.$message.success(`${res.data.meta.msg}`)
          this.getRolesList()
          this.setRightDialogVisible = false
        })
        .catch(err => {
          this.$message.error(`${err.data.meta.msg}`)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-table {
  margin-top: 14px;
}
</style>
