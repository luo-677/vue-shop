<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" style="margin-left: 15px">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="goods_list"
        style="width: 100%; margin-top: 15px"
        border
        stripe
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="800">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="150">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="150">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="250">
          <template v-slot="scope">
            {{ scope.row.add_time | goods_creatTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" class="lastColumn">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <!-- goods_id -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeById(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
        style="margin-top: 15px"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询参数属性
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goods_list: [],
      total: 0
    }
  },
  filters: {
    goods_creatTime(data) {
      // console.log(new Date(data))
      const dt = new Date(data * 1000)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')
      const hh = (dt.getHours() + '').padStart(2, '0')
      const mm = (dt.getMinutes() + '').padStart(2, '0')
      const ss = (dt.getSeconds() + '').padStart(2, '0')
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取数据列表
    async getGoodsList() {
      await this.$http
        .get('goods', {
          params: this.queryInfo
        })
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error(res.data.meta.msg)
          }
          this.$message.success(res.data.meta.msg)
          this.goods_list = res.data.data.goods
          this.total = res.data.data.total
        })
        .catch(err => {
          this.$message.error(err.data.meta.msg)
        })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    removeById(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$http
            .delete(`goods/${row.goods_id}`)
            .then(res => {
              if (res.data.meta.status !== 200) {
                this.$message.error(res.data.meta.msg)
              }
              this.$message.success(res.data.meta.msg)
              this.getGoodsList()
            })
            .catch(err => {
              this.$message.error(err.data.meta.msg)
            })
        })
        .catch(() => {
          this.$message.info('删除已取消')
        })
    },
    goAddPage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="scss">
.el-table .cell {
  text-align: center !important;
}
</style>
