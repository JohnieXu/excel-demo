<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="default"></router-view>
    </transition>
  </div>
</template>
<script>
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
    removeIndexLoading() {
      const indexLoading = document.getElementById("indexLoading");
      if (indexLoading) {
        indexLoading.parentNode.removeChild(indexLoading);
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
