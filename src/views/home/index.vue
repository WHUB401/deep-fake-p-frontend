<template>
  <el-main class="main">
    <el-row type="flex" justify="center" align="middle" class="row-main" >
      <el-col :span="20">
        <el-row>
          <el-col :span="24"><h3 class="title">武汉大学智能多媒体安全实验室</h3></el-col>
          <el-col :span="24"><h3 class="title">社交网络图像溯源与取证</h3></el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :lg="6" :offset="1" type="flex" justify="center" align="middle" style="margin-top:20px">
            <el-row>
              <h3 class="second-title">Deepfake检测</h3>
            </el-row>
            <router-link :to="{ path: '/deepfake' }">
              <el-image :preview-src-list="srcList" :src="require('@/assets/home_image/deepfake.jpg')"/>
            </router-link>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6" :offset="1" type="flex" justify="center" align="middle" style="margin-top:20px">
            <el-row>
              <h3 class="second-title">对抗检测</h3>
            </el-row>
            <router-link :to="{ path: '/adversarial' }">
              <el-image :preview-src-list="srcList" :src="require('@/assets/home_image/adversarial.jpg')"/>
            </router-link>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6" :offset="1" type="flex" justify="center" align="middle" style="margin-top:20px">
            <el-row>
              <h3 class="second-title">通用篡改检测</h3>
            </el-row>
            <router-link :to="{ path: '/forgery' }">
              <el-image :preview-src-list="srcList" :src="require('@/assets/home_image/forgery.png')"/>
            </router-link>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6" :offset="1" type="flex" justify="center" align="middle" style="margin-top:20px">
            <el-row>
              <h3 class="second-title">社交网络溯源</h3>
            </el-row>
            <router-link :to="{ path: '/trace' }">
              <el-image :preview-src-list="srcList" :src="require('@/assets/home_image/trace.png')"/>
            </router-link>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      url_2: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
    }
  },
  watch: {},
  methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#ffffff;
$dark_gray:#00a6ff;
$light_gray:#eee;

.title {
  font-family: 宋体;
  font-size: 50px;
  font-weight: 400;
  color: #243B2B;
  margin: 0px auto 40px auto;
  text-align: center;
  font-weight: bold;
}

.second-title {
  font-family: 宋体;
  font-size: 20px;
  color: #000000;
  text-align: center;
  font-weight: bold;
}

.main {
  height: 100%;
  background-color: #e9e6e6;
}

.row-main {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}

</style>
