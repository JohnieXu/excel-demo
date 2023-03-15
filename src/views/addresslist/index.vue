<template>
  <div class="container">
    <net-error :reload="onRefresh" v-if="netError"></net-error>
    <no-info v-if="!netError && count === 0" tipInfo="暂无地址"></no-info>
    <div v-if="!netError && count !== 0" class="address-list">
      <van-pull-refresh
        v-if="addressList.length"
        v-model="isLoading"
        :head-height="80"
        @refresh="onRefresh"
      >
        <div class="address-list-item">
          <van-address-list
            key="show-address"
            v-model="chosenAddressId"
            :list="addressList"
            default-tag-text="默认"
            @select="choseBack"
            @add="onAdd"
            @edit="onEdit"
          />
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
import NetError from "Components/neterror";
import NoInfo from "Components/noinfo";
import areaList from "Utils/area.js";
import { mapGetters } from "vuex";
import { queryAddress } from "Api";
export default {
  name: "AddressList",
  components: {
    NoInfo,
    NetError
  },
  data() {
    return {
      Loading: false,
      isLoading: false,
      chosenAddressId: "",
      addressList: [],
      count: -1,
      areaList: areaList,
      checkDefault: false, // 勾选默认
      showSetDefault: true,
      checkId: null
    };
  },

  created() {
    const { checkId = null } = this.$route.query;
    this.checkId = checkId;
    this.getAddressList();
  },
  mounted() {},
  computed: {
    ...mapGetters(["theme_img_path", "netError", "openId", "authorization"])
  },
  methods: {
    onRefresh() {
      this.getAddressList();
    },
    onAdd() {
      this.$router.push({
        path: "/createaddress"
      });
    },
    onEdit(item) {
      this.adItem = { ...item, areaCode: item.zipCode };
      this.$router.push({
        path: "mdposlist",
        query: { ...this.adItem, checkId: this.checkId }
      });
      // this.showList = false;
    },
    async getAddressList() {
      const res = await queryAddress({ openid: this.openId });
      this.showList = true;
      this.isLoading = false;
      if (res && res.returnCode === "SUCCESS") {
        const { userAddrBankDTOList = [] } = res.body;
        this.count = userAddrBankDTOList.length;
        if (!userAddrBankDTOList.length) {
          return;
        }
        const addressList = userAddrBankDTOList.map(v => {
          const address = v.province + v.city + v.district + v.addrDetail;
          if (v.defaultFlag === "1") {
            this.chosenAddressId = v.id;
          }
          const dataItem = {
            ...v,
            isDefault: v.defaultFlag === "1",
            tel: v.telephone,
            address,
            areaCode: v.zipCode,
            addressDetail: v.addrDetail
          };
          delete dataItem.openid;
          delete dataItem.appId;
          return dataItem;
        });
        this.addressList = addressList;
        // getContainer: () => document.querySelector(".order-page")
      }
    },
    // 选中后回到提交订单页
    choseBack(item) {
      this.$router.push({
        path: "/suborder",
        query: {
          ...item,
          fromAddress: true
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.van-address-list__bottom {
  bottom: 0;
  background-color: white;
}
.van-address-item {
  border-bottom: 1px solid #eee;
}
.van-toast {
  width: 120px;
}

div.container {
  width: 100%;
  height: 100%;
}
div.address-list {
  width: 100%;
  height: 100%;
  background-color: white;
}
</style>
