<template>
  <div class="container">
    <net-error :reload="onRefresh" v-if="netError"></net-error>
    <div v-if="!netError" class="bill-page">
      <div class="bill-page-info">
        <p><span></span>发票类型</p>
        <div class="img-con ">
          <span class="type">发票类型</span>
          <span class="type_value">普通增值税发票（电子）</span>
        </div>
        <p><span></span>发票信息</p>
        <div class="field-con">
          <van-form @submit="onSubmit" :show-error="false">
            <!-- <van-field
              label="抬头类型"
              readonly
              name="titleType"
              v-model="titleType"
            /> -->
            <van-field name="titleType" label="抬头类型">
              <template #input>
                <van-radio-group
                  class="type-radio"
                  v-model="titleType"
                  direction="horizontal"
                >
                  <van-radio name="1">个人</van-radio>
                  <van-radio name="2">企业</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              v-model="invoiceTitle"
              name="invoiceTitle"
              label="发票抬头"
              required
              maxlength="20"
              :placeholder="
                titleType == 1 ? '请填写真实姓名' : '请填写企业名称'
              "
              :rules="[
                {
                  required: true,
                  pattern: /^[\u4E00-\u9FA5]{1,20}$/,
                  message: '请填写正确的发票抬头'
                }
              ]"
            />
            <van-field
              v-model="taxFileNum"
              name="taxFileNum"
              label="税号"
              required
              maxlength="20"
              v-if="titleType == 2"
              placeholder="请填写纳税人识别号"
              :rules="[
                {
                  required: true,
                  pattern: /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/,
                  message: '请填写正确的纳税人识别号'
                }
              ]"
            />
            <van-field
              v-model="bankName"
              name="bankName"
              label="开户银行"
              maxlength="20"
              v-if="titleType == 2"
              placeholder="选填"
            />
            <van-field
              v-model="bankNo"
              name="bankNo"
              label="银行账号"
              maxlength="24"
              v-if="titleType == 2"
              placeholder="选填"
            />
            <van-field
              v-model="enterpriseAddress"
              name="enterpriseAddress"
              label="企业地址"
              maxlength="40"
              rows="2"
              autosize
              type="textarea"
              v-if="titleType == 2"
              placeholder="选填"
            />
            <van-field
              v-model="enterpriseTel"
              name="enterpriseTel"
              label="企业电话"
              maxlength="12"
              v-if="titleType == 2"
              placeholder="选填"
              :rules="[
                {
                  required: false,
                  validator: val => {
                    if (!val) {
                      return true;
                    }
                    if (!/^[0-9\-]+$/.test(val)) {
                      return false;
                    }
                    return true;
                  },
                  message: '企业电话必须是座机或手机号'
                }
              ]"
            />
            <van-field
              readonly
              class="price"
              v-model="price"
              name="price"
              label="发票金额"
            />
            <p class="last"><span></span>收票人信息</p>
            <van-field
              v-model="consignee"
              name="consignee"
              required
              maxlength="8"
              placeholder="请填写收票人姓名"
              :rules="[
                {
                  pattern: /^[\u4E00-\u9FA5]{1,10}$/,
                  message: '请填写收票人姓名,必须中文'
                }
              ]"
              label="收票人姓名"
            />
            <van-field
              v-model="consigneePhone"
              name="consigneePhone"
              type="tel"
              required
              maxlength="11"
              placeholder="请填写收票人手机号"
              :rules="[
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: '请正确填写收票人手机号'
                }
              ]"
              label="收票人手机号"
            />
            <van-field
              v-model="consigneeEmail"
              name="consigneeEmail"
              required
              maxlength="24"
              type="email"
              placeholder="请填写收票人邮箱"
              :rules="[
                {
                  required: true,
                  pattern: /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/,
                  message: '请正确填写收票人邮箱'
                }
              ]"
              label="收票人邮箱"
            />
            <!-- <p class="tips">
              开票时间为每周三,即每周三批量对上周一至周日的用户开发票，如遇到节假日顺延
            </p> -->
            <p class="tips" style="padding-top:0.43rem">
              温馨提示:
            </p>
            <p class="tips">
              1.开票申请提交后，电子发票在24小时内自动开具，(如在月初1-6号则48小时内开具)。开具成功后会自动发送到收票人邮箱，请认真并正确填写收票人邮箱地址。
            </p>
            <p class="tips">
              2.发票开具金额为您实际支付金额，不包括优惠券、红包等抵扣金额。
            </p>
            <p class="tips">
              3.请认真填写开票内容，发票开具成功后，不允许重新开票，因信息填写错误造成的损失由您自己承担。
            </p>
            <div class="submit-btn-box">
              <van-button round block type="info" native-type="submit">
                提交
              </van-button>
            </div>
          </van-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 路由参数：
 * query: {
 *  price: string; // 发票金额
 *  childOrderCode: string; // 传入的子订单编号
 * }
 * 跳出页面：
 * $router.push('/billsuccess')
 */
