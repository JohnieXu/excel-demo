<template>
  <div class="container">
    <net-error :reload="onRefresh" v-if="netError"></net-error>
    <div v-if="!netError" class="bill-page">
      <div class="bill-page-info">
        <p><span></span>发票类型</p>
        <div class="img-con ">
          <div class="theme-buttoncolor-primary">
            <img src="~Assets/img2/bill.png" alt="" />
            <p>普通增值税发票（电子）</p>
            <p>预计7天内送到您邮箱</p>
          </div>
        </div>
        <p><span></span>发票信息</p>
        <div class="field-con">
          <van-form @submit="onSubmit" :show-error="false">
            <van-field
              label="抬头类型"
              readonly
              name="titleType"
              v-model="titleType"
            />
            <van-field
              v-model="invoiceTitle"
              name="invoiceTitle"
              label="发票抬头"
              required
              maxlength="10"
              placeholder="请填写真实姓名"
              :rules="[
                {
                  required: true,
                  pattern: /^[\u4E00-\u9FA5]{1,10}$/,
                  message: '请填写真实姓名,长度不超过10'
                }
              ]"
            />
            <van-field readonly v-model="price" name="price" label="发票金额" />
            <p class="last"><span></span>收票人信息</p>
            <van-field
              v-model="consignee"
              name="consignee"
              required
              maxlength="10"
              placeholder="请填写收票人姓名"
              :rules="[
                {
                  pattern: /^[\u4E00-\u9FA5]{1,10}$/,
                  message: '请填写收票人姓名,必须中文'
                }
              ]"
              label="收票人姓名:"
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
              label="收票人手机号:"
            />
            <van-field
              v-model="consigneeEmail"
              name="consigneeEmail"
              required
              maxlength="32"
              type="email"
              placeholder="请填写收票人邮箱"
              :rules="[{ required: true, message: '请填写收票人邮箱' }]"
              label="收票人邮箱:"
            />
            <p class="tips">
              开票时间为每周三,即每周三批量对上周一至周日的用户开发票，如遇到节假日顺延
            </p>
            <div style="margin: 16px;">
              <van-button round block type="info" native-type="submit">
                提交申请
              </van-button>
            </div>
          </van-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NetError from "Components/neterror";

import { mapGetters } from "vuex";
import { applyInvoice } from "Api";
import { Toast } from "vant";
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
      titleType: "个人",
      invoiceTitle: "",
      price: 0,
      taxFileNum: ""
    };
  },
  computed: {
    ...mapGetters(["theme_img_path", "netError"])
  },
  created() {
    const { price = 0 } = this.$route.query;
    this.price = price * 0.01 + "元";
  },
  mounted() {},
  methods: {
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
          invoiceType: "1",
          titleType: 1,
          orderCode: childOrderCode
        };
        delete params.price;
        this.getInvoice(params);
      }
    },
    async getInvoice(params) {
      const res = await applyInvoice(params);
      if (res && res.returnCode === "SUCCESS") {
        this.$router.push("billsuccess");
        this.billSuccess = true;
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
div.bill-page {
  width: 100%;
  background-color: #eee;
  &-info {
    p {
      text-indent: 0.4rem;
      font-size: 0.4rem;
      padding-top: 0.3rem;
      padding-bottom: 0.3rem;
      span {
        border-left: 2px solid #2a90fe;
        margin-right: 0.4rem;
      }
    }
    p.last {
      background-color: #eee;
    }
    .img-con {
      background-color: white;
      padding: 0.4rem;
      text-align: center;
      div {
        border-style: dotted;
        width: 60%;
        height: auto;
        padding: 0.4rem 0;
        p {
          text-align: center;
          padding-bottom: 0.2rem;
          padding-top: 0.1rem;
          font-size: 0.34rem;
        }
        img {
          width: 1.2rem;
          margin-bottom: 0.2rem;
        }
      }
    }
    .field-con {
      background-color: white;
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
    color: #ccc;
    padding: 0.5rem 0.5rem 0.1rem 0.5rem;
    text-indent: 0;
    line-height: 0.6rem;
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
</style>
