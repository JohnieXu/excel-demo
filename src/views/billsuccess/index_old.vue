<template>
  <div class="container">
    <net-error :reload="onRefresh" v-if="netError"></net-error>
    <div v-if="!netError" class="bill-success">
      <img src="~Assets/img2/bill_success.png" alt="" />
      <p>
        您的发票正在生成中,会在7个工作日之后以pdf的形式生成给您，请耐心等候
      </p>
      <div @click="backorder" class="backorder submit-btn theme-buttoncolor">
        返回订单列表
      </div>
    </div>
  </div>
</template>
<script>
import NetError from "Components/neterror";

import { mapGetters } from "vuex";
export default {
  components: {
    NetError
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["netError"])
  },
  created() {},
  mounted() {},
  methods: {
    onRefresh() {},
    backorder() {
      this.$router.push("order");
    }
  }
};
</script>
<style scoped lang="less">
.van-toast {
  width: 120px;
}

div.container {
  width: 100%;
  height: 100%;
}

div.bill-success {
  width: 100%;
  height: 100%;
  background-color: #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 3rem;
    height: auto;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  p {
    width: 80%;
    font-size: 0.4rem;
    text-align: center;
    color: #333;
    line-height: 0.6rem;
  }
}
.backorder {
  margin-top: 2rem;
}
</style>
