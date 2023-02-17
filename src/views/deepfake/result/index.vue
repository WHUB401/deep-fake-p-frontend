<template>
  <div class="app-container">
    <el-col :xs="24" :sm="24" :lg="24">
      <el-select v-model="listQuery.sort" placeholder="sort" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in sortOptions" :key="item.index" :label="item.label" :value="item.value" />
      </el-select>
      <el-input v-model="listQuery.filename" placeholder="filename" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        style="width: 100%;margin-top:10px">
        <el-table-column align="center" label="ID" width="95">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="Filename">
          <template slot-scope="scope">
            {{ scope.row.filename }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="result" width="95">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="getDetectionResult(scope.row.filename)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="result" width="95">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" plain @click="resultDelete(scope.row.filename)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" />
    </el-col>
  </div>
</template>

<script>
import { deleteDetectionResult, getDeepfakeResultPage } from '@/api/deepfake'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      sortOptions: [
        { label: 'id+', value: 'id,asc' },
        { label: 'id-', value: 'id,desc' },
        { label: 'filename+', value: 'filename,asc' },
        { label: 'filename-', value: 'filename,desc' }
      ],
      list: null,
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        size: 20,
        sort: '',
        filename: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getDeepfakeResultPage(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.result
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    getDetectionResult(filename) {
      this.$router.push({ name: 'DeepfakeDetection', query: { video: filename }})
    },
    resultDelete(filename) {
      const { fullPath } = this.$route
      var _this = this
      this.$confirm('此操作将永久删除该结果, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDetectionResult(filename).then(response => {
          if (response.code === 200) {
            // _this.materiallists.splice(index, 1)
            _this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // location.reload()
            _this.$router.replace({
              path: '/redirect' + fullPath
            })
          } else {
            _this.$message({
              type: 'info',
              message: '删除失败'
            })
          }
        }).catch(function(response) {
          _this.$message({
            type: 'info',
            message: '删除失败'
          })
        })
        // this.materiallists.splice(this.materiallists.findIndex(item => item.index === 1), 1)
      })
    }
  }
}
</script>

<style scoped>
.check-icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.15em;
  fill: rgb(0, 0, 0);
  color: rgb(0, 0, 0);
  stroke: rgb(0, 0, 0);
  overflow: hidden;
}
</style>

