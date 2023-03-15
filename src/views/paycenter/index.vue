<template>
  <div class="container">
    <net-error :reload="onRefresh" v-if="netError"></net-error>
    <div v-if="!netError" class="pay-center">
      <div class="pay-center-info">
        <div>
          <div style="height:0.4rem"></div>
          <ol>
            <li class="sum">
              订单总价<span class="theme-fontcolor"
                >￥{{ payMoney * 0.01 }}</span
              >
            </li>
            <li>
              <div class="pay-type">
                <img
                  :src="require(`../../assets/${theme_img_path}/pay_type.png`)"
                />
                <span class="theme-fontcolor">选择支付方式</span>
              </div>
            </li>
            <li>
              <img
                :src="require(`../../assets/${theme_img_path}/weixin.png`)"
                alt=""
              />
              <span>微信</span>
              <img
                class="pay_checked"
                :src="require(`../../assets/${theme_img_path}/pay_checked.png`)"
                alt=""
              />
              <!-- <van-checkbox disabled v-model="checked"></van-checkbox> -->
            </li>
            <li class="tips">
              <div class="pay-info">
                <xt-ueditor-preview
                  :content="payRights"
                  class="custom-preview"
                ></xt-ueditor-preview>
              </div>
            </li>
            <li>
              <p @click="pay" class="submit-btn theme-buttoncolor">
                确定支付
              </p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 路由参数：
 * query: {
 *  parentOrderCode: string; // 传入的父订单编号
 *  payMoney: string; // 传入的支付金额
 * }
 * 跳出页面：
 * $router.push('/paysuccess')
 */
import NetError from "Components/neterror";
import { mapGetters } from "vuex";
import { payOrder, getOrderList, findTempletRights } from "Api";
import { Toast } from "vant";
import { appId } from "Utils/appconfig";
import { removeStore } from "Utils/localstore";
export default {
  name: "ViewPaycenter",
  components: {
    NetError
  },
  data() {
    return {
      dataList: [1, 2, 3, 4],
      userPhone: "",
      Loading: false,
      isLoading: false,
      neterror: false,
      checked: true,
      payChannel: "2", // 微信支付
      payMoney: 0, // 微信支付
      orderInfo: null,
      payRights: ""
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  computed: {
    ...mapGetters(["theme_img_path", "netError", "openId", "cardInfo"])
  },
  methods: {
    onRefresh() {
      this.getDataList();
    },
    init() {
      const { payMoney } = this.$route.query;
      this.payMoney = payMoney;
      this.findTempletRights();
    },
    async findTempletRights() {
      let params = {
        templetNo: this.cardInfo.template.templetNo
      };
      let res = await findTempletRights(params);
      if (res && res.returnCode === "SUCCESS") {
        this.payRights = res.body.payRights;
      }
      console.log(res);
    },
    async pay() {
      const { parentOrderCode } = this.$route.query;
      const { payChannel } = this;
      if (!parentOrderCode) {
        Toast.fail("未查询到订单号,无法支付");
        return;
      }
      const res = await payOrder({ parentOrderCode, payChannel });
      if (res && res.returnCode === "SUCCESS") {
        const {
          packageData = "",
          addrDetail = "",
          cardNo = "",
          imgLink = ""
        } = res.body;
        const { result } = JSON.parse(packageData);
        if (!packageData || !result) {
          Toast.fail("获取支付信息失败");
          return;
        }
        this.orderInfo = { addrDetail, cardNo, imgLink };
        console.log(this.orderInfo);
        // this.$router.push({
        //   path: "paysuccess",
        //   query: { ...this.cardInfo }
        // });
        this.checkJsBridge(result);
      }
    },
    async queryOrderList() {
      await getOrderList({ openid: this.openId, page: 0, size: 2 });
    },
    checkJsBridge(result) {
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            () => {
              this.onBridgeReady(result);
            },
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", () =>
            this.onBridgeReady(result)
          );
          document.attachEvent("onWeixinJSBridgeReady", () =>
            this.onBridgeReady(result)
          );
        }
      } else {
        this.onBridgeReady(result);
      }
    },
    onBridgeReady(result) {
      const that = this;
      window.WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        result, // 微信支付参数需要服务器返回
        response => {
          if (response.err_msg == "get_brand_wcpay_request:ok") {
            Toast.success("微信支付成功!"); // 支付成功清空
            removeStore(appId + "_referrer");
            removeStore(appId + "_taskCode");
            console.log(response);
            console.log(that.orderInfo);
            this.$router.push({
              path: "paysuccess",
              query: { ...that.orderInfo }
            });
          } else if (response.err_msg == "get_brand_wcpay_request:cancel") {
            Toast.fail("用户取消支付!");
            this.queryOrderList();
          } else {
            Toast.fali("支付失败!");
          }
        }
      );
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
div.pay-center {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  ol {
    li:first-child {
      // padding-top: 0.8rem;
    }
    li p.red {
      color: red;
    }
    li p {
      font-size: 0.4rem;
    }
    li {
      padding: 0.4rem;
      background-color: white;
      display: flex;
      font-size: 0.4rem;
      align-items: center;
      margin-bottom: 0.4rem;
    }
    li.sum {
      margin-bottom: 0.4rem;
      span {
        flex: 1;
        text-align: right;
      }
    }
    li:nth-child(2) {
      margin-bottom: 0rem;
      padding: 0rem;
      .pay-type {
        display: flex;
        align-items: center;
        margin-left: 0.3rem;
        width: 9.7rem;
        padding: 0.2rem 0 0.2rem 0.1rem;
        border-bottom: 1px solid #eee;
        img {
          width: 0.8rem;
          height: auto;
        }
        span {
          flex: 1;
          text-indent: 0.3rem;
        }
      }
    }
    li:nth-child(3) {
      img {
        width: 0.8rem;
        height: auto;
      }
      span {
        flex: 1;
        text-indent: 0.3rem;
      }
      .pay_checked {
        width: 0.6rem;
        height: auto;
      }
    }
    li:nth-child(4) {
      display: block;
      color: #333;
      font: 0.3rem/0.6rem "microsoft yahei";
      background-color: #f2f2f2;
      p {
        margin-bottom: 0.4rem;
      }
    }
    li:nth-child(5) {
      background-color: #f2f2f2;
    }
  }
}
/deep/.custom-preview {
  font-size: 0.32rem !important;
  color: #a8a8a8 !important;
  line-height: 0.38rem;
  background: transparent !important;
}
</style>
