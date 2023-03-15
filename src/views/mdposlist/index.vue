<template>
  <div class="container">
    <net-error :reload="onRefresh" v-if="netError"></net-error>
    <div v-if="!netError" class="address-modify">
      <div class="address-modify-item">
        <van-address-edit
          key="edit-address"
          :area-list="areaList"
          show-delete
          :show-set-default="showSetDefault"
          :address-info="addressInfo"
          detail-maxlength="100"
          @save="onSave"
          @delete="deleteAdd"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { Toast, Dialog } from "vant";
import NetError from "Components/neterror";
import { mapGetters } from "vuex";
import areaList from "Utils/area.js";
import { saveAddress, deleteAddress, setDefaultAdd } from "Api";
import { merNo } from "Utils/appconfig";
export default {
  name: "ViewMdposlist",
  components: {
    NetError
  },
  data() {
    return {
      Loading: false,
      isLoading: false,
      areaList: areaList,
      addressInfo: {},
      checkDefault: false,
      showSetDefault: true,
      checkId: null
    };
  },
  created() {
    this.initData();
  },
  computed: {
    ...mapGetters(["theme_img_path", "openId", "netError"])
  },
  mounted() {
    this.addLengthLimit();
  },
  beforeDestroy() {
    Dialog.close();
  },
  methods: {
    onRefresh() {
      this.initData();
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
    initData() {
      const params = this.$route.query;
      const { isDefault, checkId } = params;
      this.showSetDefault = isDefault !== "true"; // 已是默认地址或选中地址的话  不展示切换按钮
      this.checkId = checkId;
      this.addressInfo = {
        ...params,
        areaCode: params.zipCode
      };
    },
    onSave(data) {
      const {
        addressDetail,
        city,
        county,
        isDefault,
        name,
        province,
        tel,
        areaCode,
        id
      } = data;
      const params = {
        id,
        name,
        telephone: tel,
        province,
        city,
        district: county,
        addrDetail: addressDetail,
        merNo: merNo,
        openid: this.openId,
        zipCode: areaCode //地址code 用于回显
      };
      this.checkDefault = isDefault;
      this.modifyAddress(params);
    },
    // 设置default
    async setDefaultAddress(id) {
      const res = await setDefaultAdd({ openid: this.openId, id });
      if (res && res.returnCode === "SUCCESS") {
        this.$router.replace({
          path: "myaddress",
          query: { checkId: this.checkId }
        });
      }
    },

    async deleteAdd() {
      const params = this.$route.query;
      const { checkId, isDefault, id } = params;
      if (isDefault === "true") {
        Toast.fail("这是默认地址，无法删除");
        return;
      }
      if (checkId === id) {
        Toast.fail("这是订单当前选中地址，无法删除");
        return;
      }
      const res = await deleteAddress({ id });
      if (res && res.returnCode === "SUCCESS") {
        Toast.success("删除成功");
        this.$router.replace({
          path: "myaddress",
          query: { checkId: this.checkId }
        });
      }
    },
    // 编辑地址 若之前非default 改为default 才走设置default 方法
    async modifyAddress(params) {
      const { isDefault, id } = this.$route.query;
      const res = await saveAddress(params);
      if (res && res.returnCode === "SUCCESS") {
        if (isDefault !== "true" && this.checkDefault) {
          this.setDefaultAddress(id);
        } else {
          this.$router.replace({
            path: "myaddress",
            query: { checkId: this.checkId }
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
.address-modify {
  background-color: white;
}
</style>
