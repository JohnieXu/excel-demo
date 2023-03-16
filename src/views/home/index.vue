<template>
  <div class="container">
    <div class="top">
      <p class="title">{{ fileName }}</p>
      <van-button type="primary" size="small" @click="handleRefreshClick"
        >刷新</van-button
      >
      <div class="sheets" v-if="workbook">
        <span
          class="item"
          v-for="sheet in sheets"
          :key="sheet"
          @click="handleSheetClick(sheet)"
          >{{ sheet }}</span
        >
      </div>
    </div>
    <div class="content" ref="xlsx"></div>
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
import XlsxPreview from "./xlsxPreview";
import FilePool from "./filePool";

import axios from "axios";

/**
 * 获取网络文件buffer
 * @param {String} fileUrl 文件完整路径
 * @returns {Promise<Buffer>} data
 */
const getFileBuffer = fileUrl => {
  return new Promise((resolve, reject) => {
    axios
      .get(fileUrl, {
        withCredentials: true,
        responseType: "arraybuffer",
        timeout: 1000 * 60 * 60
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

// const xlsxUrl = "/" + indexDoc + "/files/营销平台版本需求开发计划.xlsx";
const xlsxUrl = "./files/营销平台版本需求开发计划.xlsx";

const filePool = new FilePool();

let workbook;

export default {
  name: "ViewHome",
  // mixins: [login],
  data() {
    return {
      fileName: "",
      sheets: [],
      workbook: null,
      grid: null
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
    this.handleRefreshClick();
  },
  methods: {
    handleRefreshClick() {
      const url = filePool.random();
      // const url = filePool.last();
      if (!url) {
        return;
      }
      console.log("开始加载文件：" + url);
      this.fileName = url.split("/")[url.split("/").length - 1];
      getFileBuffer(url).then(buffer => {
        console.log("文件加载完成");
        this.loadXlsx(buffer);
      });
    },
    handleSheetClick(sheetName) {
      this.change2Sheet(sheetName);
    },
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
    async loadXlsx(buffer) {
      console.log("开始解析xlxs文件");
      const xlsxEl = this.$refs.xlsx;

      const child = this.$refs.xlsx.firstElementChild;
      if (child) {
        this.$refs.xlsx.removeChild(child);
      }

      if (buffer) {
        const wb = xlsx.read(buffer);
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(ws);
        // const data = xlsx.utils.sheet_to_html(ws);
        this.sheets = wb.SheetNames;
        workbook = wb;
        this.workbook = wb;
        console.log("开始渲染xlxs到页面", data);
        this.grid = canvasDatagrid({
          parentNode: xlsxEl,
          data,
          editable: false
        });
        this.grid.style.width = "100vw";
        this.grid.style.height = "90vh";
        // xlsxEl.innerHTML = data;
      } else {
        try {
          const wb = xlsx.read(await (await fetch(xlsxUrl)).arrayBuffer());
          const ws = wb.Sheets[wb.SheetNames[0]];
          const data = xlsx.utils.sheet_to_json(ws);
          // const data = xlsx.utils.sheet_to_html(ws);
          this.sheets = wb.SheetNames;
          workbook = wb;
          this.workbook = wb;
          console.log("开始渲染xlxs到页面", data);
          this.grid = canvasDatagrid({
            parentNode: xlsxEl,
            data,
            editable: false
          });
          this.grid.style.width = "100vw";
          this.grid.style.height = "90vh";
          // xlsxEl.innerHTML = data;
        } catch (e) {
          window.alert("预览失败：" + e.message);
        }
      }
    },
    change2Sheet(sheetName) {
      if (!workbook) {
        console.error("workbook not intialised");
        return;
      }
      if (!workbook.Sheets[sheetName]) {
        console.error("sheetName not found");
        return;
      }
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      console.log("开始更新grid.data");
      this.grid.data = data;
    }
  }
};
</script>

<style lang="less" scoped>
@head_height: 80px;

.top {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: @head_height;
  .title {
    text-align: center;
  }
  .sheets {
    .item {
      display: inline-block;
      margin: 0;
      padding: 5px;
      font-size: 16px;
    }
  }
}
.content {
  padding-top: @head_height;
}
</style>
