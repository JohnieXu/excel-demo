<template>
  <div class="container">
    <net-error :reload="onRefresh" v-if="netError"></net-error>
    <div v-if="!netError" class="pay-success">
      <ol>
        <li>
          <img
            :src="require(`../../assets/${theme_img_path}/pay_success.png`)"
            alt=""
          />
        </li>
        <li>您已成功申请银行卡</li>
        <li v-if="orderInfo.cardNo">卡号为：{{ orderInfo.cardNo }}</li>
        <li class="img-con" v-if="orderInfo.imgLink">
          <img
            :class="shape === '0' ? 'horizontal card-img' : 'vetical card-img'"
            :src="`${baseUrl}${orderInfo.imgLink}`"
            alt=""
          />
        </li>
        <li v-if="orderInfo.addrDetail" class="addr">
          收货地址：{{ orderInfo.addrDetail }}
        </li>
        <li>
          <p @click="goOrder" class="submit-btn theme-buttoncolor">
            跳转订单页
          </p>
        </li>
      </ol>
    </div>
  </div>
</template>
<script>
/**
 * 路由参数：
 * query: {
 *  addrDetail: string; // 收货地址
 *  cardNo: string; // 卡号
 *  imgLink: string // 卡面链接
 * }
 * 跳出页面：
 * 无
 */
import NetError from "Components/neterror";
import { mapGetters } from "vuex";
export default {
  name: "ViewPaysuccess",
  components: {
    NetError
  },
  data() {
    return {
      orderInfo: {},
      baseUrl: process.env.VUE_APP_IMG_URL,
      shape: "0"
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  computed: {
    ...mapGetters(["theme_img_path", "netError", "cardInfo"])
  },
  methods: {
    init() {
      this.getShape();
      // this.payMoney = payMoney;
    },
    getShape() {
      if (this.cardInfo) {
        // 从首页图片编辑回到支付成功页面有回传的模板信息，直接从vuex、session取模板信息
        const {
          template: { shape = "0" }
        } = this.cardInfo;
        this.shape = shape;
      } else {
        // 根据支付订单返回的图片尺寸判断版型
        const img = new Image();
        img.src = (this.$route.query || {}).imgLink;
        img.onload = () => {
          const shape = img.width > img.height ? "0" : "1";
          this.shape = shape;
        };
        img.onerror = () => {
          this.shape = "0"; // 加载图片失败默认横版
        };
      }

      this.orderInfo = { ...this.$route.query };
      console.log("orderInfo支付成功订单信息---", this.orderInfo);
    },
    onRefresh() {
      this.getShape();
    },
    goOrder() {
      this.$router.push("order");
    }
  }
};
</script>
<style scoped lang="less">
li.img-con {
  img.horizontal {
    width: 75%;
    height: auto;
  }
  img.vetical {
    width: 4.47rem;
    height: auto;
  }
}
.van-toast {
  width: 120px;
}

div.container {
  width: 100%;
  height: 100%;
}
div.pay-success {
  width: 100%;
  height: 100%;
  background-color: white;
  ol {
    padding-top: 0.5rem;
    padding-bottom: 2.4rem;
    text-align: center;
    li:first-child {
      padding: 0.3rem;
    }
    li:last-child {
      margin-top: 0.8rem;
    }
    li.addr {
      padding-top: 0.6rem;
      padding-left: 0.8rem;
      padding-right: 0.8rem;
      line-height: 1.4;
      text-align: left;
      text-indent: 0.4rem;
      word-break: break-all;
    }
    li {
      text-align: center;
      padding: 0.2rem;
      font-size: 0.4rem;
      img {
        width: 2.22rem;
        height: auto;
      }
      img.card-img {
        height: auto;
        margin-top: 0.7rem;
        margin-bottom: 0.7rem;
      }

      span {
        flex: 1;
        text-align: right;
      }
    }
    li:last-child {
      padding-top: 0.4rem;
      padding-bottom: 0.6rem;
      background-color: white;
      width: 100%;
      position: fixed;
      bottom: 0;
    }
  }
}
</style>
