<template>
  <div class="dashboard-container">
    <el-main
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading">
      <el-row >
        <el-col :span="3"><el-button type="primary" plain @click="startDetection">Start</el-button></el-col>
        <el-col :span="3"><el-link :download="item.name" :href="item.src"><el-button type="primary" plain>Download Result</el-button></el-link></el-col>
      </el-row>
      <el-row :gutter="20" :span="24" type="flex" justify="center">
        <div class="text-wrapper">{{ result }}</div>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer'
import Slide from '@/components/Slide'
import LineChart from '@/components/LineChart'
import PieChart from '@/components/PieChart'
import { getImageResult, startDetectionImage } from '@/api/deepfake'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'DeepfakeDetection',
  components: {
    Slide,
    LineChart,
    PieChart,
    VideoPlayer
  },
  data() {
    return {
      loading: false,
      result: 'none',
      item: {
        name: 'result.txt',
        src: process.env.BASE_API + '/dfDetection/downloadImageResult'
      }
    }
  },
  computed: {
  },
  watch: {
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
      getImageResult().then(response => {
        this.result = response.replace(/\r/g, '\n')
      }).catch(response => {
      })
    },
    startDetection() {
      const { fullPath } = this.$route
      var _this = this
      this.loading = true
      this.$router.push({ name: 'DeepfakeDetectionStatus' })
      startDetectionImage().then(function(resp) {
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
          'Deepfake detection fail.',
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
    },
    downloadResult() {
      getImageResult()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    background-color: #e9e6e6;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.text-wrapper {
  white-space: pre-wrap;
}
.image {
  width: 100%;
  display: block;
}
.el-row {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
}
.el-card {
    min-width: 100%;
    height: 50%;
    margin-right: 20px;
}
.el-cow-result {
  height: 100%;
}
// .el-card-define {
//   min-height: 100%;
//   height: 100%;
// }
.box {
    height:100%;
}
</style>
