<template>
  <div class="app-container">
    <el-main>
      <el-select v-model="datasetname" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="initpage" />
      <el-collapse-transition>
        <div v-show="show">
          <el-row>
            <el-col v-for="material_list in materiallists" :xs="24" :sm="10" :lg="5" :key="material_list.index" :offset="1" style="margin-top:20px">
              <el-card :body-style="{ padding: '5px', marginBottom: '1'}" class="el-card" shadow="always">
                <VideoPlayer :mp4_video_url="material_list.src" :pic_url="material_list.pic"/>
                <!-- <el-row>
                  <img :src="material_list.pic" class="el-card-img">
                </el-row> -->
                <el-row>
                  <el-col :span="24" type="flex" justify="center" align="middle"><span>{{ material_list.name }}</span></el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" type="flex" justify="center" align="middle">
                    <el-dropdown size="mini">
                      <el-button size="mini" type="primary" plain>检测</el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><el-button type="text" size="mini" class="text_buttom" @click="goToDetection (material_list.name)">Adversarial detection</el-button></el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
    </el-main>
  </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer'
import { getAdversarialPage } from '@/api/adversarial'
import { deleteFile } from '@/api/file'
import Pagination from '@/components/Pagination'

export default {
  name: 'VideoDatasetData',
  components: {
    VideoPlayer,
    deleteFile,
    Pagination
  },
  data() {
    return {
      options: [{
        value: 'Deepfakes',
        label: 'Deepfakes'
      }, {
        value: 'Face2Face',
        label: 'Face2Face'
      }, {
        value: 'FaceSwap',
        label: 'FaceSwap'
      }, {
        value: 'NeuralTextures',
        label: 'NeuralTextures'
      }, {
        value: 'original',
        label: 'original'
      }],
      currentDate: new Date().toString().split(' ').slice(1, 4).join('/'),
      index: 3,
      materiallists: [],
      loading: false,
      datasetname: 'Deepfakes',
      show: true,
      total: 0,
      listQuery: {
        page: 1,
        size: 20,
        sort: 'id,asc',
        dataset: 'Deepfakes',
        filename: ''
      }
    }
  },
  watch: {
    datasetname: function() {
      this.listQuery.dataset = this.datasetname
      this.initpage()
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
    handleSizeChange(val) {
      this.single_page_num = val
    },
    handleCurrentChange(val) {
      this.current_page = val
    },
    initpage() {
      var _this = this
      this.materiallists = []
      getAdversarialPage(this.listQuery).then(function(resp) {
        _this.total = resp.data.total
        resp.data.result.forEach(function(value, index, array) {
          _this.materiallists.push({
            src: process.env.BASE_API + '/downloadFile/dataset?datasetType=video&isVideo=true&datasetName=' + _this.datasetname + '&filename=' + value.filename,
            pic: process.env.BASE_API + '/downloadFile/dataset?datasetType=video&isVideo=false&datasetName=' + _this.datasetname + '&filename=' + value.filename.substring(0, value.filename.lastIndexOf('.')) + '.jpg',
            name: value.filename,
            index: index
          })
        })
      })
    },
    getVideo() {},
    getResponse(data) {
      const { fullPath } = this.$route
      console.log(data)
      this.index += 1
      this.$router.replace({
        path: '/redirect' + fullPath
      })
      this.loading = true
      setTimeout(() => {
        this.materiallists.push({
          src: data.fileDownloadUri.substring(0, data.fileDownloadUri.lastIndexOf('.')) + '.jpg',
          name: data.fileName,
          index: this.index
        })
        this.loading = false
      }, 0)
    },
    goToDetection(name) {
      this.$router.push({ name: 'AdeversarialDetection', query: { filename: name, dataset: this.datasetname }})
    }
  }
}
</script>

<style scoped>
.app-container {
  background-color: #e9e6e6;
  height: 100%;
}
.text_buttom{
  color:black;
}
.box-card{
  position: fixed;
  top: 0;
  left: 0;
  right:0;
  bottom: 0;
  margin: auto;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}
.button {
  padding: 1;
  float: right;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.material {
  margin-top: 30;
}

.el-row {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
}

.el-card {
  min-width: 100%;
  height: 100%;
  margin-right: 20px;
  transition: all .5s;
}

.el-card-img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
}

.el-row-inline {
    display: flex;
    flex-wrap: wrap;
}
</style>

<style lang="scss" >
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
}

</style>
