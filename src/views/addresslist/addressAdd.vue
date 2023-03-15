<!-- 首页 -->
<template>
  <div class="address-add">
    <div class="contain">
      <div class="address-info" @focusin="inputFocus" @focusout="inputBlur">
        <div class="address-item">
          <div class="text">收货人</div>
          <input
            type="text"
            placeholder="请输入收货人姓名"
            v-model="formData.name"
            @input="nameInput"
            maxlength="10"
          />
        </div>
        <div class="address-item">
          <div class="text">联系电话</div>
          <input
            type="text"
            placeholder="请输入联系电话"
            v-model="formData.telephone"
            maxlength="11"
            @input="
              formData.telephone = formData.telephone.replace(/[^0-9]/g, '')
            "
          />
        </div>
        <!-- <div class="address-item">
          <div class="text">所在省市</div>
          <div class="city">山东省威海市</div>
        </div> -->
        <!-- <div class="address-item">
          <div class="text">城市</div>
          <div class="city">威海</div>
        </div> -->
        <div class="address-item">
          <div class="text">所在地区</div>
          <div class="city" @click="openAddrDialog">
            <span v-if="formData.province && formData.city && formData.district"
              >{{ formData.province }}/{{ formData.city }}/{{
                formData.district
              }}</span
            >
            <span v-else></span>
            <div class="right-icon">
              <van-icon name="arrow" size="0.34rem" />
            </div>
          </div>
        </div>
        <div class="address-item">
          <div class="text">详细地址</div>
          <input
            type="text"
            placeholder="请输入详细地址"
            v-model="formData.addrDetail"
            @input="addrInput"
            maxlength="50"
          />
        </div>
      </div>
      <div class="default-address" v-if="isShowDefaultAddr">
        <p>设置为默认</p>
        <van-switch
          v-model="checked"
          size="24px"
          active-color="#0065BE"
          inactive-color="#dcdee0"
        />
      </div>
      <div
        class="default-address del-word"
        v-if="isShowDefaultAddr"
        @click="deleteAddr"
      >
        <p>删除收货地址</p>
      </div>
      <!-- <div class="address-tips">
        <van-icon name="info-o" size=".4267rem" />
        <div class="word">
          您只能在所申请开卡地区开卡，建议填写收货地址与所选开卡地区保持一致。
        </div>
      </div> -->
      <div class="address-sure" @click="getFormData">保存</div>
      <!-- <div class="address-del" v-if="isShowDefaultAddr" @click="deleteAddr" >删除</div> -->
    </div>
    <van-popup
      v-model="isShowDialog"
      closeable
      position="bottom"
      get-container="body"
      round
      :lock-srcoll="false"
      :style="{ height: '5.68rem', overflow: 'hidden' }"
    >
      <div class="agree-content">
        <p>请确认收货人手机号为</p>
        <p>{{ formData.telephone }}</p>
      </div>
      <div class="agree-btn" @click="submit">确认</div>
    </van-popup>
    <van-popup v-model="isShowAddrDialog" round position="bottom">
      <van-cascader
        v-model="formData.district"
        title="请选择所在区"
        :options="districtArr"
        active-color="#FEA803"
        @close="isShowAddrDialog = false"
        @finish="onFinish"
      />
    </van-popup>
  </div>
</template>
<script>
import { Toast, Dialog } from "vant";
import { getDefaultAddr, deleteUserAddr, saveUserAddr } from "@/apis/order";
import { mapGetters } from "vuex";
import { appId, merNoNo } from "Utils/appconfig.js";
import { getStore as getStoreLocal } from "Utils/localstore";

/**
 * query: {
 *   checkid: string;  // 被选中的地址id, 修改删除要实时更新
 *   id: string; // 要修改的id
 * }
 */

const str2Array = str => {
  return str.split(",");
};

const text2Obj = text => {
  return {
    text,
    value: text
  };
};

