<template>
  <div class="container">
    <div class="top">
      <p class="title">{{ fileName }}</p>
      <van-button type="primary" size="small" @click="handleRefreshClick">刷新</van-button>
      <div class="sheets">
        <span v-for="sheet in workbook.SheetNames" :key="sheet">{{ sheet }}</span>
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

class FilePool {
  _files = [
    "./files/上海招行开发列表.xls",
    "./files/北京农行开发计划.xls",
    "./files/平安银行开发计划.xls",
    "./files/恒丰合伙人二期改造计划.xlsx",
    "./files/恒丰合伙人二期改造计划(黄成).xlsx",
    "./files/营销平台版本需求开发计划2.xlsx",
    "./files/工行信用卡权益车商户清单文件.xls"
  ];
  _index = -1;
  random() {
    let index = this._index;
    if (++index > this._files.length) {
      this._index = 0;
    } else {
      this._index = index;
    }
    return this._files[index];
  }
  last() {
    return this._files[this._files.length - 1];
  }

  getInstance() {}
}

const filePool = new FilePool();

let workbook;

export default {
  name: "ViewHome",
  // mixins: [login],
  data() {
    return {
      fileName: "",
      sheets: [],
      workbook: null
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
      console.log("开始加载文件：" + url);
      this.fileName = url.split("/")[url.split("/").length - 1];
      getFileBuffer(url).then(buffer => {
        console.log("文件加载完成");
        this.loadXlsx(buffer);
      });
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
        this.sheets = wb.sheets;
        workbook = wb;
        this.workbook = wb;
        console.log("开始渲染xlxs到页面");
        canvasDatagrid({ parentNode: xlsxEl, data, editable: false });
      } else {
        try {
          const wb = xlsx.read(await (await fetch(xlsxUrl)).arrayBuffer());
          const ws = wb.Sheets[wb.SheetNames[0]];
          const data = xlsx.utils.sheet_to_json(ws);
          this.sheets = wb.sheets;
          workbook = wb;
          this.workbook = wb;
          console.log("开始渲染xlxs到页面");
          canvasDatagrid({ parentNode: xlsxEl, data, editable: false });
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
      const xlsxEl = this.$refs.xlsx;
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      console.log("开始渲染xlxs到页面");
      canvasDatagrid({ parentNode: xlsxEl, data, editable: false });
    }
  }
};
</script>

<style lang="less" scoped>
.top {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  .title {
    text-align: center;
  }
  .sheets {}
}
.content {
  padding-top: 50px;
}
</style>
