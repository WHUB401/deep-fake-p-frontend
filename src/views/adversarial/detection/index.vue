<template>
  <div class="dashboard-editor-container">
    <el-main
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading">
      <el-row :offset="1" style="margin-bottom: 20px;">
        <el-col>
          <el-button type="primary" plain @click="chooseVideo">选择视频</el-button>
          <el-button type="info" plain>当前数据集： {{ dataset }}</el-button>
          <el-button type="info" plain>当前视频： {{ filename }}</el-button>
          <el-button v-show="has_result" type="danger" @click="resultDelete(dataset, filename)">删除结果</el-button>
          <el-button v-show="!has_result" type="info" plain>无结果</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle" style="flex-wrap: wrap;">
        <el-col :xs="24" :sm="24" :lg="10" type="flex" justify="center" align="middle" class="el-cow-card">
          <el-row style="margin-bottom: 20px;">
            <h3 class="second-title">Video</h3>
          </el-row>
          <el-row>
            <VideoPlayer :mp4_video_url="src_url" :pic_url="pic_url"/>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="10" type="flex" justify="center" align="middle" class="el-cow-card">
          <el-row style="margin-bottom: 20px;">
            <h3 class="second-title">Adv Picture</h3>
          </el-row>
          <el-row>
            <el-image
              :preview-src-list="adv_result_pic"
              :src="adv_result_pic[0]"/>
          </el-row>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle" style="margin-bottom: 30px">
        <el-col :xs="24" :sm="24" :lg="12">
          <Slide v-model="result_num" :popover_title="popover_title_result_num" :popover_msg="popover_msg_result_num" :popover_content="popover_content_result_num" :slider_max="max_size_result_num"/>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle" style="margin-bottom: 60px">
        <el-button type="primary" plain style="font-size: 16px" @click="runDetection(dataset, filename)">检测</el-button>
      </el-row>
      <el-row :gutter="20" type="flex" justify="center" style="flex-wrap: wrap;">
        <el-col :xs="24" :sm="24" :lg="12" class="el-cow-result">
          <el-row class="chart-wrapper">
            <el-col type="flex" justify="center" align="middle"><bar-chart :chart-data="barChartData" box-sizing="border-box"/></el-col>
          </el-row>
          <el-row>
            <el-col type="flex" justify="center" align="middle">
              <el-table
                :data="tableData"
                style="width: 900px">
                <el-table-column
                  prop="class"
                  label="class"
                  width="290"/>
                <el-table-column
                  prop="confidence"
                  label="confidence"
                  width="290"/>
                <el-table-column
                  prop="correct"
                  label="True/False"
                  width="290"/>
              </el-table>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="12">
          <el-row type="flex" justify="center" align="middle" style="border: solid 1px blue" class="el-row-pic">
            <h3 class="second-title">adv_adv</h3>
            <transition-group tag="el-col" name="el-zoom-in-top">
              <el-col v-for="list in lists_full.slice(0, result_num)" :xs="24" :sm="24" :lg="6" :key="list.index" class="el-cow-card">
                <el-card :body-style="{ padding: '0px', marginBottom: '1' }" shadow="always">
                  <el-image
                    :preview-src-list="[list.adv_adv_src]"
                    :src="list.adv_adv_src"/>
                  <el-row>
                    <el-col :span="24" align="middle"><span>{{ list.adv_adv_name }}</span></el-col>
                  </el-row>
                </el-card>
              </el-col>
            </transition-group>
          </el-row>
          <el-row type="flex" justify="center" align="middle" style="border: solid 1px red" class="el-row-pic">
            <h3 class="second-title">adv_clean</h3>
            <transition-group tag="el-col" name="el-zoom-in-top">
              <el-col v-for="list in lists_full.slice(0, result_num)" :xs="24" :sm="24" :lg="6" :key="list.index" class="el-cow-card">
                <el-card :body-style="{ padding: '0px', marginBottom: '1' }" shadow="always">
                  <el-image
                    :preview-src-list="[list.adv_clean_src]"
                    :src="list.adv_clean_src"/>
                  <el-row>
                    <el-col :span="24" align="middle"><span>{{ list.adv_clean_name }}</span></el-col>
                  </el-row>
                </el-card>
              </el-col>
            </transition-group>
          </el-row>
          <el-row type="flex" justify="center" align="middle" style="border: solid 1px green" class="el-row-pic">
            <h3 class="second-title">clean_clean</h3>
            <transition-group tag="el-col" name="el-zoom-in-top">
              <el-col v-for="list in lists_full.slice(0, result_num)" :xs="24" :sm="24" :lg="6" :key="list.index" class="el-cow-card">
                <el-card :body-style="{ padding: '0px', marginBottom: '1' }" shadow="always">
                  <el-image
                    :preview-src-list="[list.clean_clean_src]"
                    :src="list.clean_clean_src"/>
                  <el-row>
                    <el-col :span="24" align="middle"><span>{{ list.clean_clean_name }}</span></el-col>
                  </el-row>
                </el-card>
              </el-col>
            </transition-group>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import Slide from '@/components/Slide'
