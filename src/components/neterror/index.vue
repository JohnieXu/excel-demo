<template>
  <div :class="className ? `net-error ${className}` : 'net-error'">
    <div>
      <img :src="imgUrl" alt />
      <p>您的网络有问题，请稍后重新加载</p>
      <span class="theme-buttoncolor" @click="reLoad">重新加载</span>
    </div>
  </div>
</template>
<script>
import { SET_NET_ERROR } from "Store/mutation-types.js";
import { mapMutations } from "vuex";
export default {
  name: "NetError",
  data() {
    return {
      imgUrl: require("../../assets/img2/net_error.png")
    };
  },
  props: {
    userPhone: String,
    className: String,
    reload: Function
  },
  methods: {
    ...mapMutations([SET_NET_ERROR]),
    reLoad() {
      this.SET_NET_ERROR(false);
      this.reload();
    }
  }
};
</script>
<style scoped lang="less">
.net-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 3rem;
    img {
      width: 4rem;
      height: auto;
      margin-bottom: 1.32rem;
    }
    span {
      display: block;
      font-size: 0.34rem;
      width: 2.59rem;
      text-align: center;
      border-radius: 0.39rem;
      padding-top: 0.22rem;
      padding-bottom: 0.22rem;
      margin-top: 1.2rem;
      color: white;
      font-family: Source Han Sans CN;
      font-weight: 400;
    }
  }
}
</style>
