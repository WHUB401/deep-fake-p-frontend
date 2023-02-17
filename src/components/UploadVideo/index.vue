<template>
  <el-upload
    ref="upload_material"
    :show-file-list="false"
    :http-request="handleUploadFile"
    :accept="upload_type"
    :before-upload="file => beforeUploadHandler(file)"
    class="upload-demo"
    drag
    action="upload_url"
    multiple
    @drop.native="e => beforeUploadHandler(e.dataTransfer.files[0])"
  >
    <i class="el-icon-upload"/>
    <div class="el-upload__text">{{ upload_text }}<em>{{ upload_link }}</em></div>
  </el-upload>
</template>

<script>
import { uploadFile } from '@/api/file'
import { Message } from 'element-ui'

export default {
  name: 'UploadVideo',
  props: {
    upload_text: {
      type: String,
      default: 'noupload'
    },
    upload_link: {
      type: String,
      default: 'noupload'
    },
    upload_url: {
      type: String,
      default: 'noupload'
    },
    upload_type: {
      type: String,
      default: 'noupload'
    },
    accept_types: {
      type: Array,
      default: () => []
    },
    media_type: {
      type: String,
      default: 'noupload'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  methods: {
    beforeUploadHandler(file) {
      var accept = this.accept_types
      if (accept.indexOf(file.type) === -1) {
        this.$message({
          type: 'error',
          message: `只能上传${accept.join('、')}文件`
        })
        return false
      }
      return true
    },
    handleUploadFile(param) {
      debugger
      this.$emit('startUpload')
      var _this = this
      var formData = new FormData()
      formData.append('file', param.file)
      formData.append('fileType', _this.media_type)
      uploadFile(this.upload_url, formData).then(response => {
        if (response.code === 200) {
          this.$emit('getResponse', response.data)
        }
      }).catch(function(response) {
        Message({
          message: response.message,
          type: 'error',
          duration: 5 * 1000
        })
        _this.$emit('handleError')
      })
    }
  }
}
</script>

<style scoped>
.upload-demo {
  width: 100%;
  font-size: x-large;
}
.upload-demo /deep/ .el-upload {
  width: 100%;
}
.upload-demo /deep/ .el-upload-list  {
  width: 55.8%;
}
.upload-demo /deep/ .el-upload-dragger {
  background-color: #ffffff;
  border: 2px dashed rgb(0, 0, 0);
  width: 100%;
  height: 180px;
  padding: 10px;
}
.upload-demo /deep/ .el-upload-dragger:hover {
  border: 1px dashed #000000;
}
.upload-demo /deep/ .el-upload-dragger .el-icon-upload {
  margin-top: 33px;
  font-size: 88px;
}
.upload-demo /deep/ .el-upload-dragger .el-upload__text {
  font-size: 20px;
}
.upload-demo /deep/ .el-upload-list__item-name {
  color: #000000;
  width: 55.1%;
  font-size: 15px;
}

.el-upload-dragger .el-upload__text {
  color: rgb(0, 0, 0);
}

.el-upload-dragger .el-upload__text em {
  color: #657adb;
}

.el-upload:focus .el-upload-dragger {
  border-color: #FFA31A;
}

.upload-demo /deep/ .el-upload-list__item:hover {
  background-color: rgb(67,74,80);
}

.upload-demo /deep/ .el-upload-list__item .el-icon-close {
  color: #FFA31A;
}
</style>
