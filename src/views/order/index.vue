<template>
  <div class="container">
    <net-error :reload="onRefreshPage" v-if="netError"></net-error>
    <load-modal :show="!netError && showOverlay"></load-modal>
    <no-info v-if="!netError && total === 0" tipInfo="暂无订单"></no-info>
    <div v-if="!netError && total !== 0" class="order-page">
      <van-pull-refresh
        v-model="isLoading"
        :head-height="80"
        @refresh="onRefresh"
      >
        <van-list
          v-model="loading"
          :finished="finished"
          :immediate-check="enterCheck"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <input
            ref="hideInput"
            v-show="false"
            type="text"
            v-model="childOrderCodeChecked"
          />
          <div
            v-for="(item, i) in dataList"
            :key="i"
            class="order-page-list-item"
          >
            <div class="contain-info">
              <div class="step">
                <img
                  :src="require(`../../assets/img2/step_${item.imgPath}.png`)"
                  alt
                />
                <span
                  v-if="item.fail"
                  :class="item.imgPath === '1' ? 'fail1' : 'fail2'"
                  >×</span
                >
              </div>
              <div class="tip">
                {{ item.orderSateDesc }}
                <br />
                <!-- <p
                  class="logis"
                  v-if="item.orderState === 996 || item.orderState === 45"
                >
                  预约银行详细地址：{{ item.addrDetail }}（详询：<a
                    class="tel-link"
                    href="tel:4000273330"
                    >4000273330</a
                  >
                  ）
                </p> -->
                <!-- <p
                  class="logis"
                  v-if="item.serchLogistic && item.logisticUnit !== '0'"
                >
                  {{ item.logisticName }} : {{ item.logisticsOrderId }}
                </p>
                <p
                  class="logis"
                  v-if="item.serchLogistic && item.logisticUnit === '0'"
                >
                  {{ item.logisticName }}
                </p> -->
                <div class="btn-box">
                  <span
                    v-if="item.copyOrderNum"
                    class="copynum"
                    @click="copyOrderNumber(item.logisticsOrderId)"
                    >复制单号</span
                  >
                  <span
                    v-if="item.serchLogistic"
                    class="search"
                    @click="serch(item.childOrderCode)"
                    >查询物流</span
                  >
                  <span
                    v-if="item.continuePay"
                    @click="continuePay(item.parentOrderCode, item.totalAmt)"
                    class="search"
                    >继续付款</span
                  >
                </div>
              </div>
              <ul>
                <li class="pic">
                  卡片图片：
                  <span>
                    <img
                      :class="
                        item.goodsName.indexOf('竖版') > -1
                          ? 'vetical-con'
                          : 'her-con'
                      "
                      @click="
                        prewImg(`${baseUrl}${item.picUrl}`, item.goodsName)
                      "
                      :src="`${baseUrl}${item.picUrl}`"
                      alt
                    />
                  </span>
                </li>
                <li class="title">
                  卡片名称：
                  <span>{{ item.goodsName }}</span>
                </li>
                <li v-if="item.cardNo" class="cradnum">
                  银行卡号:
                  <span>{{ item.cardNo }}</span>
                </li>
                <li class="phone">
                  手机号码：
                  <span>{{ item.userName }}</span>
                </li>
                <li class="create-time">
                  申请时间：
                  <span>{{ item.createTime }}</span>
                </li>
                <li class="address">
                  收货地址：
                  <span
                    >山东省威海市{{ item.district }}{{ item.addrDetail }}</span
                  >
                </li>
                <li class="price">
                  订单金额：
                  <span>￥{{ floatDivide(item.totalAmt || 0, 100) }}</span>
                </li>
                <li class="ordernum">
                  订单编号：
                  <span>{{ item.childOrderCode }}</span>
                </li>
                <!-- <li v-if="item.getBill" @click="goBill(item)" class="bill">
                  <p>
                    <img
                      :src="require(`../../assets/${theme_img_path}/bill.png`)"
                      alt
                    />
                    获取发票
                  </p>
                </li> -->
              </ul>
            </div>
            <div v-if="item.getBill" @click="goBill(item)" class="bill">
              <p>
                <img
                  :src="require(`../../assets/${theme_img_path}/bill.png`)"
                  alt
                />
                获取发票
              </p>
            </div>
            <div class="btn-con" :class="item.getBill ? '' : 'btn-margin'">
              <p @click="connectUs">
                <img
                  :src="require(`../../assets/${theme_img_path}/service.png`)"
                  alt
                />
                联系客服
              </p>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
      <van-action-sheet
        v-model="showCall"
        :actions="actions"
        @select="onSelect"
        close-on-click-action
      />
    </div>
  </div>
