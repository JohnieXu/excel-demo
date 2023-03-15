<template>
  <div class="container">
    <net-error :reload="onRefresh" v-if="netError"></net-error>
    <no-info v-else-if="!cardInfo"></no-info>
    <div v-else class="order-sub">
      <div class="order-sub-info">
        <ol>
          <li>
            <img
              :class="
                cardInfo.template.shape === '0' ? 'horizontal' : 'vetical'
              "
              :src="`${imgBaseUrl}${cardInfo.preImage}`"
              alt
            />
          </li>
          <li class="card-name">卡片名称： {{ cardInfo.template.name }}</li>
        </ol>
        <ul>
          <li @click="choseAddress" class="address van-hairline--bottom">
            <img src="~Assets/img2/address.png" alt />
            <p class="add singleline">{{ addressInfo }}</p>
            <img class="arrow" src="~Assets/img2/down.png" alt />
          </li>
          <!-- <li class="cardno" ref="cardno">
            <van-checkbox
              v-model="isCardNo"
              shape="square"
              @change="handleIsCardNoChange"
              >定制卡尾号（可选）</van-checkbox
            >
          </li> -->
          <xt-cardno-choose
            v-if="isCardNo"
            v-model="cardNo"
            :getCustom="handleGetCustom"
            :getBeauty="handleGetBeauty"
            :placeholder="{
              custom: '请输入2-6位尾号数字进行查询',
              beauty: ''
            }"
            :scrollTopContainer="$refs.cardno"
            custom-desc="*请选择卡号，如没有合适的卡号，请在搜索框输入2~6位尾号数字重新查询。"
            style="padding: 0 0.313rem;"
          ></xt-cardno-choose>
          <li class="note">
            领卡说明：本页面卡片图片所展示的银行卡号为位置示例，实际卡号由系统自动为您分配，以您收到的卡片为准。
          </li>
          <li class="agreeinfo">
            <van-checkbox
              v-model="checked"
              shape="square"
              style="background: #fff;align-items: flex-start;"
              label-disabled
            >
              <span @click="checked = !checked">我已阅读并同意遵守</span>
              <span @click="e => showAgree(e)" class="showagree theme-fontcolor"
                >《私人订制卡面上传图片须知、上传图片保证及陈述》</span
              >
            </van-checkbox>
          </li>
          <li>
            <div class="totolfee">
              共1张，合计: <span class="f1">￥</span
              ><span>{{ getTotalFee }}</span>
            </div>
            <div class="submit" @click="checkParams">提交订单</div>
            <!-- <van-submit-bar
              button-text="提交订单"
              tip-icon="info-o"
              label="共1张:"
              @submit="checkParams"
            /> -->
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 路由参数：
 * query: {
 * authorization = "",
 * openid = "",
 * outParams：json // 图片编辑回传的参数
 * fromAddress: boolean //判断是从 图片编辑页面进来 还是 选择地址后进来
 * }
 * 跳出页面：
 *  普通会员跳转->支付页面：$router.push('/paycenter')
 *  钻石会员跳转->成功页面：$router.push('/paysuccess')
 *  在途订单跳转->订单列表页面：$router.push('/order')
 *  跳转地址页面->this.$router.push("addressList") // 根据有无默认地址跳转->带新增或者地址列表页面
 */
