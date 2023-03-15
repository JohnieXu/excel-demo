<template>
  <div class="container">
    <net-error :reload="onRefresh" v-if="netError"></net-error>
    <div v-else class="address-add">
      <div class="address-add-item">
        <van-address-edit
          :area-list="areaList"
          @save="onSave"
          detail-maxlength="100"
          tel-maxlength="11"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import NetError from "Components/neterror";
import { mapGetters } from "vuex";
import areaList from "Utils/area.js";
import { saveAddress } from "Api";
import { merNo } from "Utils/appconfig";
export default {
  name: "ViewCreateAddress",
  components: {
    NetError
  },
  data() {
    return {
      isLoading: false,
      areaList: areaList
    };
  },
  created() {
    // this.getDataList();
  },
  computed: {
    ...mapGetters(["theme_img_path", "openId", "netError"])
  },
  mounted() {
    this.addLengthLimit();
  },
  methods: {
    onRefresh() {
      this.getDataList();
    },
    addLengthLimit() {
      let array1 = document.getElementsByClassName("van-field__control");
      array1.forEach(element => {
        if (element.placeholder == "收货人姓名") {
          element.maxLength = "10";
        }
        if (element.placeholder == "收货人手机号") {
          element.maxLength = "11";
        }
      });
      let array2 = document.getElementsByClassName("van-field__label");
      array2.forEach(element => {
        const spanEl = element.getElementsByTagName("span");
        if (spanEl.length && spanEl[0].innerText === "电话") {
          spanEl[0].innerText = "手机号";
        }
      });
    },
    onSave(data) {
      const {
        addressDetail,
        city,
        county,
        name,
        province,
        tel,
        areaCode
      } = data;
      if (name.length > 10) {
        Toast.fail("姓名长度不能超过10");
        return;
      }

      if (!/^1[34578]\d{9}$/.test(tel)) {
        Toast.fail("手机号格式不规范");
        return;
      }

      if (addressDetail.length > 100) {
        Toast.fail("详细地址长度不能超过100");
        return;
      }

      const params = {
        name,
        telephone: tel,
        province,
        city,
        district: county,
        addrDetail: addressDetail,
        merNo: merNo,
        zipCode: areaCode, //地址code 用于回显
        openid: this.openId
      };
      this.modifyAddress(params);
    },
    async modifyAddress(params) {
      const res = await saveAddress(params);
      if (res && res.returnCode === "SUCCESS") {
        this.$router.replace("myaddress");
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
div.address-add {
  width: 100%;
  height: 100%;
  background-color: white;
}
</style>
