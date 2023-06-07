<template>
  <el-tooltip :content="value" :disabled="tooltipShow" placement="top-start">
    <span ref="content" @mouseover="isShowTooltip">{{value}}</span>
  </el-tooltip>
</template>

<script>
export default {
  name: 'DescriptionsTooltip',
  props: ['value'],
  data () {
    return {
      tooltipShow: false
    }
  },
  methods: {
    isShowTooltip () {
      const bool = this.$refs.content.offsetWidth < this.$refs.content.parentNode.offsetWidth
      this.tooltipShow = bool
    }
  }
}
</script>

<style scoped>

</style>

