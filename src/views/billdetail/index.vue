<template>
  <div class="container">
    <net-error :reload="onRefresh" v-if="netError"></net-error>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
/**
 * 路由参数：
 * query: {
 *  invoiceURL: string; // PDF发票链接
 *  childOrderCode: string; // 传入的子订单编号
 * }
 * 跳出页面：
 * 无
 */
import NetError from "Components/neterror";
import { mapGetters } from "vuex";
import { Toast } from "vant";
import { pushInvoice } from "Api";
import { indexDoc } from "Utils/appconfig.js";

const C_MAP_URL = window.location.origin + "/" + indexDoc + "/cmaps/";

export default {
  name: "ViewBillDetail",
  data() {
    return {
      src: "",
      showMail: false,
      email: "",
      images: [],
      showPreview: false,
      pdfInterval: null
    };
  },
  computed: {
    ...mapGetters(["netError"])
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {}
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
  padding-top: 30px;
  .pdf-box {
    width: 90vw;
    min-height: 160px;
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    .tip {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 35px;
      text-align: center;
      line-height: 35px;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
    }
  }
  /deep/ .van-dialog__content {
    .van-field {
      width: 85%;
      margin: 0.3rem auto;
    }
  }
}
.backorder {
  margin-top: 2rem;
  width: 9.36rem;
  height: 1.23rem;
  background: linear-gradient(90deg, #0c7de1 0%, #0065be 100%);
  border-radius: 1.39rem 1.39rem 1.39rem 1.39rem;
  opacity: 1;
}
.preview-box {
  width: 100%;
}

/deep/.van-button--default {
  border: 1px solid #fffdfd;
}
/deep/.van-dialog__cancel .van-button__text {
  color: gray;
}
</style>
