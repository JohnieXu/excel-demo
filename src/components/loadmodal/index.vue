<template>
  <van-overlay :show="show">
    <div class="middle">
      <div class="flex-con">
        <div class="one"></div>
        <div class="two"></div>
        <div class="three"></div>
      </div>
    </div>
    <p>正在请求数据</p>
  </van-overlay>
</template>
<script>
export default {
  name: "LodalModal",
  data() {
    return {};
  },
  props: {
    show: Boolean
  },
  methods: {}
};
</script>
<style scoped lang="less">
div.middle {
  display: flex;
  padding-top: 55%;
}
.van-overlay {
  background-color: white;
  z-index: 9999;
  p {
    padding-top: 30px;
    text-align: center;
  }
}
.flex-con {
  margin: 0 auto;
  display: flex;
}
.wh() {
  background-color: #2a90fe;
  width: 6px;
  height: 34px;
  margin-left: 6px;
}

.one {
  animation: animate 0.8s infinite;
  .wh();
}
.two {
  animation: animate 0.8s infinite;
  animation-delay: 0.2s;
  .wh();
}
.three {
  animation: animate 0.8s infinite;
  animation-delay: 0.4s;
  .wh();
}
@keyframes animate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
