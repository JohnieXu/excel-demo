<template>
  <div class="container">
    <net-error :reload="onRefresh" v-if="neterror"></net-error>
    <no-info v-if="false" tipInfo="暂无订单"></no-info>
    <div class="order-page">
      <van-loading v-if="Loading" color="#f85f60" vertical
        >加载中...</van-loading
      >
      <div class="order-page-list">
        <van-pull-refresh
          v-if="dataList.length"
          v-model="isLoading"
          :head-height="80"
          @refresh="onRefresh"
        >
          <div
            v-for="(item, i) in dataList"
            :key="i"
            class="order-page-list-item"
          >
            <ol>
              <li>
                <img
                  :src="require(`../../assets/${theme_img_path}/ordericon.png`)"
                  alt
                />
              </li>
              <li class="orderinfo">订单信息</li>
              <li class="theme-fontcolor status">审核成功</li>
            </ol>
            <div class="tip">
              尊敬的用户您好，您申请的银行卡已签收，您可持有效身份
              证件前往任一营业网点激活。
            </div>
            <ul>
              <li class="title">天使宝贝卡</li>
              <li class="card-info">
                <img src="~Assets/img2/bill.png" alt />
                <p class="theme-fontcolor">$100.00</p>
                <span>x1</span>
              </li>
              <li class="sum">共一件商品，合计100元</li>
              <li class="num">订单编号：A001201912060001002</li>
              <li class="create-time">创建时间：2019-12-06 14:26:30</li>
              <li class="btn-con">
                <img
                  :src="require(`../../assets/${theme_img_path}/service.png`)"
                  alt
                />
                <i class="empty"></i>
                <span @click="gopay" class="theme-buttoncolor">去支付</span>
                <span class="theme-buttoncolor">获取发票</span>
              </li>
            </ul>
          </div>
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>
<script>
// 河北工行备用
import NetError from "Components/neterror";
import NoInfo from "Components/noinfo";
import { mapGetters } from "vuex";
export default {
  name: "ViewOrderHebei",
  components: {
    NoInfo,
    NetError
  },
  data() {
    return {
      dataList: [1, 2, 3, 4],
      userPhone: "",
      Loading: false,
      isLoading: false,
      neterror: false
    };
  },
  computed: {
    ...mapGetters(["theme_img_path"])
  },
  created() {
    // this.getDataList();
  },
  mounted() {},
  methods: {
    onRefresh() {
      this.getDataList();
    },
    gopay() {
      this.$router.push("paycenter");
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
div.order-page {
  width: 100%;
  background-color: #eee;
  &-list {
    &-item {
      padding: 0 0.37rem 0.25rem 0.37rem;
      background-color: white;
      margin-bottom: 10px;
      ol {
        display: flex;
        height: 1.2rem;
        align-items: center;
        font-family: Microsoft YaHei;
        font-weight: 400;
        border-bottom: 1px solid rgba(220, 220, 220, 1);
        li img {
          width: 0.33rem;
          height: auto;
        }
        li.orderinfo {
          flex: 1;
          font-size: 0.41rem;
          text-indent: 0.2rem;
        }
        li.status {
          font-size: 0.33rem;
        }
      }
      div.tip {
        padding: 0.2rem 0.31rem;
        font-size: 0.33rem;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 0.44rem;
      }
      ul {
        padding-top: 0.4rem;
        li.title {
          text-align: center;
          font-size: 0.41rem;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 0.44rem;
        }
        li.card-info {
          display: flex;
          img {
            width: 2.94rem;
            height: 1.84rem;
          }
          p {
            transform: translateY(0.3rem);
            flex: 1;
            padding-left: 0.58rem;
            box-sizing: border-box;
            font-size: 0.46rem;
            font-family: Microsoft YaHei;
          }
          span {
            transform: translateY(0.3rem);
            color: #666;
            font-size: 0.33rem;
            line-height: 0.46rem;
          }
        }
        li.sum {
          text-align: right;
          font-size: 0.33rem;
          padding-top: 0.2rem;
          padding-bottom: 0.4rem;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          border-bottom: 1px solid rgba(220, 220, 220, 1);
        }
        li.num,
        li.create-time {
          padding-top: 0.22rem;
          font-size: 0.33rem;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }
        li.num {
          padding-top: 0.4rem;
        }
        li.create-time {
          border-bottom: 1px solid rgba(220, 220, 220, 1);
          padding-bottom: 0.4rem;
        }
        li.btn-con {
          display: flex;
          align-items: center;
          padding: 0.4rem 0 0.2rem 0;
          img {
            width: 0.56rem;
            height: auto;
          }
          i.empty {
            flex: 1;
          }
          span {
            width: 2.04rem;
            padding: 0.2rem 0;
            text-align: center;
            font-size: 0.32rem;
            border-radius: 0.37rem;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