import { getStore as getStoreLocal } from "Utils/localstore";
// ...省略其他代码
import NetError from "Components/neterror";
import NoInfo from "Components/noinfo";
import {
  SET_CARDINFO,
  SET_OPEN_ID,
  SET_AUTHORIZATION
} from "Store/mutation-types.js";
import { mapGetters, mapMutations } from "vuex";
import {
  createDiyGood,
  createOrder,
  getOrderList,
  checkCustomizedNo,
  queryBeautyNo
} from "Api";
import { queryUserAddrList } from "@/apis/order";
import { merNo, appId } from "Utils/appconfig";
import { Toast, Dialog } from "vant";
import { floatDivide } from "Utils/index";
export default {
  name: "ViewSuborder",
  components: {
    NetError,
    NoInfo
  },
  data() {
    return {
      isCardNo: false,
      cardNo: "",
      goodsType: "1",
      goodInfo: {}, // 商品信息 code name price imglink
      addressInfo: "请选择领卡网点", // 地址展示文字
      addressData: {}, // 地址对象
      hasAddress: false,
      checked: false,
      imgBaseUrl: process.env.VUE_APP_IMG_URL,
      cardInfo: "",
      solvedOrderCode: [30, 12, 15, 18, 21, 999, 42, 45, 996, 100, 101, 102] // 可创建订单的条件
    };
  },
  computed: {
    ...mapGetters([
      "openId",
      "authorization",
      "netError",
      // "cardInfo",
      "whiteListUserFree"
    ]),
    getTotalFee() {
      const totalFee =
        this.whiteListUserFree == 1
          ? "0.00"
          : floatDivide(this.cardInfo.template.templetPrice, 100);
      return totalFee;
    }
  },
  created() {
    this.checkFrom().then(() => {
      // this.getAddressList();
    });
  },
  mounted() {},
  beforeDestroy() {
    Dialog.close();
  },
  methods: {
    ...mapMutations([SET_CARDINFO, SET_OPEN_ID, SET_AUTHORIZATION]),
    floatDivide,
    onRefresh() {
      this.checkFrom();
    },
    // 判断是从 图片编辑页面进来 还是 选择地址后进来
    checkFrom() {
      return new Promise(resolve => {
        const {
          authorization = "",
          openid = "",
          outParams = "",
          fromAddress = false
        } = this.$route.query;
        if (authorization && openid) {
          // 图片处理完成跳回本页面 拿取认证信息 重新写入store
          this[SET_OPEN_ID](openid);
          this[SET_AUTHORIZATION](authorization);
        }
        console.log("outParams");
        if (outParams) {
          // 保存模板信息到vuex
          const paramObj = JSON.parse(decodeURIComponent(outParams));
          this.cardInfo = paramObj;
          this[SET_CARDINFO]({ ...paramObj });
        }

        // 从选择地址页跳回不请求addresslist;
        console.log("fromAddress", fromAddress);
        if (fromAddress) {
          this.hasAddress = true;
          this.addressData = { ...this.$route.query };
          console.log("选择地址页跳回", this.addressData);
          // this.addressInfo = this.$route.query.address;
          // this.addressInfo = this.$route.query.organizationName;
          // this.organizationName = this.$route.query.organizationName;
        }
        // 从地址列表页面跳转->取存储地址, makeorder页面取默认地址
        if (this.$route.query.orginPage == "addrPage") {
          const addr = getStoreLocal(appId + "AddressData");
          console.log(addr);
          this.cardInfo = getStoreLocal(appId + "cardInfo");
          this.addressInfo =
            addr.province + addr.city + addr.district + addr.addrDetail;
          this.addressData = { ...addr, address: addr.addrDetail };
          this.hasAddress = true;
          if (!this.cardInfo) {
            this.getAddressList();
          }
        } else {
          this.getAddressList();
        }
        resolve();
      });
    },
    // 检查参数
    checkParams() {
      if (!this.checked) {
        Toast.fail("请勾选协议");
        return;
      }
      const {
        telephone,
        name,
        province,
        city,
        district,
        address
      } = this.addressData;
      if (!telephone || !name || !province || !city || !district || !address) {
        Toast.fail("请完善地址信息");
        return;
      }
      const isCardNo = this.isCardNo;
      const cardNo = isCardNo ? this.cardNo : null;
      if (isCardNo && !cardNo) {
        Toast(
          "您已选择定制卡尾号功能，请选择卡号后再提交订单，若您不需要定制卡号，请取消定制卡尾号功能后再提交"
        );
        return;
      }
      this.checkOrder();
    },
    // 检查是否有未完成订单
    async checkOrder() {
      const res = await getOrderList({ openid: this.openId });
      if (res && res.returnCode === "SUCCESS") {
        const { orderList = [] } = res.body;
        if (
          !orderList.length ||
          this.solvedOrderCode.includes(orderList[0].childOrderState)
        ) {
          const isCardNo = this.isCardNo;
          const cardNo = this.cardNo;
          const message = isCardNo
            ? `您的银行卡号为${cardNo}，一旦您提交订单，卡面及卡号将无法再修改！`
            : "系统将自动为您分配卡号，一旦您提交订单，卡面及卡号将无法再修改！";
          Dialog.confirm({
            title: "温馨提示",
            message,
            confirmButtonColor: "#0066BF"
          })
            .then(() => {
              this.createGoods();
            })
            .catch(() => {});
        } else {
          Dialog.confirm({
            message:
              "您尚有一笔订单未处理完成，无法创建新的订单！是否去订单页?",
            confirmButtonColor: "#0066BF"
          })
            .then(() => {
              this.$router.replace("/order");
            })
            .catch(() => {});
        }
      }
    },

    // 创建商品
    async createGoods() {
      const {
        template: { templetNo = "" },
        preImage,
        originalImage
      } = this.cardInfo || {};
      const params = {
        merNo: merNo,
        templetNo,
        userImage: originalImage,
        userPreviewImage: preImage
      };
      const res = await createDiyGood(params);
      if (res && res.returnCode === "SUCCESS") {
        this.goodInfo = { ...res.body };
        this.subOrder();
      }
    },
    // 提交订单
    async subOrder() {
      const { goodsCode } = this.goodInfo;
      // const { goodsType } = this;
      // const referrer = getStore(appId + "_referrer");
      // const taskCode = getStore(appId + "_taskCode");
      const {
        telephone,
        name,
        province,
        city,
        district,
        address
      } = this.addressData;
      if (!getStoreLocal(appId + "applyDetail")) {
        Toast.fail("缺少申请表信息，请退出页面重新进入");
        return;
      }
      const cardNo = this.isCardNo ? this.cardNo : null;
      const ua = navigator.userAgent;
      const params = {
        goodsCode,
        goodsAmount: "1",
        telephone,
        name,
        province,
        city,
        district,
        address,
        postCode: "000000",
        applyDetail: getStoreLocal(appId + "applyDetail"),
        cardNo,
        ua: ua
      };
      // "Y5G2Ob0E1bTRG48Eyds4qTzb%2BSA9ED8ciKAD0azJPmfV83SrgZyAkkCJq9nf7ayHjkhJB5r0RkizhSNywXYQewi5zQ3OSB904ENybXmdpDm%2FzBpxBodxAipcgSf09hvJ3rLMOtIybK9WQ6RzmKFL0hHdTQD6MG11qR3ZbGrXPdxNqb9RPtOoPBOe8yLe2L5%2FMynpmt%2F3u2uQ868uWTH8lbDw82LEnPWaCoSh66OQ%2FFD7JEGqM8Q%2B5o8aioMD0yb8cG0A5ZEA3R6rcjeX5JWMbl58ooFr%2FzrzaBkOQB1Y75XwutsXoKuILqCme7pM79goHo0WIyIw6sBj5ER4GPNesw%3D%3D"
      // 合伙人扫码进入穿入这两个参数
      // referrer && (params.referrer = referrer);
      // taskCode && (params.taskCode = taskCode);

      const res = await createOrder(params);
      // 提交订单接口在检测重复订单时，跳转详情页面
      if (res.returnCode == 'JUMP_TO_ORDER_LIST') { //eslint-disable-line
        setTimeout(() => {
          this.$router.push("/order");
        }, 3000);
      }

      if (res && res.returnCode === "SUCCESS") {
        console.log("createOrder返回参数------", res.body);
        console.log(JSON.stringify(res.body));
        const {
          imgLink,
          parentOrderCode,
          cardNo,
          addrDetail,
          childOrderCode
        } = res.body;
        // whiteListUserFree为1时是vip客户，无需支付
        if (this.whiteListUserFree == 1) {
          this.$router.push({
            path: "paysuccess",
            query: {
              imgLink,
              parentOrderCode,
              cardNo,
              addrDetail,
              childOrderCode
            }
          });
        } else {
          this.$router.push({
            path: "paycenter",
            query: {
              imgLink,
              parentOrderCode,
              cardNo,
              addrDetail,
              childOrderCode,
              payMoney: this.goodInfo.goodsPrice
            }
          });
        }
      }
    },
    // 查找有无默认地址
    async getAddressList() {
      const res = await queryUserAddrList({ openid: this.openId });
      if (res && res.returnCode === "SUCCESS") {
        const { userAddrBankList = [] } = res.body;
        this.hasAddress = userAddrBankList.length;
        const filterData = userAddrBankList.filter(v => v.defaultFlag === "1");
        if (filterData.length) {
          const data = filterData[0];
          this.addressInfo =
            data.province + data.city + data.district + data.addrDetail;
          this.addressData = { ...data, address: data.addrDetail };
        } else {
          this.addressInfo = "请选择收货地址";
        }
      }
    },
    // 点击地址栏
    choseAddress() {
      if (this.hasAddress) {
        this.$router.push({
          path: "addressList",
          query: { checkId: this.addressData.id }
        });
      } else {
        this.$router.push("addressAdd");
      }
    },
    showAgree(e) {
      if (e.target.className !== "showagree theme-fontcolor") {
        return;
      }
      Dialog.alert({
        messageAlign: "left",
        title: "私人定制卡面上传图片须知、上传图片保证及陈述",
        className: "ruledes",
        "overlay-style": { color: "#0c7de1" },
        confirmButtonColor: "#0c7de1",
        message: `
    <div class="ruleDetail">
        <p class="mtitle">一、私人定制卡面上传图片须知</p>
        <p style="font-weight:bold">（一）客户知悉且同意图片上传、编辑、卡片费用结算及卡面审核在武汉天喻信息产业股份有限公司（以下简称天喻信息）页面进行，由天喻信息负责。</p>
        <p>（二）客户通过定制卡系统服务平台上传图片须遵守以下规则：<span style="font-weight:bold">上传图片的专利权、版权、人物肖像权（如有，且客户仅能上传本人照片）、商标权、著作权等知识产权均由客户自身负责审核，并确保该素材不存在任何侵犯第三人合法权利的因素及遵守以下规则：</span></p>
        <p>1.不含任何与法律法规相抵触的文字或图片。</p>
        <p>2.不含煽动或鼓吹反政府，推翻政府的文字或图片。</p>
        <p>3.不含任何与政治主题相关的文字或图片。</p>
        <p>4.不含任何涉及种族、宗教、民族、性别歧视的文字或图片。</p>
        <p>5.不含任何涉及性、血腥、暴力、不雅主题的文字或图片。</p>
        <p>6.不含有可能引起银行卡诈骗的文字或图片，例如网站链接或诈骗电话号码等。</p>
        <p>7.不含有违反社会主义道德和公序良俗的文字和图片。</p>
        <p style="font-weight:bold">8.不含任何侵害他人肖像权、姓名权、版权、隐私权、著作权等权利以及他人拥有知识产权等文字或图片。</p>
        <p>9.不含有侮辱、诽谤或带有歧视性的文字或图片。</p>
        <p>10.不含有会引起任何人不适的内容。</p>
        <p style="font-weight:bold">11.不含有任何品牌和注册商标的文字或图片，以及这些品牌和注册商标的缩写，简写或近似的文字或图片。</p>
        <p style="font-weight:bold">12.不含有广告促销及招揽性质的文字或图片。</p>
        <p>13.不含有可能在商户受理卡片过程中产生任何误解和混乱的文字或图片。</p>
        <p>14.不含其他不适合作为卡面的文字或图片。</p>
        <p style="font-weight:bold">15.不含有第三方享有的著作权的字体类型。</p>
        <p class="mtitle">二、私人定制卡面上传图片保证及陈述</p>
        <p>1.本人已阅读、知悉、理解并同意遵守第一条“私人定制卡面上传图片须知”所述内容。</p>
        <p style="font-weight:bold">2.本人保证对本人上传的图片拥有知识产权，授权天喻信息在定制卡面业务中使用与存储，存储期限为2年。</p>
        <p>3.本人知晓并同意定制卡面上传的图片需经天喻信息审核通过方可作为卡面使用，天喻信息有权自主决定审核结果。但审核并不代表天喻信息对图片肖像权或著作权等权益的认可或承诺。<span style="font-weight:bold">本人知晓并同意，若上传的图片未通过审核，天喻信息有权不予核发。</span></p>
        <p style="font-weight:bold">4.本人已知悉，手机屏幕显示、电脑显示与实际工艺色彩的差异化等原因可能会导致卡面效果产生偏差，以收到卡片实物效果为准。如因本人上传图片清晰度不足、上传后过度缩放、电脑显示等原因产生色差导致卡面效果未能达到本人预期的，天喻信息无须重新安排制卡，本人已支付费用不予以退还。</p>
        <p>5.本人承诺因本人提供的图片违法违规、侵犯第三人合法权利、违反《私人定制卡面上传图片须知》中的规则及本承诺等情形而发生的争议，本人自行解决，因此给天喻信息造成的损失，本人承担损失赔偿责任。<span style="font-weight:bold">若因本人上传图片造成侵权的投诉或诉讼时，本人同意由发卡银行无条件停卡，并同意在接到天喻信息剪卡要求后，立即将卡片剪断并寄交天喻信息处理。</span></p>
        <p>6.<span style="font-weight:bold">本人知晓并同意在天喻信息页面填写收货人姓名、电话、收货地址，天喻信息有权存储收货地址信息，并用于后续邮寄卡片，订单查询、跟踪物流等操作。</span>本人同意定制银行卡服务由天喻信息提供，卡片审核、卡片制卡、卡片邮寄、卡片定制费用结算及售后均由天喻信息负责、不管卡面审核是否通过，天喻信息获取的相关数据均由天喻信息保留，用于后续补卡，查询等需要。</p>
        <p style="font-weight:bold">7.本人知晓并同意威海市商业银行在校验本人办卡资质通过后，使用客户手机号、银行卡号、开户日期等数据，作为必要数据提供给武汉天喻信息用于制卡、查询等操作。</p>
        <p >8.本人知悉并完全理解上述内容，愿意遵守上述约定。</p>
      </div>
    `
      }).then(() => {
        // this.checked = true; // CSMBANK-113
      });
    },
    async handleGetBeauty() {
      // eslint-disable-next-line
      const res = await queryBeautyNo({
        merNo: merNo,
        templetNo: (this.cardInfo.template || {}).templetNo
      });
      if (res && res.returnCode === "SUCCESS") {
        console.log(res.body);
        let { body = [] } = res;
        if (!Array.isArray(body)) {
          body = [];
        }
        return body;
      } else {
        return null;
      }
      // const list = [
      //   {
      //     cardNo: "1659816816161",
      //     cardTailNo: "123456",
      //     cardPrice: 20000
      //   },
      //   {
      //     cardNo: "6653816816161",
      //     cardTailNo: "123457",
      //     cardPrice: 20000
      //   },
      //   {
      //     cardNo: "1623816816161",
      //     cardTailNo: "123458",
      //     cardPrice: 20000
      //   },
      //   {
      //     cardNo: "1653811816161",
      //     cardTailNo: "123459",
      //     cardPrice: 20000
      //   },
      //   {
      //     cardNo: "1663816816161",
      //     cardTailNo: "123450",
      //     cardPrice: 20000
      //   },
      //   {
      //     cardNo: "1653016816161",
      //     cardTailNo: "123461",
      //     cardPrice: 20000
      //   }
      // ];
      // return list;
    },
    async handleGetCustom(cardNo) {
      const res = await checkCustomizedNo({
        customizedTailNo: cardNo,
        merNo: merNo,
        templetNo: (this.cardInfo.template || {}).templetNo
      });
      if (res && res.returnCode === "SUCCESS") {
        let { body = [] } = res;
        if (!Array.isArray(body)) {
          body = [];
        }
        return body;
      } else {
        return null;
      }
      // const list = [
      //   {
      //     cardNo: "1653816816111",
      //     cardTailNo: "123416",
      //     cardPrice: 20000
      //   },
      //   {
      //     cardNo: "1653816816181",
      //     cardTailNo: "123417",
      //     cardPrice: 20000
      //   },
      //   {
      //     cardNo: "1653816816161",
      //     cardTailNo: "123418",
      //     cardPrice: 20000
      //   },
      //   {
      //     cardNo: "1653816116161",
      //     cardTailNo: "123419",
      //     cardPrice: 20000
      //   },
      //   {
      //     cardNo: "1653816866161",
      //     cardTailNo: "123420",
      //     cardPrice: 20000
      //   },
      //   {
      //     cardNo: "1653816836161",
      //     cardTailNo: "123421",
      //     cardPrice: 20000
      //   }
      // ];
      // return list;
    },
    // 废弃：cardno搜索框focus
    handleCardnoChooseFocus() {
      setTimeout(() => {
        // 定制卡尾号选择div滚动到顶部
        const scrollTop =
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          window.pageYOffset;
        const cardnoEl = this.$refs.cardno;
        const cardnoElTop = (cardnoEl.getBoundingClientRect() || {}).top;
        if (cardnoEl) {
          // document.documentElement.scrollTop = cardnoElTop;
          window.scrollTo(0, scrollTop + cardnoElTop || 200);
        }
      }, 500);
    },
    // 是否勾选定制卡尾号change
    handleIsCardNoChange(isCardNo) {
      if (!isCardNo) {
        this.cardNo = "";
      }
    }
  }
};
</script>
<style lang="less">
.container {
  .agreeinfo {
    .van-checkbox__icon {
      margin-top: 3px;
    }
  }
}
</style>
<style scoped lang="less">
.van-toast {
  width: 120px;
}
.van-submit-bar__bar {
  border-top: 1px solid #eee;
}
div.container {
  width: 100%;
  min-height: 100%;
  background-color: #f6f6f6;
}
div.order-sub {
  width: 100%;
  min-height: 100%;
  background-color: #f6f6f6;
  .cardno {
    padding-top: 0.4rem !important;
    padding-bottom: 0.2rem !important;
    border-width: 0 !important;
    margin-bottom: 0 !important;
  }
  &-info {
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }
  ol {
    padding-top: 0.53rem;
    background-color: white;
    margin-bottom: 0.33rem;

    li {
      text-align: center;
      img.horizontal {
        width: 75%;
        height: auto;
      }
      img.vetical {
        width: 4.47rem;
        height: auto;
      }
    }
    li.card-name {
      font-size: 0.41rem;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      padding-top: 0.56rem;
      padding-bottom: 0.72rem;
    }
  }
  ul {
    flex: 1;
    // background-color: white;
    padding-bottom: 1.2667rem;
    li {
      width: 100%;
      background-color: white;
      font-size: 0.33rem;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 0.46rem;
      padding: 0.4667rem 0.313rem 0.1867rem;
    }
    li.address {
      display: flex;
      padding-top: 0.6rem;
      padding-bottom: 0.45rem;
      align-items: center;
      img {
        width: 0.375rem;
        height: 0.375rem;
        display: block;
      }
      p.add {
        flex: 1;
        text-indent: 0.2rem;
        font-size: 0.375rem;
      }
      img.arrow {
        transform: rotate(-90deg);
      }
    }
    li.agreeinfo {
      z-index: 2;
      position: fixed;
      bottom: 1.5867rem;
    }
    li.note {
      background: #f6f6f6;
      padding: 0.84rem 0.313rem;
      font-size: 0.3333rem;
      color: #666666;
    }
    li:last-child {
      position: fixed;
      bottom: 0;
      .van-submit-bar__text {
        text-align: left;
        padding-left: 0.4rem;
        span.van-submit-bar__price {
          margin-left: 10px;
          font-size: 0.42rem;
          .van-submit-bar__price--integer {
            margin-left: 2px;
          }
        }
      }
    }
    li:nth-child(2) {
      height: auto;
      line-height: 0.6rem;
      padding-top: 0.8rem;
      padding-bottom: 0.6rem;
      // border: 1px solid #eee;
      margin-bottom: 0.4rem;
    }
  }
}
.showagree.theme-fontcolor {
  color: #0066bf;
}
.submit {
  width: 4.32rem;
  height: 1.1733rem;
  background: linear-gradient(90deg, #0c7de1, #0065be);
  border-radius: 0.5867rem;
  font-size: 0.4133rem;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.1733rem;
  text-align: center;
  float: right;
}
.totolfee {
  height: 1.1733rem;
  float: left;
  font-size: 0.3333rem;
  color: #999999;
  line-height: 1.1733rem;
  span {
    font-size: 0.4667rem;
    font-weight: bold;
    color: #0066bf;
    &.f1 {
      font-size: 0.3733rem;
    }
  }
}
</style>
