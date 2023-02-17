<template>
  <div class="con-slider">
    <el-popover
      :title="popover_title"
      :content="popover_content"
      placement="left"
      width="200"
      trigger="hover">
      <span slot="reference" style="color: #FFA31A">{{ popover_msg }}: {{ slide_value }}</span>
    </el-popover>
    <el-slider
      v-model="slide_value"
      :max="slider_max"
      class="demo-slisder"
    />
  </div>
</template>

<script>
export default {
  name: 'Slide',
  props: {
    popover_title: {
      type: String,
      default: ''
    },
    popover_content: {
      type: String,
      default: ''
    },
    popover_msg: {
      type: String,
      default: ''
    },
    slider_max: {
      type: Number,
      default: 5
    },
    value: {
      type: Number,
      default: 5
    }
  },
  computed: {
    slide_value: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.con-slider{
    // position: absolute;
    // top: -80px;
    .demo-slisder{
        display: flex;
        align-items: center;
        // padding-left: 22px;
        // padding-right: 26px;
        // box-sizing: border-box;
        // background: #ffffff;
        // box-shadow: 0px 9px 28px 8px rgba(0,0,0,0.05), 0px 6px 16px 0px rgba(0,0,0,0.08), 0px 3px 6px -4px rgba(0,0,0,0.12);
    }

    /deep/ .el-slider__bar{
        background: #4c6279;
    }
}
</style>
