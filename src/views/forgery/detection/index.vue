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
        <el-col :xs="24" :sm="24" :lg="8">
          <el-row type="flex" justify="center" align="middle">
            <el-image
              :preview-src-list="[image_url]"
              :src="image_url"
              style="width: 100%; height: 100%;"/>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <el-row type="flex" justify="center" align="middle">
            <el-image
              :preview-src-list="[result_url]"
              :src="result_url"
              style="width: 100%; height: 100%;"/>
          </el-row>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle">
        <el-button type="primary" style="font-size: 16px" @click="getForgeryDetecionResult" >鉴定</el-button>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import PieChart from '@/components/PieChart'
import { deleteForgeryResult, hasForgeryResult, startforgery } from '@/api/forgery'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'ForgeryDetection',
  components: {
    PieChart
  },
  data() {
    return {
      filename: '',
      image_url: '',
      result_url: '',
      hasResult: false,
      loading: false
    }
  },
  created() {
    this.initpage()
  },
  activated() {
    this.initpage()
  },
  mounted() {
    // this.initpage()
  },
  methods: {
    initpage() {
      var _this = this
      this.filename = this.$route.query.filename ? this.$route.query.filename : ''
      if (this.filename === '') {
        this.image_url = require('@/assets/background_images/detection.jpg')
        this.result_url = require('@/assets/background_images/detection.jpg')
      } else {
        hasForgeryResult(this.filename).then(function(resp) {
          _this.hasResult = resp.data.hasResult
          if (resp.data.hasResult) {
            _this.image_url = process.env.BASE_API + '/downloadFile/material?fileName=' + _this.filename + '&fileType=image'
            _this.result_url = process.env.BASE_API + '/forgeryDetection/downloadResult?filename=' + _this.filename
          } else {
            _this.image_url = process.env.BASE_API + '/downloadFile/material?fileName=' + _this.filename + '&fileType=image'
            _this.result_url = require('@/assets/background_images/detection.jpg')
          }
        })
      }
    },
    getForgeryDetecionResult() {
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
        this.$router.push({ name: 'ForgeryStatus' })
        startforgery(this.filename).then(function(resp) {
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
            'Forgery detection fail.',
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
        deleteForgeryResult(filename).then(response => {
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
    background: rgb(255, 255, 255);
    padding: 20px 20px 0;
    margin-bottom: 32px;
  }

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

</style>
