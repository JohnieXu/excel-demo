<template>
  <div class="container">
    <net-error :reload="onRefresh" v-if="netError"></net-error>
    <div v-else class="home">
      <load-modal :show="!netError && showOverlay"></load-modal>
      <div @click="qlogin" class="version" v-if="showVersion === '1'">
        V{{ version }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import NetError from "Components/neterror";
import LoadModal from "Components/loadmodal";
import { merNo, merType, big_data_code, appId } from "Utils/appconfig.js";
import { login } from "Mixin/login.js";
import { indexDoc, isInWxEnv } from "Utils/appconfig";
export default {
  name: "ViewRedirectHome",
  mixins: [login],
  components: {
    NetError,
    LoadModal
  },
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
    if (isInWxEnv) {
      this.checkPage(this.imgHanldle);
    } else {
      this.checkPageInApp();
    }
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
        merType,
        bigDataCode: big_data_code,
        imageSize: [0, 10],
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
    // 测试用
    qlogin() {
      this.SET_AUTHORIZATION("");
      this.SET_OPEN_ID("o0Nxy0carF9LMbavCKVnkvjQDauM");
      this.quicklogin(
        {
          openid: this.openId
          // applyDetail:
          //"Y5G2Ob0E1bTRG48Eyds4qTzb%2BSA9ED8ciKAD0azJPmfV83SrgZyAkkCJq9nf7ayHjkhJB5r0RkizhSNywXYQewi5zQ3OSB904ENybXmdpDm%2FzBpxBodxAipcgSf09hvJ3rLMOtIybK9WQ6RzmKFL0hHdTQD6MG11qR3ZbGrXPdxNqb9RPtOoPBOe8yLe2L5%2FMynpmt%2F3u2uQ868uWTH8lbDw82LEnPWaCoSh66OQ%2FFD7JEGqM8Q%2B5o8aioMD0yb8cG0A5ZEA3R6rcjeX5JWMbl58ooFr%2FzrzaBkOQB1Y75XwutsXoKuILqCme7pM79goHo0WIyIw6sBj5ER4GPNesw%3D%3D"
          // "BdJayDLnXyAYwnCqlqu2fHri8gybWGdT7%2FiwXm%2F9epwurJgYAscDNNAUousjwEuNo2c9Li4acCnvlKyDDvZbmDjDqdLXc3qFVMbWJmDp1qLyx9thm%2FVTPLjb14tv53%2BtID03%2Bzx%2Bte%2FU4L63H80tK4MyH1%2FJVHCksXfWXK4S64G%2FLEkrA3aRCzFzq9qcNgxkpECUAJ8d546dbXUa3gkN2W2eQt3xztkG84kylkuMZLg6bSqBqquFn4cDDBibk4u%2FdikMlIggEYH1L0MGnQSPHqIfzFdplrgpNU5q8C2Rwd5BoRdQ4AVJZTgg0T4%2BpAfsY39fyuEtwNlTEUg%2BF1xemw%3D%3D"
        },
        this.imgHanldle
      );
    },
    onRefresh() {
      this.checkPage(this.imgHanldle);
    }
  }
};
</script>

<style lang="less">
.van-toast {
  width: 120px;
}
.container {
  width: 100%;
  height: 100%;
}
.home {
  width: 100%;
  height: 100%;
  background-color: white;
  text-align: center;
  &-banner {
    position: relative;
    img.banner {
      width: 100%;
      height: auto;
    }
    img.order {
      position: absolute;
      right: 0;
      top: 1.56rem;
      width: 2.65rem;
      height: auto;
    }
    ol {
      width: 100%;
      top: 0.8rem;
      position: absolute;
      display: flex;
      align-items: center;
      flex-direction: column;
      img {
        width: 1.48rem;
        height: 1.48rem;
        border-radius: 50%;
        border: 2px solid white;
        margin-bottom: 0.4rem;
      }
      li:last-child {
        width: 80%;
        font-size: 0.42rem;
        line-height: 0.44rem;
        color: white;
        font-family: Microsoft YaHei;
        font-weight: 400;
      }
    }
  }
  &-lead {
    width: 90%;
    height: auto;
    transform: translateY(-1.22rem);
  }
  .version {
    position: fixed;
    left: 0;
    bottom: 20px;
    right: 0;
    text-align: center;
  }
}
</style>
