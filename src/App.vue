<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="default"></router-view>
    </transition>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import { SET_THEME_IMG_PATH } from "Store/mutation-types";
export default {
  name: "app",
  data() {
    return {
      transitionName: ""
    };
  },
  created() {
    this.cancleShare();
  },
  mounted() {
    document.getElementById("app").className = "theme-2A90FE";
    this.initTheme();
    this.removeIndexLoading();
  },
  computed: {
    key() {
      return this.$route.path + Math.random();
    }
  },
  watch: {
    $route(to, from) {
      if (to.meta.index !== undefined && from.meta.index !== undefined) {
        if (to.meta.index > from.meta.index) {
          this.transitionName = "slide-right";
        } else if (to.meta.index < from.meta.index) {
          this.transitionName = "slide-left";
        } else {
          this.transitionName = "";
        }
      }
    }
  },
  methods: {
    ...mapMutations([SET_THEME_IMG_PATH]),
    removeIndexLoading() {
      const indexLoading = document.getElementById("indexLoading");
      if (indexLoading) {
        indexLoading.parentNode.removeChild(indexLoading);
      }
    },
    initTheme() {
      document.getElementById("app").className = "theme-2A90FE";
      this.SET_THEME_IMG_PATH("img2");
      // setTimeout(() => {
      //   this.SET_THEME_IMG_PATH("img2");
      // }, 4000);
    },
    onBridgeReady() {
      window.WeixinJSBridge.call("hideOptionMenu");
    },
    cancleShare() {
      if (typeof WeixinJSBridge === "undefined") {
        if (document.addEventListener) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            this.onBridgeReady,
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", this.onBridgeReady);
          document.attachEvent("onWeixinJSBridgeReady", this.onBridgeReady);
        }
      } else {
        this.onBridgeReady();
      }
    }
  }
};
</script>
<style scoped lang="less">
div#app {
  width: 100%;
  height: 100%;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  top: 0px;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.slide-left-enter {
  transform: translate3d(-100%, 0, 0);
}
.slide-left-leave-active {
  // transform: translate3d(100%, 0, 0);
}
.slide-right-enter {
  transform: translate3d(100%, 0, 0);
}
.slide-right-leave-active {
  // transform: translate3d(-100%, 0, 0);
}
</style>
