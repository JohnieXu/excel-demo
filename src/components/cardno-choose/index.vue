<template>
  <div class="comp-cardno-choose">
    <van-tabs v-model="currentTab" color="#2A90FE" @click="handleTabsClick">
      <van-tab title="自选卡号" name="custom">
        <div class="custom">
          <van-search
            v-model.trim="custom.search"
            :placeholder="placeholder.custom"
            :maxlength="6"
            show-action
            @search="handleCustomSearch"
            @input="handleSearchInput('custom', $event)"
          >
            <template #action>
              <div @click="handleCustomSearch">
                <van-icon
                  name="search"
                  size="24"
                  style="vertical-align: middle; color: #2A90FE;"
                />
              </div>
            </template>
          </van-search>
          <p class="custom-desc" v-if="customDesc">{{ customDesc }}</p>
          <template v-if="custom.total === -1">
            <slot name="custom-default">
              <list-default text="暂无卡号"></list-default>
            </slot>
          </template>
          <template v-else-if="custom.total === 0">
            <slot name="custom-nodata">
              <list-default text="暂无卡号"></list-default>
            </slot>
          </template>
          <template v-else>
            <div class="cardno-list">
              <div
                v-for="item in custom.list"
                :key="item.cardNo"
                :class="{
                  'custom-cardno-item': true,
                  selected: item.cardNo === custom.selected
                }"
                @click="handleCardNoItemClick('custom', item.cardNo)"
              >
                <div class="van-hairline--surround wrapper">
                  <span class="cardno">{{ item.cardTailNo }}</span
                  ><span class="price"
                    >￥{{ item.cardPrice | priceFilterInt }}</span
                  >
                </div>
              </div>
            </div>
          </template>
        </div>
      </van-tab>
      <van-tab title="优选卡号" name="beauty">
        <div class="beauty">
          <template v-if="beauty.total === -1">
            <slot name="beauty-default">
              <list-default text="暂无卡号"></list-default>
            </slot>
          </template>
          <template v-else-if="beauty.total === 0">
            <slot name="beauty-nodata">
              <list-default text="暂无卡号"></list-default>
            </slot>
          </template>
          <template v-else>
            <div class="cardno-list">
              <div
                v-for="item in beauty.list"
                :key="item.cardNo"
                :class="{
                  'beauty-cardno-item': true,
                  selected: item.cardNo === beauty.selected
                }"
                @click="handleCardNoItemClick('beauty', item.cardNo)"
              >
                <div class="van-hairline--surround wrapper">
                  <span class="cardno">{{ item.cardTailNo }}</span
                  ><span class="price"
                    >￥{{ item.cardPrice | priceFilterInt }}</span
                  >
                </div>
              </div>
            </div>
          </template>
          <div v-if="!!beauty.total" class="footer">
            <slot name="beauty-refresh">
              <van-button
                class="beauty-refresh"
                type="default"
                :plain="false"
                :disabled="beauty.loading"
                block
                text="换一批"
                @click="handleRefresh"
              ></van-button>
            </slot>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Vue from "vue";
import { Tabs, Tab, Search, Toast, Button, Icon } from "vant";
import EmptyCardNo from "@/assets/img2/empty_card_no.png";
import { priceFilterInt } from "@/filters/price";

// TODO: 当前选中的卡号绑定到v-model

Vue.use(Tabs);
Vue.use(Tab);
Vue.use(Search);
Vue.use(Button);
Vue.use(Icon);

/**
 * 接口参数：
 * cardNo: 卡号
 * cardTailNo: 卡尾号
 * cardPrice: 卡价格
 */

