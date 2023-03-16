<template>
  <div class="excel">
    <div class="loading" v-show="loading">
      <p>loading</p>
    </div>
    <div v-show="!loading">
      <div v-if="isShowSheet" class="sheet">
        <div
          class="sheet__item"
          v-for="sheet in sheetNames"
          :key="sheet"
          @click="handleSheetClick(sheet)"
        >
          {{ sheet }}
        </div>
      </div>
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
      loading: false,
      sheetNames: []
    };
  },
  computed: {
    isShowSheet() {
      return this.sheetNames && this.sheetNames.length > 1;
    }
  },
  mounted() {
    const el = this.$refs.content;
    this.loading = true;
    this.loadFile()
      .then(buffer => {
        xlsxPreview.init(buffer, el, {
          width: "100%",
          height: "calc(100vh - 40px)"
        });
        this.sheetNames = xlsxPreview.getSheetNames();
        this.loading = false;
      })
      .catch(e => {
        console.log(e);
        this.loading = false;
      });
  },
  methods: {
    loadFile() {
      return getFileBuffer(filePool.random());
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
      padding-top: @head-height;
    }
  }
}
</style>
