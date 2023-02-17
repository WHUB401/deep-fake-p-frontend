<template>
  <div class="app-container">
    <el-col :xs="24" :sm="24" :lg="24">
      <el-select v-model="listQuery.sort" placeholder="sort" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in sortOptions" :key="item.index" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.dataset" placeholder="dataset" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in datasetOptions" :key="item.index" :label="item" :value="item" />
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
        <el-table-column align="center" label="id" prop="id" width="95">
          <template slot-scope="{row}">
            {{ row.id }}
          </template>
        </el-table-column>
        <el-table-column label="filename">
          <template slot-scope="{row}">
            {{ row.filename }}
          </template>
        </el-table-column>
        <el-table-column label="dataset">
          <template slot-scope="{row}">
            {{ row.dataset }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="result" width="95">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="getDetectionResult(row.filename, row.dataset)">
              查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="result" width="95">
          <template slot-scope="{row}">
            <el-button size="mini" type="danger" @click="resultDelete(row.dataset, row.filename)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" />

    </el-col>
  </div>
</template>

<script>
import { deleteAdversarialResult, getAdversarialPage } from '@/api/adversarial'
import Pagination from '@/components/Pagination'
export default {
  name: 'AdversarialResult',
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
      datasetOptions: ['Deepfakes', 'Face2Face', 'FaceSwap', 'NeuralTextures', 'original'],
      sortOptions: [
        { label: 'id+', value: 'id,asc' },
        { label: 'id-', value: 'id,desc' },
        { label: 'dataset+', value: 'dataset,asc' },
        { label: 'dataset-', value: 'dataset,desc' },
        { label: 'filename+', value: 'filename,asc' },
        { label: 'filename-', value: 'filename,desc' }
      ],
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        size: 20,
        sort: '',
        dataset: '',
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
      getAdversarialPage(this.listQuery).then(response => {
        this.list = response.data.result
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    getDetectionResult(filename, datasetname) {
      this.$router.push({ name: 'AdeversarialDetection', query: { filename: filename, dataset: datasetname }})
    },
    resultDelete(dataset, filename) {
      const { fullPath } = this.$route
      var _this = this
      this.$confirm('此操作将永久删除该结果, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAdversarialResult(dataset, filename).then(response => {
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

