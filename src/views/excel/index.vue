<template>
  <div class="excel">
    <div class="loading" v-show="loading">
      <p>加载文件中... {{ loadProgress }}</p>
    </div>
    <div class="loading" v-show="parseLoading">
      <p>解析文件中...</p>
    </div>
    <div v-show="!loading">
      <!-- <div v-if="isShowSheet" class="sheet">
        <div
          class="sheet__item"
          v-for="sheet in sheetNames"
          :key="sheet"
          @click="handleSheetClick(sheet)"
        >
          {{ sheet }}
        </div>
      </div> -->
      <van-tabs
        v-if="isShowSheet"
        class="sheet"
        color="#2d88e7"
        @click="handleSheetClick"
      >
        <van-tab
          v-for="sheet in sheetNames"
          :name="sheet"
          :title="sheet"
          :key="sheet"
        ></van-tab>
      </van-tabs>
      <div
        ref="content"
        class="content"
        :class="{ content__has_sheet: isShowSheet }"
      ></div>
    </div>
  </div>
</template>

<script>
import FilePool from "../home/filePool";
import XlsxPreview from "../home/xlsxPreview";
import { getFileBuffer } from "../home/file";

const filePool = new FilePool();
const xlsxPreview = new XlsxPreview();

export default {
  name: "ExcelView",
  data() {
    return {
      loading: false, // 文件下载loading
      parseLoading: false, // 文件解析loading
      loadProgress: "",
      sheetNames: []
    };
  },
  computed: {
    isShowSheet() {
      return this.sheetNames && this.sheetNames.length > 1;
    }
  },
  mounted() {
    this.init();
    window.init = this.init;
  },
  watch: {
    $route(route, o) {
      if (route.params.index !== o.params.index) {
        this.init();
      }
    }
  },
  methods: {
    init() {
      const el = this.$refs.content;
      this.loading = true;
      this.loadFile()
        .then(async buffer => {
          this.showParseLoading();
          await this.waitUIUpdate();
          xlsxPreview.init(buffer, el, {
            width: "100%",
            height: "calc(100vh - 40px)"
          });
          this.sheetNames = xlsxPreview.getSheetNames();
          this.loading = false;
          this.parseLoading = false;
        })
        .catch(e => {
          console.log(e);
          this.loading = false;
          this.parseLoading = false;
        });
    },
    // 等待视图渲染更新
    waitUIUpdate() {
      return new Promise(resolve => {
        this.$nextTick().then(() => {
          setTimeout(resolve, 0);
        });
      });
    },
    // 关闭下载文件进度提示并打开解析文件提示
    showParseLoading() {
      this.loading = false;
      this.parseLoading = true;
    },
    loadFile() {
      return new Promise((resolve, reject) => {
        const index = this.$route.params.index;
        const url = filePool.one(index);
        if (!url) {
          reject(new Error("文件不存在"));
        } else {
          console.log("开始加载文件：" + url);
          return getFileBuffer(url, this.onDownloadProgress).then(resolve);
        }
      });
    },
    onDownloadProgress(e) {
      const { loaded, total } = e;
      if (total) {
        const progress = Math.floor((loaded / total) * 100);
        console.log(progress, e);
        this.updateProgress(progress);
      }
    },
    updateProgress(progress) {
      this.loadProgress = "" + progress + "%";
    },
    handleSheetClick(sheetName) {
      xlsxPreview.showSheet(sheetName);
    }
  }
};
</script>

<style lang="less" scoped>
@head-height: 40px;

.excel {
  .sheet {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: @head-height;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    &__item {
      flex: 0;
      margin: 5px;
      font-size: 16px;
      line-height: 1;
    }
  }
  .content {
    &__has_sheet {
      padding-top: @head-height + 4px;
    }
  }
  .loading {
    width: 100%;
    text-align: center;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
