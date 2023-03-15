<template>
  <div class="container">
    <net-error :reload="onRefresh" v-if="netError"></net-error>
    <div v-else class="address-add">
      <van-cell
        :title="cellTitle"
        @click="
          showPicker = true;
          getTree();
        "
        is-link
      />
      <van-cell-group class="address" v-if="addressList && addressList.length">
        <van-cell
          @click="chooseAddress(item)"
          v-for="(item, index) in addressList"
          :key="index"
          :label="item.contactAddress"
        >
          <template #title>
            <span class="custom-title">{{ item.name }}</span>
            <van-tag v-if="checkedId === item.id" type="primary"
              >当前选择</van-tag
            >
          </template>
        </van-cell>
      </van-cell-group>
      <van-empty
        v-if="
          (!addressList || !addressList.length) && !showPicker && !isLoading
        "
        description="当前区域无网点信息"
      />
      <van-popup
        v-model="showPicker"
        position="bottom"
        :style="{ height: '60%' }"
      >
        <van-picker
          show-toolbar
          @cancel="showPicker = false"
          @confirm="changePicker"
          :columns="columns"
        />
      </van-popup>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { Toast } from "vant";
import NetError from "Components/neterror";
import { mapGetters, mapMutations } from 'vuex'
import areaList from "Utils/area.js";
import { queryRegionTree, queryOrganizationAddress } from "Api";
import { merNo } from "Utils/appconfig";import {
  SET_ADDRESS_LIST, SET_ORGANIZATION_ID, SET_CHECKED_ADDRESS, SET_REGION_CODE
} from 'Store/mutation-types.js'
export default {
  name: 'ViewReciveplace',
  components: {
    NetError
  },
  data() {
    return {
      isLoading: false,
      areaList: areaList,
      columns: [],
      cellTitle: '请选择网点区域',
      showPicker: false,
      regionId: '',
      addressList: [],
      regionCode: '',
      checkedId: ''
    };
  },
  created() {
    // this.init();
  },
  computed: {
    ...mapGetters(["theme_img_path", "openId", "netError", "addressData", "organizationId", "checkedAddress", "checkedRegionCode"])
  },
  watch: {
    regionId(){
      this.getAddress()
    }
  },
  mounted() {
    console.log('addressData',this.addressData)
    console.log('organizationId',this.organizationId)
    if(this.addressData && this.addressData.length && this.organizationId && this.checkedAddress && this.checkedRegionCode){
      this.addressList = this.addressData
      this.checkedId = this.organizationId
      this.cellTitle = this.checkedAddress
      this.regionCode = this.checkedRegionCode
    } else {
      this.getTree();
    }
  },
  methods: {
    ...mapMutations([SET_ADDRESS_LIST, SET_ORGANIZATION_ID, SET_CHECKED_ADDRESS, SET_REGION_CODE]),
    onRefresh() {
      // this.init();
      this.getTree();
    },
    init() {
      try {
        AMap.plugin("AMap.Geolocation", () => {
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,
            timeout: 10000
          });
          geolocation.getCurrentPosition((status, result) => {
            if (status === "complete") {
              if (result.addressComponent && result.addressComponent.city) {
                console.log(result)
                // const adcode = result.addressComponent.adcode.substring(0, result.addressComponent.adcode.length - 2) + "00"
                // this.cityItem = {
                //   regionCode: adcode,
                //   regionName: result.addressComponent.city
                // };
                // this.sendRequest();
              } else {
                Toast("获取位置信息失败");
              }
            } else {
              Toast("获取位置信息失败");
            }
          });
        });
      } catch {
        Toast("获取位置信息失败");
      }
    },
    async getTree(){
      this.isLoading = true
      const res = await queryRegionTree({merNo: merNo });
      console.log('queryRegionTree',res)
      this.isLoading = false
      let changeData = (arr) => {
        arr.map(item => {
          item.text = item.regionName;
          item.id = item.regionCode;
          delete item.regionName
          delete item.regionCode
          if (item.child && item.child.length){
            item.children = item.child
            delete item.child
            changeData(item.children)
          }
        })
      }
      if (res && res.returnCode === "SUCCESS" && res.body.regionTreeList) {
        this.columns =  res.body.regionTreeList
        changeData(this.columns)
        this.showPicker = true
      } else {
        this.columns = []
      }
      console.log(this.columns)
      // [{
      //   "regionCode": "110000",
      //   "regionName": "北京市",
      //   "child": [{
      //     "regionCode": "110100",
      //     "regionName": "北京市",
      //     "child": [{
      //       "regionCode": "110101",
      //       "regionName": "东城区"
      //     },{
      //       "regionCode": "110102",
      //       "regionName": "西城区"
      //     },{
      //       "regionCode": "110103",
      //       "regionName": "鼓楼区"
      //     }]
      //   }]
      // }]
    },
    async getAddress(){
      this.isLoading = true
      const params = {
        merNo: merNo,
        regionId: this.regionId
      }
      const res = await queryOrganizationAddress(params);
      this.isLoading = false
      console.log('getAddress',res)
      if (res && res.returnCode === "SUCCESS" && res.body.addrList) {
        this.addressList =  res.body.addrList
      } else {
        this.addressList = []
      }
      this.SET_ADDRESS_LIST(this.addressList)
      console.log(this.columns)
    },
    changePicker(picker, value){
      console.log(picker)
      console.log(value)
      this.regionId = value;
      let index = 0
      const that = this
      let getId = (arr) => {
        let valueIndex = value[index]
        this.regionId = arr[valueIndex].regionId
        this.regionCode = arr[valueIndex].id
        this.SET_REGION_CODE(this.regionCode)
        index++
        if (value.length >= index && arr[valueIndex].children && arr[valueIndex].children.length) {
          getId(arr[valueIndex].children)
        }
      }
      getId(this.columns)
      console.log('regionCode',this.regionCode)
      this.cellTitle = picker.join()
      this.SET_CHECKED_ADDRESS(this.cellTitle)
      this.showPicker = false;
    },
    // 选择支行
    chooseAddress(item){
      console.log('chooseAddress',item)
      let telephone = '';
      if (
        item.contactMobilePhone &&
        item.contactMobilePhone.length > 0
      ) {
        telephone = item.contactMobilePhone;
      } else {
        telephone = '';
      }
      if (
        item.contactTelephone &&
        item.contactTelephone.length > 0
      ) {
        telephone = telephone + ',' + item.contactTelephone;
      } else {
        telephone = telephone + ',';
      }
      this.SET_ORGANIZATION_ID(item.id)
      this.$router.replace({
        path: 'suborder',
        query: {
          fromAddress: true,
          organizationId: item.id,
          name: item.contactName,
          province: item.provinceName,
          city: item.cityName,
          district: item.districtName,
          address: item.contactAddress,
          telephone: telephone,
          regionCode: this.regionCode,
          organizationName: item.name
        }
      })
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
  .custom-title{
    margin-right: 10px;
  }
}
</style>
