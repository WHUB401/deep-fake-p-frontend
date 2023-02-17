<template>
  <div class="dashboard-container">
    <el-main
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading">
      <el-row >
        <el-button type="primary" plain @click="chooseVideo">选择视频</el-button>
        <el-button type="info" plain>当前视频：{{ filename }}</el-button>
        <el-button v-show="hasResult" type="danger" @click="resultDelete(filename)">删除结果</el-button>
        <el-button v-show="!hasResult" type="info" plain>无结果</el-button>
      </el-row>
      <el-row type="flex" justify="center" align="middle">
        <el-col :xs="24" :sm="24" :lg="12">
          <VideoPlayer :mp4_video_url="video_url" :pic_url="image_url"/>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle" style="margin-bottom: 30px">
        <el-col :xs="24" :sm="24" :lg="12">
          <Slide v-model="frame_num" :popover_title="popover_title_frame_num" :popover_msg="popover_msg_frame_num" :popover_content="popover_content_frame_num" :slider_max="max_size_frame_num"/>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle" style="margin-bottom: 60px">
        <el-button type="primary" style="font-size: 16px" @click="getFakeFrameAndChartData" >鉴定</el-button>
      </el-row>
      <el-row :gutter="20" :span="24" type="flex" justify="center">
        <el-col :xs="24" :sm="24" :lg="12" class="el-cow-result">
          <el-row>
            <el-col type="flex" justify="center" align="middle"><line-chart :chart-data="lineChartData" /></el-col>
          </el-row>
          <el-row>
            <el-col type="flex" justify="center" align="middle">
              <el-table
                :data="tableData"
                style="width: 540px">
                <el-table-column
                  prop="TotalFrames"
                  label="TotalFrames"
                  width="180"/>
                <el-table-column
                  prop="FakeFrames"
                  label="FakeFrames"
                  width="180"/>
                <el-table-column
                  prop="Accuracy"
                  label="Confidence"
                  width="180"/>
              </el-table>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="12">
          <transition-group tag="el-col" name="el-zoom-in-top">
            <el-col v-for="fakeFrames_list in fakeFrames_lists_full.slice(0, frame_num)" :offset="1" :xs="24" :sm="24" :lg="6" :key="fakeFrames_list.index" style="margin-bottom: 60px" >
              <el-row >
                <el-card :body-style="{ padding: '0px', marginBottom: '1' }" shadow="always">
                  <el-image
                    :preview-src-list="[fakeFrames_list.src]"
                    :src="fakeFrames_list.src"/>
                  <el-row>
                    <el-col :span="24" align="middle"><span>{{ fakeFrames_list.name }}</span></el-col>
                  </el-row>
                </el-card>
              </el-row>
            </el-col>
          </transition-group>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer'
import Slide from '@/components/Slide'
import LineChart from '@/components/LineChart'
import PieChart from '@/components/PieChart'
import { deleteDetectionResult, getMediaResult, startDetection } from '@/api/deepfake'
import { Message, MessageBox } from 'element-ui'

var newdata = {
  xData: [],
  actualData: []
}

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
      hasResult: false,
      filename: '',
      image_url: '',
      video_url: '',
      lineChartData: {
        xData: [],
        actualData: []
      },
      loading: false,
      frame_num: 6,
      popover_title_frame_num: 'Frame_Num',
      popover_msg_frame_num: 'Frame_Num',
      popover_content_frame_num: '鉴定出的部分虚假帧数，默认为6',
      max_size_frame_num: 18,
      tableData: [{
        TotalFrames: '',
        FakeFrames: '',
        Accuracy: ''
      }],
      fakeFrames_lists_full: []
    }
  },
  computed: {
  },
  watch: {
    frame_num: function() {
      this.lineChartData.xData = newdata.xData.slice(0, this.frame_num)
      this.lineChartData.actualData = newdata.actualData.slice(0, this.frame_num)
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
      // this.fakeFrames_lists = this.fakeFrames_lists_full.slice(0, this.frame_num)
      var _this = this
      this.filename = this.$route.query.video ? this.$route.query.video : ''
      this.image_url = process.env.BASE_API + '/downloadFile/material?fileName=' + this.filename.substring(0, this.filename.lastIndexOf('.')) + '.jpg&fileType=video'
      this.video_url = process.env.BASE_API + '/downloadFile/material?fileName=' + this.filename.substring(0, this.filename.lastIndexOf('.')) + '.mp4&fileType=video'
      var info = {
        mediaName: this.filename
      }
      getMediaResult(info).then(response => {
        var result = response.data.result
        _this.max_size_frame_num = (result.framesData.filename.length >= 18) ? 18 : result.framesData.filename.length
        _this.hasResult = true
        _this.tableData = [{
          TotalFrames: result.totalFrames,
          FakeFrames: result.fakeFrames,
          Accuracy: parseFloat(result.accuracy.toFixed(6))
        }]
        var nameArray = result.framesData.filename
        var yDataArray = []
        var xDataArray = []
        for (var i = 0; i < result.framesData.accuracy.length; i++) {
          xDataArray.push(result.framesData.filename[i])
          yDataArray.push(parseFloat(Number(result.framesData.accuracy[i]).toFixed(6)))
          _this.fakeFrames_lists_full[i] = {
            index: i,
            src: process.env.BASE_API + '/dfDetection/download?mediaName=' + _this.filename + '&pictureName=' + result.framesData.filename[i],
            name: nameArray[i]
          }
        }
        newdata.xData = xDataArray
        newdata.actualData = yDataArray
        _this.lineChartData.xData = newdata.xData.slice(0, _this.frame_num)
        _this.lineChartData.actualData = newdata.actualData.slice(0, _this.frame_num)
      }).catch(function(response) {
        newdata = {
          xData: [],
          actualData: []
        }
        for (let k = 0; k < 20; k++) {
          _this.fakeFrames_lists_full.push({
            index: k,
            src: require('@/assets/background_images/detection.jpg'),
            name: 'fake Frames' + k
          })
        }
      })
    },
    chooseVideo() {
      this.$router.push({ name: 'VideoLibrary' })
    },
    getFakeFrameAndChartData() {
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
          message: '请选择视频',
          type: 'info',
          duration: 5 * 1000
        })
        this.loading = false
      } else {
        this.$router.push({ name: 'DeepfakeDetectionStatus' })
        startDetection(this.filename).then(function(resp) {
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
      }
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
