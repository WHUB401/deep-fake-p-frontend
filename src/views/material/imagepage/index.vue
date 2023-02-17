<template>
  <div class="app-container">
    <el-main
      v-loading="loading"
      style="width: 100%"
      class="app-main">
      <el-row>
        <el-col :xs="24" :sm="24" :lg="8">
          <el-button type="danger" plain @click="deleteAllImage">删除所有图片</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle">
        <el-col :xs="24" :sm="24" :lg="8">
          <UploadVideo :upload_url="upload_url" :upload_link="upload_link" :upload_text="upload_text" :upload_type="upload_type" :accept_types ="accept_types" :media_type="media_type" :loading="loading" @getResponse="getResponse" @startUpload="componentLoadingChangeTrue" @handleError="componentLoadingChangeFalse"/>
        </el-col>
      </el-row>
      <el-row class="el-row-inline">
        <el-col v-for="material_list in materiallists" :xs="24" :sm="6" :lg="5" :key="material_list.index" :offset="1" style="margin-top:20px">
          <el-row>
            <el-card :body-style="{ padding: '2px', marginBottom: '1'}" shadow="always">
              <el-image
                :preview-src-list="[material_list.src]"
                :src="material_list.src"/>
              <el-row>
                <el-col :span="24" type="flex" justify="center" align="middle"><span>{{ material_list.name }}</span></el-col>
              </el-row>
              <el-row :gutter="20" type="flex" justify="center" align="middle">
                <el-col :span="8" :push="2">
                  <el-dropdown size="mini">
                    <el-button size="mini" type="primary" plain>鉴定</el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item><el-button type="text" size="mini" class="text_buttom" @click="goToForgery (material_list.name)">Forgery detection</el-button></el-dropdown-item>
                      <el-dropdown-item><el-button type="text" size="mini" class="text_buttom" @click="goToTrace (material_list.name)">Network trace</el-button></el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
                <!-- <el-button size="mini" type="primary" plain @click="goToDetection (material_list.name)">鉴定</el-button> -->
                <el-col :span="8" :pull="0">
                  <el-button size="mini" type="danger" plain @click="fileDelete (material_list.name,material_list.index)">删除</el-button>
                </el-col>
              </el-row>
            </el-card>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import UploadVideo from '@/components/UploadVideo'
import { getFileLists } from '@/api/file'
import { deleteFile, deleteAllImage } from '@/api/file'

export default {
  name: 'ImageLibrary',
  components: {
    UploadVideo,
    getFileLists,
    deleteFile
  },
  data() {
    return {
      upload_text: '将图片拖到此处或',
      upload_link: '点击上传',
      upload_url: '/uploadFile',
      upload_type: '.jpg,.png,.JPG,.PNG,.jpeg,.JPEG',
      accept_types: ['image/png', 'image/jpg', 'image/jpeg'],
      media_type: 'image',
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
      getFileLists('image').then(function(resp) {
        resp.data.image.forEach(function(value, index, array) {
          _this.materiallists.push({
            src: process.env.BASE_API + '/downloadFile/material?fileName=' + value.filename + '&fileType=image',
            name: value.filename,
            index: array.index
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
    fileDelete(filename, index) {
      const { fullPath } = this.$route
      var _this = this
      this.$confirm('此操作将永久删除该图片与检测结果, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var files = {
          fileName: filename,
          fileType: 'image'
        }
        deleteFile('/delete/file', files).then(response => {
          if (response.code === 200) {
            // _this.materiallists.splice(index, 1)
            _this.$message({
              type: 'success',
              message: '删除成功!'
            })
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
    deleteAllImage() {
      const { fullPath } = this.$route
      var _this = this
      this.$confirm('此操作将永久删除所有图片与检测结果, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAllImage().then(response => {
          if (response.code === 200) {
            // _this.materiallists.splice(index, 1)
            _this.$message({
              type: 'success',
              message: '删除成功!'
            })
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
    goToForgery(name) {
      this.$router.push({ name: 'ForgeryDetection', query: { filename: name }})
    },
    goToTrace(name) {
      this.$router.push({ name: 'Trace', query: { filename: name }})
    },
    componentLoadingChangeTrue() {
      this.loading = true
    },
    componentLoadingChangeFalse() {
      setTimeout(() => { this.loading = false }, 500)
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

.el-button--text {
  margin-right: 4;
}

</style>