const districtArr = [
  // 山东省-济南市 青岛市 淄博市 枣庄市 东营市 烟台市 潍坊市 济宁市 泰安市 威海市 日照市 临沂市 德州市 聊城市 滨州市 菏泽市
  // 济南：历下区 市中区 槐荫区 天桥区 历城区 长清区 章丘区 济阳区 莱芜区 钢城区 平阴县 商河县
  {
    text: "山东省",
    value: "山东省",
    children: [
      {
        text: "济南市",
        value: "济南市",
        children: str2Array(
          "历下区,市中区,槐荫区,天桥区,历城区,长清区,章丘区,济阳区,莱芜区,钢城区,平阴县,商河县,高新区"
        ).map(text2Obj)
      },
      {
        text: "青岛市",
        value: "青岛市",
        children: str2Array(
          "市南区,市北区,黄岛区,崂山区,李沧区,城阳区,即墨区,青岛高新技术产业开发区,胶州市,平度市,莱西市,开发区"
        ).map(text2Obj)
      },
      {
        text: "淄博市",
        value: "淄博市",
        children: str2Array(
          "淄川区,张店区,博山区,临淄区,周村区,桓台县,高青县,沂源县"
        ).map(text2Obj)
      },
      {
        text: "枣庄市",
        value: "枣庄市",
        children: str2Array("市中区,薛城区,峄城区,台儿庄区,山亭区,滕州市").map(
          text2Obj
        )
      },
      {
        text: "东营市",
        value: "东营市",
        children: str2Array(
          "东营区,河口区,垦利区,利津县,广饶县,东营经济技术开发区,东营港经济开发区"
        ).map(text2Obj)
      },
      {
        text: "烟台市",
        value: "烟台市",
        children: str2Array(
          "芝罘区,福山区,牟平区,莱山区,长岛县,烟台高新技术产业开发区,烟台经济技术开发区,龙口市,莱阳市,莱州市,蓬莱市,招远市,栖霞市,海阳市,开发区"
        ).map(text2Obj)
      },
      {
        text: "潍坊市",
        value: "潍坊市",
        children: str2Array(
          "潍城区,寒亭区,坊子区,奎文区,临朐县,昌乐县,潍坊滨海经济技术开发区,青州市,诸城市,寿光市,安丘市,高密市,昌邑市,开发区,高新区"
        ).map(text2Obj)
      },
      {
        text: "济宁市",
        value: "济宁市",
        children: str2Array(
          "任城区,兖州区,微山县,鱼台县,金乡县,嘉祥县,汶上县,泗水县,梁山县,济宁高新技术产业开发区,曲阜市,邹城市,高新区"
        ).map(text2Obj)
      },
      {
        text: "泰安市",
        value: "泰安市",
        children: str2Array("泰山区,岱岳区,宁阳县,东平县,新泰市,肥城市").map(
          text2Obj
        )
      },
      {
        text: "威海市",
        value: "威海市",
        children: str2Array("环翠区,文登区,荣成市,乳山市,经济技术开发区").map(
          text2Obj
        )
      },
      {
        text: "日照市",
        value: "日照市",
        children: str2Array("东港区,岚山区,五莲县,莒县,日照经济技术开发区").map(
          text2Obj
        )
      },
      {
        text: "临沂市",
        value: "临沂市",
        children: str2Array(
          "兰山区,罗庄区,河东区,沂南县,郯城县,沂水县,兰陵县,费县,平邑县,莒南县,蒙阴县,临沭县,临沂高新技术产业开发区"
        ).map(text2Obj)
      },
      {
        text: "德州市",
        value: "德州市",
        children: str2Array(
          "德城区,陵城区,宁津县,庆云县,临邑县,齐河县,平原县,夏津县,武城县,德州运河经济开发区,乐陵市,禹城市"
        ).map(text2Obj)
      },
      {
        text: "聊城市",
        value: "聊城市",
        children: str2Array(
          "东昌府区,茌平区,阳谷县,莘县,东阿县,冠县,高唐县,临清市"
        ).map(text2Obj)
      },
      {
        text: "滨州市",
        value: "滨州市",
        children: str2Array(
          "滨城区,沾化区,惠民县,阳信县,无棣县,博兴县,邹平市"
        ).map(text2Obj)
      },
      {
        text: "菏泽市",
        value: "菏泽市",
        children: str2Array(
          "牡丹区,定陶区,曹县,单县,成武县,巨野县,郓城县,鄄城县,东明县,菏泽经济技术开发区,菏泽高新技术开发区"
        ).map(text2Obj)
      }
    ]
  },
  {
    text: "天津市",
    value: "天津市",
    children: [
      {
        text: "天津市",
        value: "天津市",
        children: str2Array(
          "和平区,河东区,河西区,南开区,河北区,红桥区,东丽区,西青区,津南区,北辰区,武清区,宝坻区,滨海新区,宁河区,静海区,蓟州区"
        ).map(text2Obj)
      }
    ]
  }
];