export default {
  name: "cardno-choose",
  model: {
    prop: "value",
    event: "change"
  },
  components: {
    ListDefault: {
      name: "ListDefault",
      functional: true,
      render(h, context) {
        const {
          data: {
            attrs: { image = EmptyCardNo, text }
          }
        } = context;
        return (
          <div class="list-default">
            <img class="image" src={image}></img>
            {text && <p class="text">{text}</p>}
          </div>
        );
      }
    }
  },
  filters: {
    priceFilterInt
  },
  props: {
    getBeauty: {
      type: Function,
      required: true
    },
    getCustom: {
      type: Function,
      required: true
    },
    validateCardSearch: {
      type: Function,
      default: no => {
        no = no + "";
        return new Promise((resolve, reject) => {
          if (!no) {
            reject("请输入2-6位尾号数字进行查询");
          } else if (!/^\d+$/.test(no)) {
            reject("输入的尾号不能包含非数字字符");
          } else if (no.length > 6 || no.length < 2) {
            reject("请输入2-6位尾号数字进行查询");
          } else {
            resolve();
          }
        });
      }
    },
    placeholder: {
      type: Object,
      default: () => {
        return {
          custom: "请输入2-6位尾号数字进行查询",
          beauty: ""
        };
      }
    },
    customDesc: {
      type: String,
      required: false
    },
    nodataDesc: {
      type: String,
      default: "暂无卡号"
    },
    // 当搜索出错时是否显示之前的结果（自选卡号）
    showLastListCustom: {
      type: Boolean,
      default: false
    },
    // 当搜索出错时是否显示之前的结果（优选卡号）
    showLastListBeauty: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentTab: "custom",
      custom: {
        search: "",
        total: -1,
        list: [],
        selected: ""
      },
      beauty: {
        total: -1,
        lastList: [],
        list: [],
        selected: "",
        loading: false
      }
    };
  },
  created() {
    if (typeof this.getCustom !== "function") {
      throw new Error("参数getCustom必须为function且返回promise");
    }
    // this.custom.search = "123";
    // this.handleCustomSearch(); // TODO: 临时
  },
  methods: {
    // 查询优选卡号列表
    async getBeautyList() {
      if (typeof this.getBeauty !== "function") {
        throw new Error("参数getBeauty必须为function且返回promise");
      }
      let list = await this.getBeauty();
      if (!Array.isArray(list)) {
        this.beauty.total = 0;
      } else {
        this.beauty.list = list;
        this.beauty.total = list.length;
      }
    },
    // 选中第一组
    checkFirst(type) {
      const list = this[type].list || [];
      this[type].selected = (list[0] || {}).cardNo || "";
      this.$emit("change", this[type].selected);
    },
    handleTabsClick(name) {
      // 切换到优选卡号刷新可选卡号
      if (name === "beauty") {
        this.handleRefresh();
      }
    },
    // 自选卡号搜索点击
    handleCustomSearch() {
      const search = this.custom.search;
      const res = this.validateCardSearch(search);
      if (typeof res.then !== "function") {
        throw new Error("参数validateCardSearch必须为function且返回promise");
      }
      res
        .then(async () => {
          this.custom.loading = true;
          let searchRes = await this.getCustom(search);
          this.custom.loading = false;
          // 请求失败
          if (searchRes === null) {
            // 不显示上次请求结果
            if (!this.showLastListCustom) {
              this.custom.list = [];
              this.custom.total = 0;
            }
            return;
          }
          // 请求返回成功
          if (!Array.isArray(searchRes)) {
            this.custom.total = 0;
            this.custom.list = [];
          } else {
            this.custom.list = searchRes;
            this.custom.total = searchRes.length;
          }
          this.checkFirst("custom");
        })
        .catch(err => {
          Toast(err);
        });
    },
    handleSearchInput(type, cardNo) {
      this[type].search = (cardNo || "").replace(/[^\d]+/g, "");
    },
    handleCardNoItemClick(type, cardNo) {
      this[type].selected = cardNo;
      this.$emit("change", this[type].selected);
    },
    // 优选卡号刷新点击
    async handleRefresh() {
      this.beauty.loading = true;
      let searchRes = await this.getBeauty();
      this.beauty.loading = false;
      // 请求失败
      if (searchRes === null) {
        // 不显示上次请求结果
        if (!this.showLastListBeauty) {
          this.beauty.list = [];
          this.beauty.total = 0;
        }
        return;
      }
      // 请求返回成功
      if (!Array.isArray(searchRes)) {
        this.beauty.total = 0;
        this.beauty.list = [];
      } else {
        this.beauty.list = searchRes;
        this.beauty.total = searchRes.length;
      }
      this.checkFirst("beauty");
    }
  }
};
</script>
<style lang="less">
.cardno-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
}
.cardno-item {
  display: flex;
  flex: 0 0 49%;
  height: 38px;
  margin-bottom: 8px;
  cursor: pointer;
  &:nth-child(2n + 1) {
    margin-right: 2%;
  }
  &.selected {
    .wrapper {
      &::after {
        border-color: #1167b9;
      }
    }
  }
  .wrapper {
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
    &::after {
      transition: color 200ms ease;
      border-radius: 5px;
    }
  }
  .cardno {
    display: inline-block;
    font-size: 14px;
    height: 38px;
    line-height: 38px;
    color: #333;
  }
  .price {
    display: inline-block;
    float: right;
    font-size: 14px;
    height: 38px;
    line-height: 38px;
    color: #333;
  }
}
.comp-cardno-choose {
  .van-tabs__wrap.van-hairline--top-bottom {
    &::after {
      border-width: 0 !important;
    }
  }
  .van-tabs__wrap {
    max-width: 200px;
  }
  .custom {
    .cardno-list {
      .cardno-list();
    }
    &-desc {
      margin-bottom: 10px;
      color: #f81a00;
      font-size: 12px;
      line-height: 1.4;
    }
    &-cardno-item {
      .cardno-item();
    }
    .van-search {
      width: 100%;
      padding-left: 0;
      padding-right: 0;
    }
  }
  .beauty {
    margin-top: 10px;
    .cardno-list {
      .cardno-list();
    }
    &-cardno-item {
      .cardno-item();
    }
    .footer {
      width: 100%;
      .beauty-refresh {
        background: #fff;
        color: #2a90fe;
        border-color: #fff;
      }
    }
  }
  // list-default组件样式
  .list-default {
    width: 100%;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
    .image {
      width: 70px;
      height: auto;
    }
    .text {
      margin-top: 10px;
      font-size: 12px;
      color: #a9a9a9;
    }
  }
}
</style>
