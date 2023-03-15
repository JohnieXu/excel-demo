<template>
  <div class="container">
    <net-error :reload="onRefresh" v-if="netError"></net-error>
    <div v-if="!netError" class="bill-success">
      <div ref="pdfBox" class="pdf-box" @click="showPreview = true">
        <pdf
          :src="src"
          @error="handlePreviewError"
          @loaded="handleLoadComplete"
        ></pdf>
        <p ref="pdfTips" class="tip">点击预览发票</p>
      </div>
      <div
        class="backorder submit-btn theme-buttoncolor"
        @click="showMail = true"
      >
        重新发送邮箱
      </div>
      <van-dialog
        v-model="showMail"
        title="请确认邮箱地址"
        show-cancel-button
        :beforeClose="chargeBtn"
      >
        <!--输入框-->
        <van-field
          v-model="email"
          rows="1"
          autosize
          maxlength="40"
          type="textarea"
          placeholder="用来接收电子发票邮件"
          class="van-hairline--surround"
        />
      </van-dialog>
      <van-popup class="preview-box" v-model="showPreview">
        <pdf
          :src="src"
          @error="handlePreviewError"
          @loaded="handleLoadComplete"
        ></pdf>
      </van-popup>
    </div>
  </div>
</template>
<script>
/**
 * 路由参数：
 * query: {
 *  invoiceURL: string; // PDF发票链接
 *  childOrderCode: string; // 传入的子订单编号
 * }
 * 跳出页面：
 * 无
 */
import NetError from "Components/neterror";
import pdf from "@whty/vue-pdf";
import { mapGetters } from "vuex";
import { Toast } from "vant";
import { pushInvoice } from "Api";
import { indexDoc } from "Utils/appconfig.js";

const C_MAP_URL = window.location.origin + "/" + indexDoc + "/cmaps/";

export default {
  name: "ViewBillDetail",
  components: {
    NetError,
    pdf
  },
  data() {
    return {
      src: "",
      showMail: false,
      email: "",
      images: [],
      showPreview: false,
      pdfInterval: null
    };
  },
  computed: {
    ...mapGetters(["netError"])
  },
  created() {
    this.initData();
  },
  mounted() {},
  destroyed() {
    this.pdfInterval && clearInterval(this.pdfInterval);
  },
  methods: {
    onRefresh() {},
    initData() {
      const { invoiceURL } = this.$route.query;
      if (!invoiceURL) {
        Toast("电子发票文件不存在");
      } else {
        this.loadPdf(invoiceURL);
      }
    },
    loadPdf(pdfUrl) {
      if (!pdfUrl) {
        return;
      }
      Toast.loading({
        forbidClick: true
      });
      const reg = /^https?/;
      pdfUrl = reg.test(pdfUrl) ? pdfUrl : process.env.VUE_APP_IMG_URL + pdfUrl;
      this.src = pdf.createLoadingTask(pdfUrl, {
        cMapUrl: C_MAP_URL,
        cMapPacked: true
      });
    },
    loadPdfImg() {
      // const IMG_ELEMENT_ID = 'pdf_viewer_img'
      this.$nextTick(() => {
        const canvas = document.querySelector(".pdf-box canvas");
        this.genImage(canvas);
      });
    },
    genImage(canvas) {
      if (!canvas) {
        return;
      }
      const isPdfPixel = arr => {
        return arr.some(i => i !== 0);
      };
      const ctx = canvas.getContext("2d");
      const imageData = ctx.getImageData(0, 0, 2, 2);
      if (!isPdfPixel(imageData.data)) {
        setTimeout(() => {
          this.genImage(canvas);
        }, 300);
      } else {
        this.pdfInterval = setInterval(() => {
          const IMG_ELEMENT_ID = "pdf_viewer_img";
          const pdfBox = this.$refs.pdfBox;
          const pdfTips = this.$refs.pdfTips;
          // const canvas = document.querySelector('.pdf-box canvas')
          let img = document.querySelector(`#${IMG_ELEMENT_ID}`);
          if (!pdfBox || !pdfTips || !canvas) {
            console.error("渲染PDF为图片失败，PDF未加载完成或渲染失败");
            return;
          }
          if (!img) {
            img = document.createElement("img");
            img.id = IMG_ELEMENT_ID;
            img.style.position = "absolute";
            img.style.top = "0";
            img.style.left = "0";
            img.width = canvas.offsetWidth;
            img.height = canvas.offsetHeight;
            img.src = canvas.toDataURL();
            pdfBox.insertBefore(img, pdfTips);
          } else {
            img.src = canvas.toDataURL();
          }
        }, 1000);
      }
    },
    closeLoading() {
      Toast.clear();
    },
    handlePreviewError() {
      this.isInvoiceLoaded = true;
      Toast("预览发票失败");
    },
    handleLoadComplete() {
      this.closeLoading();
      this.loadPdfImg();
    },
    chargeBtn(action, done) {
      if (action === "cancel") {
        this.showMail = false;
        this.email = "";
        done();
      } else if (action === "confirm") {
        const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const email = this.email;
        const isValid = reg.test(email);
        if (!isValid) {
          Toast("请填写正确的邮箱地址");
          done(false);
        } else {
          const orderCode = this.$route.query.childOrderCode;
          if (!orderCode) {
            Toast("订单号不存在");
            done(false);
            return;
          }
          const params = {
            orderCode,
            consigneeEmail: email
          };
          pushInvoice(params)
            .then(res => {
              if (res && res.returnCode === "SUCCESS") {
                Toast.success("已发送");
                this.email = "";
                this.showMail = false;
              } else {
                Toast(res ? res.returnDes || "请求失败" : "请求失败");
                done(false);
              }
              done();
            })
            .catch(() => {
              done(false);
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

div.bill-success {
  width: 100%;
  height: 100%;
  background-color: #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  .pdf-box {
    width: 90vw;
    min-height: 160px;
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    .tip {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 35px;
      text-align: center;
      line-height: 35px;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
    }
  }
  /deep/ .van-dialog__content {
    .van-field {
      width: 85%;
      margin: 0.3rem auto;
    }
  }
}
.backorder {
  margin-top: 2rem;
  width: 9.36rem;
  height: 1.23rem;
  background: linear-gradient(90deg, #0c7de1 0%, #0065be 100%);
  border-radius: 1.39rem 1.39rem 1.39rem 1.39rem;
  opacity: 1;
}
.preview-box {
  width: 100%;
}

/deep/.van-button--default {
  border: 1px solid #fffdfd;
}
/deep/.van-dialog__cancel .van-button__text {
  color: gray;
}
</style>
