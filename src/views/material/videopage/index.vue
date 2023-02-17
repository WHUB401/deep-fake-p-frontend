<template>
  <div class="app-container">
    <el-main
      v-loading="loading"
      style="width: 100%"
      class="app-main">
      <el-row :gutter="12" type="flex" justify="center" align="middle">
        <el-col :xs="24" :sm="24" :lg="8">
          <UploadVideo :upload_url="upload_url" :upload_link="upload_link" :upload_text="upload_text" :upload_type="upload_type" :accept_types ="accept_types" :media_type="media_type" :loading="loading" @getResponse="getResponse" @startUpload="componentLoadingChangeTrue" @handleError="componentLoadingChangeFalse"/>
        </el-col>
      </el-row>
      <el-row class="el-row-inline">
        <el-col v-for="material_list in materiallists" :xs="24" :sm="6" :lg="5" :key="material_list.index" :offset="1" style="margin-top:20px">
          <el-card :body-style="{ padding: '2px', marginBottom: '1'}" shadow="always">
            <VideoPlayer :mp4_video_url="material_list.src" :pic_url="material_list.pic"/>
            <el-row>
              <el-col :span="24" type="flex" justify="center" align="middle"><span>{{ material_list.name }}</span></el-col>
            </el-row>
            <el-row :gutter="20" type="flex" justify="center" align="middle">
              <el-col :span="8" :push="2">
                <el-dropdown size="mini">
                  <el-button size="mini" type="primary" plain>鉴定</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><el-button type="text" size="mini" class="text_buttom" @click="goToDetection (material_list.name)">Deepfake detection</el-button></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
              <!-- <el-button size="mini" type="primary" plain @click="goToDetection (material_list.name)">鉴定</el-button> -->
              <el-col :span="8" :pull="0">
                <el-button size="mini" type="danger" plain @click="fileDelete (material_list.name,material_list.index)">删除</el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer'
import UploadVideo from '@/components/UploadVideo'
import { getFileLists } from '@/api/file'
import { deleteFile } from '@/api/file'

export default {
  name: 'VideoLibrary',
  components: {
    UploadVideo,
    getFileLists,
    deleteFile,
    VideoPlayer
  },
  data() {
    return {
      upload_text: '将视频文件拖到此处或',
      upload_link: '点击上传',
      upload_url: '/uploadFile',
      upload_type: '.mp4,.MP4',
      accept_types: ['video/mp4'],
      media_type: 'video',
      currentDate: new Date().toString().split(' ').slice(1, 4).join('/'),
      index: 3,
      materiallists: [],
      loading: false
    }
  },
  created() {
    // this.initpage()
  },
  activated() {
    this.initpage()
  },
  mounted() {
    this.initpage()
  },
  methods: {
    initpage() {
      var _this = this
      this.materiallists = []
      getFileLists('video').then(function(resp) {
        resp.data.video.forEach(function(value, index, array) {
          _this.materiallists.push({
            src: process.env.BASE_API + '/downloadFile/material?fileName=' + value.filename + '&fileType=video',
            pic: process.env.BASE_API + '/downloadFile/material?fileName=' + value.filename.substring(0, value.filename.lastIndexOf('.')) + '.jpg&fileType=video',
            name: value.filename,
            index: index
          })
        })
      })
    },
    getVideo() {},
    getResponse(data) {
      const { fullPath } = this.$route
      this.$router.replace({
        path: '/redirect' + fullPath
      })
    },
    fileDelete(filename) {
      const { fullPath } = this.$route
      var _this = this
      this.$confirm('此操作将永久删除该视频与检测结果, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var files = {
          fileName: filename,
          fileType: 'video'
        }
        deleteFile('/delete/file', files).then(response => {
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
          } else if (response.code === 500) {
            _this.$message({
              type: 'info',
              message: '删除失败'
            })
          } else {
            console.log(response.data)
          }
        })
        // this.materiallists.splice(this.materiallists.findIndex(item => item.index === 1), 1)
      })
    },
    goToDetection(name) {
      this.$router.push({ name: 'DeepfakeDetection', query: { video: name }})
    },
    componentLoadingChangeTrue() {
      this.loading = true
    },
    componentLoadingChangeFalse() {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.app-container {
  background-color: #e9e6e6;
  height: 100%;
  min-height:calc(100vh - 50px);
}

.app-main {
  height: 100%;
  min-height:calc(100vh - 100px);
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
.image {
  width: 100%;
  display: block;
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
  height: 95%;
  margin-right: 20px;
  transition: all .5s;
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
