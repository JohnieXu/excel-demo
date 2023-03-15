<template>
  <div class="container">
    <div ref="xlsx"></div>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
import { mapGetters } from "vuex";
import { merNo, merType, big_data_code, appId } from "Utils/appconfig.js";
import { indexDoc, isInWxEnv } from "Utils/appconfig";
// import { login } from "Mixin/login.js";
import * as xlsx from "xlsx";
import canvasDatagrid from "canvas-datagrid";

const xlsxUrl = indexDoc + "/files/营销平台版本需求开发计划.xlsx";

export default {
  name: "ViewHome",
  // mixins: [login],
  data() {
    return {
      version: process.env.VUE_APP_VERSION,
      showVersion: process.env.VUE_APP_VERSION_SHOW,
      photo_edit: process.env.VUE_APP_PHOTO_EDITE
    };
  },
  computed: {
    ...mapGetters(["openId", "netError", "authorization", "showOverlay"])
  },
  created() {
    // if (isInWxEnv) {
    //   this.imgHanldle();
    // }
  },
  mounted() {
    this.loadXlsx();
  },
  methods: {
    // 跳转图片处理  登录认证参数地址栏传输 在返回接受
    imgHanldle() {
      const inParams = {
        token: this.authorization,
        backUrl:
          window.location.origin +
          "/" +
          indexDoc +
          "/#/suborder?authorization=" +
          this.authorization +
          "&openid=" +
          this.openId,
        merNo: merNo,
        appId: appId,
        appName: "whyh", // 不能轻易变更（photo-edite项目需要使用这个值）
        merType,
        bigDataCode: big_data_code,
        imageSize: [0, 20], // 图片上传限制尺寸
        theme: { primary: "#1167b9" }
      };
      this.SET_OVERLAY(false);
      const url = encodeURIComponent(JSON.stringify(inParams));
      // location.href =
      //   this.photo_edit + "/#/card-type-bg-choose?inParams=" + url;
      location.replace(
        this.photo_edit + "/#/card-type-bg-choose?inParams=" + url
      ); // fix: CTOB-1833 code ben used
    },
    async loadXlsx() {
      const xlsxEl = this.$refs.xlsx;
      try {
        const wb = xlsx.read(await (await fetch(xlsxUrl)).arrayBuffer());
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(ws);
        canvasDatagrid({ parentNode: xlsxEl, data, editable: false });
      } catch (e) {
        window.alert("预览失败：" + e.message);
      }
    }
  }
};
</script>

<style lang="less"></style>