</template>
<script>
/**
 * 路由参数：
 * query: 无
 *
 * 跳出页面：
 *  进入开票页面-> $router.push('/bill') query: { childOrderCode, price }
 *  开票成功页面-> this.$router.push("billsuccess");
 *  发票详情页面-> this.$router.push("billdetail"); query: { childOrderCode, invoiceURL  }
 *  进入物流页面-> $router.push('/logistics') query: { childOrderCode  }
 *  继续支付页面-> $router.push('/paycenter') query: { parentOrderCode, payMoney: price  }
 */
import { reactive } from "vue";
import NetError from "Components/neterror";
import NoInfo from "Components/noinfo";
import LoadModal from "Components/loadmodal";
import { getOrderList } from "Api";
import { mapGetters } from "vuex";
import { login } from "Mixin/login.js";
import { orderListSheet, logisticCodeSheet } from "Utils/codesheet.js";
import { ImagePreview } from "vant";
import { floatDivide, copyToClipboard } from "Utils/index";

export default {
  name: "ViewOrder",
  mixins: [login],
  components: {
    NoInfo,
    NetError,
    LoadModal
  },
  data() {
    return {
      dataList: [],
      isLoading: false,
      baseUrl: process.env.VUE_APP_IMG_URL,
      total: -1,
      page: 0,
      size: 20,
      childOrderCodeChecked: "",
      enterCheck: false,
      loading: true,
      finished: false,
      showCall: false,
      actions: [{ name: "4000273330" }]
    };
  },
  setup() {
    const state = reactive({
      dataList: []
    });
    return {
      state
    };
  },
  computed: {
    ...mapGetters([
      "theme_img_path",
      "openId",
      "authorization",
      "netError",
      "showOverlay"
    ])
  },
  watch: {
    dataList() {
      this.dealAdrressAlign(".address > span");
    }
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    copyToClipboard,
    floatDivide,
    onLoad() {
      this.getDataList();
    },
    init() {
      this.total = -1;
      this.page = 0;
      this.dataList = [];
      if (this.openId && this.authorization) {
        this.getDataList();
      } else {
        this.checkPage(this.getDataList);
        // this.getCode("order");
      }
    },
    onRefreshPage() {
      // this.getCode("order"); // 重走主流程
      this.finished = false;
      this.init();
    },
    onRefresh() {
      // this.finished = false; // 触发onload事件加载，导致重复数据
      this.init();
      // this.Loading = true
    },
    prewImg(url, name) {
      const cname = name.indexOf("竖版") > -1 ? "vetical-con" : "her-con";
      ImagePreview({
        images: [url],
        closeable: true,
        className: cname,
        getContainer: () => document.querySelector(".order-page")
      });
    },
    async getDataList(noToken) {
      // fix: CSMBANK-111 getWxOpenId未返回token，表示新用户未办卡直接跳转的订单页，不查询订单列表，直接显示暂无订单
      if (noToken) {
        this.SET_OVERLAY(false);
        this.isLoading = false;
        this.loading = false;
        this.total = 0;
        this.dataList = [];
        return;
      }
      // if (this.finished) {
      //   console.log("111");
      //   return;
      // }
      console.log("222");
      const { page, size } = this;
      const res = await getOrderList({ openid: this.openId, page, size });
      this.SET_OVERLAY(false);
      this.isLoading = false;
      this.loading = false;
      console.log(res);
      if (res && res.returnCode === "SUCCESS") {
        this.page++;
        const { orderList = [], count } = res.body;
        console.log("订单列表-----", res.body);
        this.total = orderList.length;
        if (!orderList.length) {
          this.total = 0;
          return;
        }
        this.total = count;
        const handledList = orderList.map(item => {
          item.cardNum = item.cardList ? item.cardList[0] : "";
          item.childOrderCode = item.childOrderCodeList
            ? item.childOrderCodeList[0]
            : item.childOrderCode;
          item.orderState = item.childOrderState;
          // if (item.logisticUnit) {
          //   if(logisticCodeSheet[item.logisticUnit]){
          //     item.logisticName = logisticCodeSheet[item.logisticUnit].name;
          //   } else {
          //     item.logisticName = ''
          //   }
          // }
          if (item.logisticUnit) {
            item.logisticName = logisticCodeSheet[item.logisticUnit].name;
          }
          const filterData = orderListSheet.filter(k => {
            try {
              return k.condition(item);
            } catch (error) {
              return false;
            }
          });
          if (!filterData.length) {
            return {
              ...item,
              description: "未匹配到订单状态",
              imgPath: "1"
            };
          }
          const data = { ...filterData[0] };
          console.log("{ ...filterData[0] }", data);
          if (typeof data.description === "function") {
            data.description = data.description(item[data.paramsName]);
          }
          return { ...item, ...data };
        });
        this.dataList = [...this.dataList, ...handledList];
        // console.log('handledList',this.handledList)
        console.log("dataList", this.dataList);
        if (this.dataList.length === this.total) {
          this.finished = true;
        }
      } else {
        this.SET_OVERLAY(false);
        this.isLoading = false;
        this.loading = false;
        this.finished = true;
        this.total = -1;
        this.dataList = [];
        if (this.page === 0) {
          // 如果第0页查询数据失败，显示暂无订单，否则是分页查询更多失败，显示原有数据，底下显示没有更多了
          this.total = 0;
        }
      }
    },
    goBill(item) {
      const { childOrderCode, invoiceStatus, invoiceURL } = item;
      const price = item.totalAmt;
      if (invoiceStatus === "0") {
        this.$router.push({
          path: "billsuccess"
        });
        return;
      }
      if (invoiceStatus === "1") {
        this.$router.push({
          path: "billdetail",
          query: { childOrderCode, invoiceURL }
        });
        return;
      }
      this.$router.push({ path: "/bill", query: { childOrderCode, price } });
    },
    serch(childOrderCode) {
      this.$router.push({ path: "/logistics", query: { childOrderCode } });
    },
    connectUs() {
      this.showCall = true;
    },
    onSelect() {
      location.href = "tel:4000273330";
      // if (!item || !item.name) {
      //   return;
      // }
      // if (item.name.indexOf("潍坊") > -1) {
      //   location.href = "tel:053496588";
      // } else {
      //   location.href = "tel:4000196588";
      // }
    },
    copyOrderNumber(data) {
      this.copyToClipboard(data);
      // if (!data) {
      //   Toast.fail("快递单号为空");
      //   return;
      // }
      // console.log("复制单号数据------", data);
      // this.childOrderCodeChecked = data;
      // this.$refs.hideInput.select();
      // try {
      //   document.execCommand("copy");
      //   Toast.success("快递单号成功复制到剪贴板");
      // } catch (err) {
      //   Toast.fail("该浏览器不支持点击复制到剪贴板，请长按快递单号手动复制。");
      // }
    },
    continuePay(parentOrderCode, price) {
      this.$router.push({
        path: "paycenter",
        query: { parentOrderCode, payMoney: price }
      });
    },
    dealAdrressAlign(className) {
      if (!className) {
        return;
      }
      this.$nextTick().then(() => {
        const addressEls = document.querySelectorAll(className);
        addressEls.forEach(item => {
          const height = item.offsetHeight;
          const fontSize = Number(
            getComputedStyle(item).fontSize.replace("px", "")
          );
          // 文字超过一行左对齐（默认右对齐）
          if (height / fontSize > 1.8) {
            item.style.textAlign = "left";
          }
        });
      });
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
.order-page {
  width: 100%;
  height: 100%;
  background-color: #f6f6f6;
  overflow-y: scroll;
  &-list {
    &-item {
      margin-bottom: 0.4rem;
      .contain-info {
        padding: 0.6rem 0.37rem 0.47rem 0.37rem;
        background-color: white;
      }
      .btn-con,
      .bill {
        display: flex;
        font-size: 0.33rem;
        padding: 0.24rem 0.16rem;
        &.btn-margin {
          margin-top: 0.56rem;
        }
        p {
          margin: 0 auto;
          display: flex;
          align-items: center;
          img {
            width: 0.4rem;
            height: auto;
            margin-right: 0.2rem;
          }
        }
      }
      .bill {
        background: #fff;
        height: 1.2933rem;
        background: linear-gradient(#f6f6f6 0.01%, #fff 50%);
        margin-bottom: 0.56rem;
        // box-shadow: 0px -10px 10px 0px rgba(0,0,0,0.05);
      }
      div.step {
        height: auto;
        align-items: center;
        font-family: Microsoft YaHei;
        font-weight: 400;
        margin-bottom: 1rem;
        position: relative;
        img {
          width: 100%;
          height: auto;
        }
        .fail2 {
          font-size: 0.6rem;
          top: -2px;
          position: absolute;
          color: red;
          font-weight: bolder;
          left: 27%;
        }
        .fail1 {
          font-size: 0.6rem;
          top: -2px;
          position: absolute;
          color: red;
          font-weight: bolder;
          left: 5%;
        }
      }
      div.tip {
        padding: 0.4rem 0.31rem 0.7rem 0.31rem;
        margin-bottom: 0.6rem;
        font-size: 0.33rem;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 0.56rem;
        border: 1px solid #eee;
        .btn-box {
          display: flex;
        }
        span {
          width: 1.533rem;
          height: 0.52rem;
          font-size: 0.28rem;
          font-weight: 400;
          color: #0065be;
          box-sizing: border-box;
          &.copynum,
          &.search {
            padding: 0;
            border: 1px solid #0065be;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          &.search {
            color: #ffffff;
            background: #0065be;
          }
        }
        p.logis {
          padding-top: 0.2rem;
          padding-bottom: 0.2rem;
          .tel-link {
            text-decoration: underline;
            color: #1167b9;
          }
        }
        span {
          padding: 0.16rem 0.4rem;
          display: inline-block;
          transform: translateY(10px);
          margin-right: 0.2rem;
          font-size: 0.3rem;
          border-radius: 0.4rem;
        }
      }
      ul {
        padding-top: 0.4rem;
        // padding-bottom: 0.4rem;
        border-top: 1px solid #eee;
        li.pic {
          .vetical-con {
            width: 0.75rem;
            height: auto;
          }
        }
        li {
          display: flex;
          font-size: 0.33rem;
          padding: 0.24rem 0.16rem;
          &.bill {
            height: 1.2933rem;
            box-shadow: 0px -10px 10px 0px rgba(0, 0, 0, 0.05);
            margin-top: 0.6267rem;
          }
          span {
            flex: 1;
            text-align: right;
            img {
              width: 1.2rem;
              height: auto;
            }
          }
          p {
            margin: 0 auto;
            display: flex;
            align-items: center;
            img {
              width: 0.4rem;
              height: auto;
              margin-right: 0.2rem;
            }
          }
        }
        li.address {
          // border-bottom: 1px solid #eee;
          padding-bottom: 0.16rem;
          // margin-bottom: 0.6rem;
          line-height: 0.55rem;
        }
      }
    }
  }
}
</style>
