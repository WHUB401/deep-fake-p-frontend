<template>
  <div class="dashboard-editor-container">
    <el-main
      v-loading="loading"
      element-loading-text="检测中"
      element-loading-spinner="el-icon-loading">
      <el-row>
        <el-button type="primary" plain @click="chooseImage">选择图片</el-button>
        <el-button type="info" plain>当前图片：{{ filename }}</el-button>
        <el-button v-show="hasResult" type="danger" @click="resultDelete(filename)">删除结果</el-button>
        <el-button v-show="!hasResult" type="info" plain>无结果</el-button>
      </el-row>
      <el-row :gutter="32" type="flex" justify="center" align="middle">
        <el-col :xs="24" :sm="24" :lg="12" style="margin-top:20px">
          <el-image
            :preview-src-list="[image_url]"
            :src="image_url"
            style="width: 100%; height: 100%;"/>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12" style="margin-top:20px">
          <el-row type="flex" justify="center" align="middle" class="chart-wrapper">
            <pie-chart :chart-data="pieChartData"/>
          </el-row>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle">
        <el-button type="primary" plain style="font-size: 16px" @click="runTraceDetection">检测</el-button>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import PieChart from '@/components/PieChart'
import { deleteTraceResult, hasTraceResult, findTraceResult, startTrace } from '@/api/trace'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'Trace',
  components: {
    PieChart
  },
  data() {
    return {
      loading: false,
      filename: '',
      image_url: '',
      pieChartData: [],
      hasResult: false
    }
  },
  created() {
    this.initpage()
  },
  activated() {
    this.initpage()
  },
  methods: {
    initpage() {
      var _this = this
      this.filename = this.$route.query.filename ? this.$route.query.filename : ''
      if (this.filename === '') {
        this.image_url = require('@/assets/background_images/detection.jpg')
      } else {
        this.image_url = process.env.BASE_API + '/downloadFile/material?fileName=' + _this.filename + '&fileType=image'
        hasTraceResult(this.filename).then(function(resp) {
          _this.hasResult = true
          _this.initPieChart()
        }).catch(function(resopnse) {
          _this.hasResult = false
        })
      }
    },
    initPieChart() {
      var _this = this
      findTraceResult(this.filename).then(function(resp) {
        var results = resp.data.results
        for (let j = 0; j < results.length; j++) {
          _this.pieChartData.push({
            value: results[j].probability,
            name: results[j].source
          })
        }
      })
    },
    runTraceDetection() {
      const { fullPath } = this.$route
      var _this = this
      this.loading = true
      if (this.hasResult) {
        Message({
          message: '已有检测结果',
          type: 'info',
          duration: 5 * 1000
        })
        this.loading = false
      } else if (this.filename === '') {
        Message({
          message: '请选择图片',
          type: 'info',
          duration: 5 * 1000
        })
        this.loading = false
      } else {
        this.$router.push({ name: 'TraceStatus' })
        startTrace(this.filename).then(function(resp) {
          Message({
            message: resp.message,
            type: 'success',
            duration: 5 * 1000
          })
          _this.loading = false
          setTimeout(() => {
            _this.$router.replace({
              path: '/redirect' + fullPath
            })
          }, 3000)
        }).catch(function(response) {
          MessageBox.confirm(
            response.message,
            'Trace detection fail.',
            {
              confirmButtonText: '确定',
              closeOnClickModal: false,
              closeOnPressEscape: false,
              showCancelButton: false,
              showClose: false,
              type: 'error'
            }
          ).then(() => {
            _this.$router.replace({
              path: '/redirect' + fullPath
            })
          })
        })
      }
    },
    chooseImage() {
      this.$router.push({ name: 'ImageLibrary' })
    },
    resultDelete(filename) {
      const { fullPath } = this.$route
      var _this = this
      this.$confirm('此操作将永久删除该结果, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTraceResult(filename).then(response => {
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

<style rel="stylesheet/scss" lang="scss" scoped>

.dashboard-editor-container {
    background-color: #e9e6e6;
    min-height: calc(100vh - 50px);
    padding: 50px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }
  }

.el-row {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap
  }

.center {
    margin: auto;
}

.chart-wrapper {
  width: 100%;
  height: 500px;
  background: rgb(255, 255, 255);
}

.image {
  width: 100%;
  display: block;
}

</style>
