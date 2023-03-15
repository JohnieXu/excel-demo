<template>
  <div class="container">
    <net-error :reload="onRefresh" v-if="netError"></net-error>
    <div v-else class="home"></div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import NetError from "Components/neterror";
import { getFieldUrl } from "Api";
import MobileDetect from "mobile-detect";
import { appId } from "Utils/appconfig";
import { setStore } from "Utils/localstore";
import { Toast } from "vant";

export default {
  name: "ViewRedirectField",
  components: {
    NetError
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["netError"])
  },
  created() {
    this.getfieldurl();
  },
  methods: {
    onRefresh() {
      this.getfieldurl();
    },
    isWifi() {
      // const obj = {
      //   redirectUrl:
      //     "https://wxbank-it-dz.ebanktest.com.cn/wbank/dz/index.html?ticket_data=eyJ2ZXIiOiIxLjAuMC4xIiwiZW5jX2RhdGEiOiJQOHNCQTJCc0QyeGlSRkFxQzZLWW5OTDJoaGpnaVRwZjJCUnBXY092VWx5cEJVM1ArSS9kdnQxemlTMEo4cldiWjZBMlJpNWg4ZnU1UE1QRmdNaEZnbnh5NXMyUFQ0VjRwd05RUVZWcGZxZDlUZmVrTEUrWDBKOE1BRjgxMHY2MkNBVk9aWEE1LzNvSk1LT2xZQ0c5UDUvLzlmMHRLOU5NMXFOdVkvcHQvNFJOQWlsY0xaOXBzUDYzUzlZQXBLRE8yWE94cStiSWZPT3F2bzNBQm9BbG5WaUVCazF3c29TYnR5SG9sWnFSckhVPSIsImVudl9kYXRhIjoiZXlKdmN5STZJa0Z1WkhKdmFXUlBVeUlzSW1selgzZHBabWtpT2lJMFJ5SXNJbUZ3Y0Y5MlpYSWlPaUl4TGpBaUxDSmljbTkzYzJWeUlqb2lRMmh5YjIxbElpd2laVzUyWDNSNWNHVWlPaUl3TXlJc0ltSnlZVzVrSWpvaVRtVjRkWE1pZlE9PSIsImFsZyI6IjBaTEpiZEhTK2gzeHlXQVo4dmFoNVRWaWJ3bW00L2ZiY1NkaklmdU92dk1qa1Fxcit4bEtpRy83bkdBanYraS9qWnNMSmp1WmpLWTAwVXpMaXd0Ym1VSDhIVzZnZ2pqQUNRKzRhY3pTK0Zjd3dhL0l4RWw1SWFVOXlqV1J0SS9WUnhjbUQ5bmxVUGFDM0FHQ2VQUGFuNjR5eCtoZGc4R2ZzNmNIR0o3bktqcDg9IiwidGlja2V0X3NpZ24iOiIyM0MyRTc3OTdFQzVCRTBCNkM0Njc4QTM3NjA3ODI4Rjk1MDVFMTk3Iiwibm9uY2VzdHIiOiJmNmQ1OTAwZS1jNmZhLTQ0NGMtYmNlNC1hZTRiOTg1N2M1MzciLCJ0aW1lc3RhbXAiOiIxNTk2NDMyMzQzNDMyIn0=&appId=X011809C011&path=handleCard&openId=oSK5a5OLpewuwH8rZgOFlETTiJwg&wxCode=111#/thirdParty/entry"
      // };
      // console.log(obj);
      try {
        let wifi = true;
        let ua = window.navigator.userAgent;
        let con = window.navigator.connection;
        // 如果是微信
        if (/MicroMessenger/.test(ua)) {
          if (ua.indexOf("WIFI") >= 0) {
            return "wifi";
          } else {
            wifi = "4G";
          }
          // 如果支持navigator.connection
        } else if (con) {
          let network = con.type;
          if (network !== "wifi" && network !== "2" && network !== "unknown") {
            wifi = "4G";
          }
        }
        return wifi;
      } catch (e) {
        return "4G";
      }
    },
    saveTaskInfo() {
      setStore("fromUrl", location.href);
      const {
        openid = "", // 推荐人openid
        taskCode = "" // 推荐任务码
      } = this.$route.query;
      if (openid) {
        setStore(appId + "_referrer", openid);
      }
      if (taskCode) {
        setStore(appId + "_taskCode", taskCode);
      }
    },
    async getfieldurl() {
      try {
        const {
          openid = "", // 推荐人openid
          taskCode = "", // 推荐任务码
          telephone = ""
        } = this.$route.query;
        if (!openid || !taskCode) {
          Toast.fail("地址栏缺少必要参数");
          return;
        }
        this.saveTaskInfo();
        const md = new MobileDetect(window.navigator.userAgent);
        const brand = md.mobile();
        const os = md.os();
        const browser = md.userAgent();
        const wifi = this.isWifi();

        const res = await getFieldUrl({
          openId: openid,
          envType: "03",
          appVer: "1.0",
          os,
          brand,
          browser,
          wifi,
          taskCode,
          telephone
        });
        if (res && res.returnCode === "SUCCESS") {
          const { redirectUrl = "" } = res.body;
          window.location.href = redirectUrl;
        }
      } catch (error) {
        Toast.fail(error);
      }
    }
  }
};
</script>

<style lang="less"></style>
