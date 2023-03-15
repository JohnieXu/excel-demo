<template>
  <div class="container">
    <net-error :reload="onRefresh" v-if="netError"></net-error>
    <no-info v-if="total === 0" tipInfo="暂无物流信息"></no-info>
    <div v-if="total !== 0" class="logistics">
      <van-pull-refresh
        v-model="isLoading"
        :head-height="80"
        @refresh="onRefresh"
      >
        <div class="logistics-list">
          <p class="logistics-list-info">
            <img
              :src="require(`../../assets/${theme_img_path}/ordericon.png`)"
              alt=""
            />
            {{ logisticsName }} {{ logisticsOrderId }}
          </p>
          <van-steps active-color="#2A90FE" direction="vertical" :active="0">
            <van-step :key="i" v-for="(item, i) in stepList">
              <p class="now" v-html="item.operationDescribe"></p>
              <p class="time">{{ item.operationTime }}</p>
            </van-step>
          </van-steps>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
import NetError from "Components/neterror";
import NoInfo from "Components/noinfo";
import { mapGetters } from "vuex";
import { getPostInfo } from "Api";
import { logisticCodeSheet } from "Utils/codesheet";
import { matchPhoneNum } from "Utils";
export default {
  name: "ViewLogistics",
  components: {
    NoInfo,
    NetError
  },
  data() {
    return {
      isLoading: false,
      total: -1,
      active: 0,
      logisticsOrderId: "",
      logisticsName: "",
      stepList: [
        {
          operationTime: "2020-12-22",
          operationDescribe: "武汉【15171277941】快递从威海触发，发往北京"
        },
        { operationTime: "2020", operationDescribe: "武汉【15171277941】" }
      ]
    };
  },
  created() {
    // this.getInfo();
  },
  mounted() {},
  computed: {
    ...mapGetters(["theme_img_path", "netError"])
  },
  methods: {
    onRefresh() {
      this.getInfo();
    },
    async getInfo() {
      const { childOrderCode = "" } = this.$route.query;
      const res = await getPostInfo({ orderCode: childOrderCode });
      this.isLoading = false;
      if (res && res.returnCode === "SUCCESS") {
        const { logisticsUnit, steps = [], logisticsOrderId = "" } = res.body;
        this.total = steps.length;
        if (!steps.length) {
          return;
        }
        this.logisticsName = logisticCodeSheet[logisticsUnit].name;
        this.logisticsOrderId = logisticsOrderId;
        if (steps && steps.length) {
          this.stepList = steps.map(v => {
            v.operationDescribe = matchPhoneNum(v.operationDescribe);
            return v;
          });
        }
      }
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
.logistics {
  width: 100%;
  height: 100%;
  background-color: white;
  &-list {
    padding: 0.6rem 0.4rem;
    &-info {
      font-size: 0.4rem;
      padding-bottom: 1.2rem;
      img {
        width: 0.4rem;
        height: auto;
        margin-right: 0.2rem;
        vertical-align: middle;
      }
    }
  }
}
</style>