import { floatDivide } from "Utils/index";
import NetError from "Components/neterror";
import { mapGetters } from "vuex";
import { applyInvoice } from "Api";
import { Toast, Dialog } from "vant";
export default {
  components: {
    NetError
  },
  data() {
    return {
      consignee: "",
      consigneePhone: "",
      consigneeEmail: "",
      invoiceType: "1",
      titleType: "1",
      invoiceTitle: "",
      price: 0,
      taxFileNum: "",
      enterpriseAddress: "",
      enterpriseTel: "",
      bankName: "",
      bankNo: ""
    };
  },
  computed: {
    ...mapGetters(["theme_img_path", "netError"])
  },
  created() {
    const { price = 0 } = this.$route.query;
    this.price = floatDivide(price, 100) + "元";
  },
  mounted() {},
  methods: {
    floatDivide,
    onRefresh() {
      this.billSuccess = false;
    },
    onSubmit(res) {
      const { childOrderCode } = this.$route.query;
      if (!childOrderCode) {
        Toast.fail("未查询到订单编号");
        return;
      }
      if (res) {
        const params = {
          ...res,
          type: "0",
          invoiceType: this.invoiceType,
          titleType: this.titleType,
          invoiceTitle: this.invoiceTitle,
          // invoiceContent: this.invoiceContent,
          orderCode: childOrderCode,
          consignee: this.consignee,
          consigneePhone: this.consigneePhone,
          consigneeEmail: this.consigneeEmail
        };
        if (Number(this.titleType) === 2) {
          params.taxFileNum = this.taxFileNum;
          params.enterpriseAddress = this.enterpriseAddress;
          params.enterprisePhone = this.enterpriseTel;
          params.enterpriseDepositBank = this.bankName;
          params.enterpriseBankAccount = this.bankNo;
        }
        delete params.price;
        Dialog.confirm({
          title: "提示",
          message: "请确认发票信息准确无误，提交之后不可修改哦"
        })
          .then(() => {
            this.getInvoice(params);
          })
          .catch(() => {});
      }
    },
    async getInvoice(params) {
      const res = await applyInvoice(params);
      if (res && res.returnCode === "SUCCESS") {
        this.$router.push("billsuccess");
        this.billSuccess = true;
      }
    },
    showDialog() {
      this.showPopup = true;
    }
  }
};
</script>
<style scoped lang="less">
@primary-color: #0065be;

.van-toast {
  width: 120px;
}

div.container {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
}
div.bill-page {
  width: 100%;
  background: #f6f6f6;
  &-info {
    p {
      text-indent: 0.4rem;
      font-size: 0.3733rem;
      padding: 0.32rem 0 0.2567rem;
      color: #999;
      span {
        border-left: 0.1067rem solid @primary-color;
        margin-right: 0.1533rem;
      }
    }
    p.last {
      background-color: #f6f6f6;
    }
    .img-con {
      background-color: white;
      padding: 0.51rem 0.43rem;
      height: 1.49rem;
      .type,
      .type_value {
        display: inline-block;
        width: 2.13rem;
        height: 0.48rem;
        font-size: 0.4267rem;
        font-weight: 400;
        color: #333333;
        line-height: 0.48rem;
      }
      .type_value {
        width: 6.48rem;
        padding-left: 0.53rem;
      }
      div {
        border-style: dotted;
        border-radius: 2px;
        width: 46%;
        height: auto;
        padding: 0.4rem 0;
        p {
          text-indent: 0;
          text-align: center;
          padding-bottom: 0.2rem;
          padding-top: 0.1rem;
          font-size: 0.3rem;
        }
        img {
          width: 1rem;
          margin-bottom: 0.2rem;
        }
      }
    }
    .field-con {
      background-color: white;
      /deep/ .van-form {
        .van-cell {
          height: 1.4933rem;
          // padding: 13px 16px;
          font-size: 0.43rem;
          display: flex;
          align-items: center;
          &::after {
            right: 0;
          }
        }
        .van-cell .van-cell__title.van-field__label {
          color: #333333;
          width: 6.3em;
          font-size: 0.43rem;
        }
      }
      p.type {
        display: flex;
        font-size: 14px;
        color: #323233;
        input {
          margin-left: 30px;
        }
        i {
          font-style: normal;
        }
      }
    }
  }
  .bottom-con {
    background-color: white;
    padding-top: 1rem;
  }
  p.tips {
    background-color: #f6f6f6;
    color: #666;
    padding: 0 0.37rem 0.1rem 0.37rem;
    text-indent: 0;
    line-height: 0.45rem;
    font-size: 0.32rem;
  }
}
div.bill-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 3rem;
    height: auto;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  p {
    width: 80%;
    font-size: 0.4rem;
    text-align: center;
    color: #333;
    line-height: 0.6rem;
  }
}
.type-radio {
  /deep/ .van-radio__icon--checked {
    .van-icon {
      background-color: #0c7de1;
      border-color: #0c7de1;
    }
  }
}
.price {
  /deep/ input {
    color: #0c7de1;
  }
}
.submit-btn-box {
  background-color: #f6f6f6;
  padding: 0.32rem 0.43rem;
  //  padding-bottom: 0.43rem;
  /deep/ .van-button--info {
    background: linear-gradient(90deg, #0c7de1 0%, #0065be 100%);
    border-radius: 1.39rem 1.39rem 1.39rem 1.39rem;
    width: 100%;
    height: 1.2267rem;
    margin: 0 auto;
    font-size: 0.4533rem;
  }
}
.showDialog {
  padding: 0;
}
</style>