import BarChart from '@/components/BarChart'
import VideoPlayer from '@/components/VideoPlayer'
import { Message, MessageBox } from 'element-ui'
import { hasData, getAdversarialResult, runAdversarialDetection, deleteAdversarialResult, getAdvPictureList } from '@/api/adversarial'

export default {
  name: 'AdeversarialDetection',
  components: {
    BarChart,
    VideoPlayer,
    Slide
  },
  data() {
    return {
      loading: false,
      has_data: false,
      has_result: false,
      index: 0,
      result_num: 6,
      popover_title_result_num: 'Picture_Num',
      popover_msg_result_num: 'Picture_Num',
      popover_content_result_num: '每种模式展示的图片数量，默认为6',
      max_size_result_num: 18,
      filename: '',
      dataset: '',
      pic_url: '',
      src_url: '',
      barChartData: {
        xData: [],
        actualData: []
      },
      result_lists_full: [],
      tableData: [],
      lists_full: [],
      adv_clean_lists_full: [],
      clean_clean_lists_full: [],
      adv_adv_confidence: 0,
      adv_clean_confidence: 0,
      clean_clean_confidence: 0,
      adv_result_pic: []
    }
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
      debugger
      var _this = this
      this.filename = this.$route.query.filename
      this.dataset = this.$route.query.dataset
      hasData(this.dataset, this.filename).then(response => {
        _this.has_data = true
      }).catch(function(response) {
        debugger
        _this.has_data = false
      })
      this.src_url = process.env.BASE_API + '/downloadFile/dataset?datasetType=video&isVideo=true&datasetName=' + this.dataset + '&filename=' + this.filename
      this.pic_url = process.env.BASE_API + '/downloadFile/dataset?datasetType=video&isVideo=false&datasetName=' + this.dataset + '&filename=' + this.filename.substring(0, this.filename.lastIndexOf('.')) + '.jpg'
      this.$forceUpdate(VideoPlayer)
      getAdvPictureList(this.dataset, this.filename).then(response => {
        var pic = response.data.result.pic
        for (var i = 0; i < pic.length; i++) {
          this.adv_result_pic.push(process.env.BASE_API + '/downloadFile/adversarial/advFile?dataset=' +
           this.dataset + '&filename=' +
           this.filename + '&picture=' + pic[i])
        }
      })
      this.initData()
    },
    initData() {
      getAdversarialResult(this.dataset, this.filename).then(response => {
        debugger
        this.has_result = response.data.hasResult
        if (response.data.hasResult) {
          var result = response.data.result
          this.max_size_result_num = (result.adv_clean.pic.length >= 16) ? 16 : result.adv_clean.pic.length
          this.hasResult = true
          this.adv_adv_confidence = parseFloat(result.adv_adv.confidence.toFixed(6))
          this.adv_clean_confidence = parseFloat(result.adv_clean.confidence.toFixed(6))
          this.clean_clean_confidence = parseFloat(result.clean_clean.confidence.toFixed(6))
          // 初始化图表
          this.tableData = [{
            class: 'adv_adv',
            confidence: parseFloat(this.adv_adv_confidence.toFixed(6)),
            correct: result.adv_adv.TorF
          }, {
            class: 'adv_clean',
            confidence: parseFloat(this.adv_clean_confidence.toFixed(6)),
            correct: result.adv_clean.TorF
          }, {
            class: 'clean_clean',
            confidence: parseFloat(this.clean_clean_confidence.toFixed(6)),
            correct: result.clean_clean.TorF
          }]
          this.barChartData.xData = ['adv_adv', 'adv_clean', 'clean_clean']
          this.barChartData.actualData = [this.adv_adv_confidence, this.adv_clean_confidence, this.clean_clean_confidence]
          var adv_adv_nameArray = result.adv_adv.pic
          var adv_clean_nameArray = result.adv_clean.pic
          var clean_clean_nameArray = result.clean_clean.pic
          for (var i = 0; i < this.max_size_result_num; i++) {
            this.lists_full.push({
              index: i,
              adv_adv_src: process.env.BASE_API + '/downloadFile/adversarial/result?type=adv_adv&dataset=' + this.dataset + '&filename=' + this.filename + '&picture=' + adv_adv_nameArray[i],
              adv_adv_name: adv_adv_nameArray[i],
              adv_clean_src: process.env.BASE_API + '/downloadFile/adversarial/result?type=adv_clean&dataset=' + this.dataset + '&filename=' + this.filename + '&picture=' + adv_clean_nameArray[i],
              adv_clean_name: adv_clean_nameArray[i],
              clean_clean_src: process.env.BASE_API + '/downloadFile/adversarial/result?type=clean_clean&dataset=' + this.dataset + '&filename=' + this.filename + '&picture=' + clean_clean_nameArray[i],
              clean_clean_name: clean_clean_nameArray[i]
            })
          }
        }
      })
    },
    runDetection(dataset, filename) {
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
      } else if (!this.has_data) {
        Message({
          message: '请选择视频',
          type: 'info',
          duration: 5 * 1000
        })
        this.loading = false
      } else {
        this.$router.push({ name: 'AdversarialStatus' })
        runAdversarialDetection(dataset, filename).then(function(resp) {
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
            'Adversarial detection fail.',
            {
              confirmButtonText: '确定',
              closeOnClickModal: false,
              closeOnPressEscape: false,
              showCancelButton: false,
              showClose: false,
              type: 'error'
            }
          ).then(() => {
            _this.loading = false
            _this.$router.replace({
              path: '/redirect' + fullPath
            })
          })
        })
      }
    },
    chooseVideo() {
      this.$router.push({ name: 'VideoDataset' })
    },
    resultDelete(dataset, filename) {
      const { fullPath } = this.$route
      var _this = this
      this.$confirm('此操作将永久删除该结果, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteAdversarialResult(dataset, filename).then(response => {
          if (response.code === 200) {
            _this.loading = false
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
            _this.loading = false
            _this.$message({
              type: 'info',
              message: '删除失败'
            })
          }
        }).catch(function(response) {
          _this.loading = false
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
  height: 100%;
  min-height:calc(100vh - 50px);
}

// .el-row {
//     margin-bottom: 20px;
//     display: flex;
//     flex-wrap: wrap
// }

.el-row-pic {
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.el-cow-card{
  margin-bottom: 20px;
  margin-top: 20px;
  margin-left:20px;
  margin-right:20px
}

.center {
    margin: auto;
}

.chart-wrapper {
    background: rgb(255, 255, 255);
    padding: 20px 20px 0;
    margin-bottom: 32px;
  }

.image {
  width: 100%;
  display: block;
}

.el-cow-result {
  height: 100%;
}

.second-title {
  font-family: 宋体;
  font-size: 20px;
  color: #000000;
  text-align: center;
  font-weight: bold;
}

.el-row-inline {
    // display: flex;
    flex-wrap: wrap;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

</style>