const Reg = /\\/;
export default {
  data() {
    return {
      Reg,
      checked: false,
      isShowDialog: false,
      isShowAddrDialog: false,
      formData: {
        openid: "",
        merNo: merNoNo,
        id: null,
        name: "",
        district: "",
        addrDetail: "",
        telephone: "",
        province: "",
        city: ""
      },
      districtArr,
      addrInfo: "",
      isShowDefaultAddr: false, // 新增与默认地址进入，不支持此项修改 ,删除同
      telPre: "",
      checkid: "",
      select: false,
      timer: ""
    };
  },
  computed: {
    ...mapGetters(["openId"])
  },
  created() {
    const id = this.$route.query.id;
    // 有id 为修改，无是新增
    if (id) {
      this.formData.id = id;
      this.addrInfo = getStoreLocal(appId + "AddressData");
      const {
        name,
        province,
        city,
        district,
        telephone,
        addrDetail,
        defaultFlag
      } = this.addrInfo;
      this.formData.name = name;
      this.formData.province = province;
      this.formData.city = city;
      this.formData.district = district;
      this.formData.telephone = this.telPre = telephone;
      this.formData.addrDetail = addrDetail;
      if (defaultFlag !== "1") {
        this.isShowDefaultAddr = true;
      }
      // 被选中的地址
      if (this.$route.query.checkid == id) { //eslint-disable-line
        this.select = true;
      }
    }
  },
  methods: {
    nameInput() {
      this.formData.name = this.formData.name
        .replace(/\|/g, "")
        .replace(/\s/g, "");
      if (this.Reg.test(this.formData.name)) {
        Toast("请检查输入中是否含有特殊字符");
      }
    },
    addrInput() {
      this.formData.addrDetail = this.formData.addrDetail
        .replace(/\|/g, "")
        .replace(/\s/g, "");
      if (this.Reg.test(this.formData.addrDetail)) {
        Toast("请检查输入中是否含有特殊字符");
      }
    },
    getFormData() {
      if (!this.formData.name.trim()) {
        Toast({
          message: "请先输入姓名",
          className: "van-toast-fixtop"
        });
        return;
      }
      if (this.Reg.test(this.formData.name)) {
        Toast({
          message: "请检查姓名中是否含有特殊字符",
          className: "van-toast-fixtop"
        });
        return;
      }
      if (this.formData.telephone.length !== 11) {
        Toast({
          message: "请输入正确手机号",
          className: "van-toast-fixtop"
        });
        return;
      }
      if (!this.formData.district) {
        Toast({
          message: "请选择省市地区",
          className: "van-toast-fixtop"
        });
        return;
      }
      if (!this.formData.addrDetail) {
        Toast({
          message: "请填写详细地址",
          className: "van-toast-fixtop"
        });
        return;
      }
      if (this.Reg.test(this.formData.addrDetail)) {
        Toast({
          message: "请检查地址中是否含有特殊字符",
          className: "van-toast-fixtop"
        });
        return;
      }

      if (this.telPre !== this.formData.telephone) {
        this.isShowDialog = true;
      } else {
        this.submit();
      }
    },
    // 保存
    async submit() {
      this.isShowDialog = false;
      this.formData.openid = this.openId;
      const res = await saveUserAddr(this.formData);
      if (res.returnCode === "SUCCESS") {
        Toast("保存成功");
        if (this.formData.id && this.checked) {
          this.getDefaultAddr();
        }
      }
      setTimeout(() => {
        this.$router.back();
      }, 2000);
    },
    onFinish(selected) {
      const province = selected.selectedOptions[0].value;
      const city = selected.selectedOptions[1].value;
      const district = selected.selectedOptions[2].value;

      this.formData.province = province;
      this.formData.city = city;
      this.formData.district = district;
      this.isShowAddrDialog = false;
    },
    openAddrDialog() {
      this.isShowAddrDialog = true;
    },
    // 默认地址更改
    async getDefaultAddr() {
      const res = await getDefaultAddr({
        id: this.formData.id
      });
      Toast("保存成功");
      console.log(res);
    },
    // 地址删除
    deleteAddr() {
      if (this.select) {
        Toast("这是订单当前选中的地址，无法删除");
        return;
      }
      Dialog.confirm({
        confirmButtonColor: "#0065BE",
        title: "温馨提示",
        message: "确定要删除吗"
      })
        .then(() => {
          this.deleteAddr2();
        })
        .catch(() => {
          // return
        });
    },
    async deleteAddr2() {
      const res = await deleteUserAddr({
        id: this.formData.id
      });
      if (res.returnCode === "SUCCESS") {
        Toast("删除成功");
      }
      setTimeout(() => {
        this.$router.back();
      }, 2000);
    },
    // 解决input 失去焦点时，页面不回弹问题(及两个输入框切换导致页面抖动问题)
    inputBlur(e) {
      if (e && e.target && e.target.tagName.toLowerCase() === "input") {
        this.timer = setTimeout(() => {
          document.documentElement.scrollTop = document.body.scrollHeight || 0;
          document.body.scrollTop = document.body.scrollHeight || 0;
        }, 20);
      }
    },
    inputFocus(e) {
      if (e && e.target && e.target.tagName.toLowerCase() === "input") {
        console.log(e.target.tagName.toLowerCase());
        clearTimeout(this.timer);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.address-add {
  height: 100%;
  background: #f4f4f4;
  padding: 0 0 0.32rem;
  // overflow: scroll;
  .contain {
    .address-info {
      background: #ffffff;
      padding-left: 0.4rem;
      //   margin-bottom: .2667rem;
      border-radius: 0.1333rem;
      .address-item {
        position: relative;
        width: 9.0133rem;
        height: 1.4933rem;
        font-size: 0.4rem;
        font-weight: 400;
        color: #333333;
        line-height: 1.4933rem;
        // border-bottom: .0133rem solid rgba(0,0,0,0.1);
        display: flex;
        &::after {
          position: absolute;
          content: "";
          left: 0;
          bottom: 0;
          width: 9.6rem;
          height: 0.0133rem;
          background: rgba(0, 0, 0, 0.1);
        }
        &:last-child {
          border-bottom: none;
        }
        .text {
          width: 2.4rem;
        }
        input {
          width: 6.2133rem;
          height: 1.3833rem;
          line-height: normal;
          border: none;
          background: none;
          display: block;
          // &::placeholder{
          //   line-height: normal;
          // }
        }
        .city {
          width: 6.2133rem;
          display: flex;
          justify-content: space-between;
        }
      }
    }
    .default-address {
      // width: 9.4133rem;
      height: 1.4933rem;
      background: #ffffff;
      margin-bottom: 0.2667rem;
      padding: 0 0.32rem 0 0.4rem;
      font-size: 0.4rem;
      color: #333333;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 0.1333rem;
      &.del-word {
        font-size: 0.4267rem;
        // font-family: Noto Sans SC-Regular, Noto Sans SC;
        font-weight: 400;
        color: #d26c67;
      }
    }
    .address-tips {
      // height: .96rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: #666666;
      line-height: 0.3733rem;
      margin-bottom: 0.4267rem;
      padding-top: 0.3467rem;
      display: flex;
      .word {
        margin-left: 0.1067rem;
      }
    }
    .address-sure {
      width: 9.36rem;
      height: 1.2267rem;
      background: linear-gradient(90deg, #0c7de1 0%, #0065be 100%);
      border-radius: 1.3867rem;
      font-size: 0.4533rem;
      font-weight: 400;
      color: #ffffff;
      line-height: 1.2267rem;
      text-align: center;
      margin: 0.64rem auto 0.4667rem;
    }
    .address-del {
      width: 9.36rem;
      height: 1.2267rem;
      border: 0.0133rem solid #fea803;
      border-radius: 0.1333rem;
      font-size: 0.4533rem;
      font-weight: 400;
      color: #fea803;
      line-height: 1.2267rem;
      text-align: center;
    }
  }
}
/deep/ .van-popup--bottom.van-popup--round {
  padding: 0 0.4267rem 0;
}
/deep/ .van-popup__close-icon--top-right {
  left: 0.32rem;
  top: 0.4267rem;
}
/deep/ .van-toast {
  top: 4rem;
}
.agree-content {
  padding: 0 0.24rem;
  height: 1.2267rem;
  font-size: 0.4rem;
  font-weight: 400;
  color: #000000;
  line-height: 0.5667rem;
  margin: 1.0867rem auto 1.0867rem;
  p {
    text-align: center;
  }
}
.agree-btn {
  width: 9.1467rem;
  height: 1.2267rem;
  background: linear-gradient(90deg, #0c7de1 0%, #0065be 100%);
  border-radius: 1.3867rem;
  font-size: 0.4533rem;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.2267rem;
  text-align: center;
  margin: 0 auto;
  // position: fixed;
  // left: 50%;
  // bottom: .9rem;
  // transform: translateX(-50%);
}
</style>
