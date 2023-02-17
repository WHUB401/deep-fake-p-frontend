<template>
  <el-container class="dashboard-editor-container">
    <el-main class="main">
      <el-row>
        <el-button @click="currentMission()">查看当前任务</el-button>
        <el-button @click="preMission()">查看上一个任务</el-button>
      </el-row>
      <el-row v-if="current">
        <el-col v-for="list in redata" :xs="24" :sm="24" :lg="24" :key="list.index" class="code">
          <div>{{ list }}</div>
        </el-col>
      </el-row>
      <el-row v-if="!current && predata">
        <el-col :xs="24" :sm="24" :lg="24" class="code">
          <div class="text-wrapper">{{ predata }}</div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'
export default {
  name: 'Test',
  data() {
    return {
      current: true,
      websock: null,
      redata: ['Please wait.'],
      predata: null
    }
  },
  watch: {
    // redata: function() {
    //   if (this.redata.length > 100) {
    //     this.redata = this.redata.slice(-100)
    //   }
    // }
  },
  created() {
    this.initWebSocket()
  },
  destroyed() {
    this.websock.close() // 离开路由之后断开websocket连接
  },
  methods: {
    initWebSocket() {
      var wsuri = process.env.WS_API + '/AdversarialDetectionLog'
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonerror() { // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage(e) { // 数据接收
      var redata = e.data
      this.redata.push(redata.replace(new RegExp('�', 'g'), '>'))
      scrollTo(document.documentElement.scrollHeight, 100)
    },
    websocketclose(e) { // 关闭
      console.log('断开连接', e)
    },
    readFile(filePath) {
    // 创建一个新的xhr对象
      let xhr = null
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
      } else {
        // eslint-disable-next-line
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
      }
      const okStatus = document.location.protocol === 'file' ? 0 : 200
      xhr.open('GET', filePath, false)
      xhr.overrideMimeType('text/html;charset=utf-8')
      xhr.send(null)
      return xhr.status === okStatus ? xhr.responseText : null
    },
    currentMission() {
      this.current = true
    },
    preMission() {
      this.predata = this.readFile(process.env.BASE_API + '/downloadFile/missionLog?mission=adversarial').replace(/\r/g, '\n')
      this.current = false
    }
  }
}
</script>
<style>
.dashboard-editor-container {
  background-color: #2B2B2B;
  min-height: calc(100vh - 50px);
  padding: 50px 60px 0px;
}
.main {
  height: 100%;
  background-color: #2B2B2B;
  min-height: calc(100vh - 150px);
}
.code {
  font-family: 宋体;
  color: #A9B7C6;
  white-space: pre-wrap;
}
.text-wrapper {
  white-space: pre-wrap;
}

</style>
