<template>
  <div class="container">
    <net-error :reload="onRefresh" v-if="netError"></net-error>
    <div v-if="!netError" class="bill-success">
      <img src="~Assets/img2/bill_success.png" alt />
      <p>
        您的发票正在生成中，会在24小时以内以pdf的形式发送到收票人邮箱，请注意查收！
      </p>
      <div @click="backorder" class="backorder submit-btn theme-buttoncolor">
        返回订单列表
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 路由参数：无
 * 跳出页面：
 * $router.push('/order')
 */
import NetError from "Components/neterror";

import { mapGetters } from "vuex";
export default {
  name: "ViewBillSuccess",
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
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 1.71rem;
    height: auto;
    padding-top: 2.08rem;
    padding-bottom: 0.32rem;
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
  width: 4.8rem;
  height: 1.07rem;
  background: linear-gradient(90deg, #0c7de1 0%, #0065be 100%);
  border-radius: 0.85rem 0.85rem 0.85rem 0.85rem;
}
</style>
