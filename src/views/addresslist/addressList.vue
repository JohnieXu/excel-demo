<!-- 首页 -->
<template>
  <div class="address-page">
    <div class="address-content">
      <div class="address-item" v-for="(item, index) in addrList" :key="index">
        <div class="address-info" @click="selectAddr(item)">
          <div class="addr">
            <div class="info">
              <div class="name">收货人：{{ item.name }}</div>
              <div class="tel">{{ item.telephone }}</div>
            </div>
            <div class="adress">
              <div class="default-word" v-if="item.defaultFlag == 1">
                <img
                  :src="require(`../../assets/img2/default-icon.png`)"
                  alt=""
                />
              </div>
              <div>
                {{ item.province }}{{ item.city }}{{ item.district
                }}{{ item.addrDetail }}
              </div>
            </div>
          </div>
          <div class="editAddr">
            <span @click.stop="goAddressAdd(item)">编辑</span>
          </div>
        </div>
      </div>
    </div>
    <div class="address-btn-box">
      <div class="address-btn" @click="goAddressAdd('')">添加收货地址</div>
    </div>
    <!-- <van-popup
      v-model="isShowDialog"
      closeable
      position="bottom"
      round
      :lock-srcoll="false"
      :style="{ height: '5.68rem', overflow: 'hidden' }"
    >
      <div class="agree-content">
        您将在农行第三方合作伙伴（天喻信息）页面填写收货地址信息，若已知晓并同意，请继续。
      </div>
      <div class="agree-btn" @click="goAddress">同意并继续填写地址</div>
    </van-popup> -->
  </div>
</template>
<script>
import { setStore as setStoreLocal } from "Utils/localstore";
import { appId } from "Utils/appconfig.js";
import { queryUserAddrList } from "Api/order";
import { mapGetters } from "vuex";
/**
 * query: {
 *   checkid: string;  // 被选中的地址id, 修改删除要实时更新
 * }
 * 跳出页面：
 *  返回确认订单页面-> $router.push('/suborder')
 *  进入编辑页面-> $router.push('/addressEdit')
 */
export default {
  data() {
    return {
      addrList: [],
      checkid: ""
      // isShowDialog: false
    };
  },
  computed: {
    ...mapGetters(["openId"])
  },
  created() {
    this.getAddrList();
    this.checkid = this.$route.query.checkId;
  },
  methods: {
    goAddressAdd(item) {
      this.setStoreAddrInfo(item);
      if (!item.id) {
        this.$router.push({
          path: "/addressAdd"
        });
      } else {
        this.$router.push({
          path: "/addressEdit",
          query: {
            id: item.id,
            checkid: this.checkid
          }
        });
      }
    },
    selectAddr(item) {
      // this.SET_ADDRESS({ ...item })
      this.setStoreAddrInfo(item);
      this.$router.push({
        path: "/suborder",
        query: {
          orginPage: "addrPage"
        }
      });
      // this.$router.back()
    },
    async getAddrList() {
      const res = await queryUserAddrList({
        openid: this.openId
      });
      console.log(res);
      this.addrList = res.body ? res.body.userAddrBankList : {};
        const item = this.addrList.filter(v => v.id == this.checkid) //eslint-disable-line
      if (item && item.length === 1) {
        this.adItem = item[0];
      }
      this.setStoreAddrInfo(this.adItem);
    },
    // 存储本地地址
    setStoreAddrInfo(item) {
      console.log(item);
      if (item) {
        setStoreLocal(appId + "AddressData", item);
      }
    }
    // 前往地址列表页面
    // goAddress() {
    //   this.isShowDialog = false;
    //   setTimeout(() => {
    //     this.$router.push({
    //       path: "/addressAdd"
    //     });
    //   }, 500);
    // }
  }
};
</script>
<style lang="less" scoped>
.address-page {
  position: relative;
  background: #f4f4f4;
  width: 100%;
  height: 100%;
  // padding-top: .2667rem;
  overflow: auto;
  // padding-bottom: 2.9rem;
  .address-content {
    margin-bottom: 3rem;
    min-height: 70vh;
    .address-item {
      position: relative;
      width: 100%;
      // height: 2.56rem;
      background: #ffffff;
      padding: 0.4267rem;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      &::after {
        position: absolute;
        content: "";
        left: 0.4267rem;
        bottom: 0;
        width: 9.6rem;
        height: 1px;
        background: rgba(0, 0, 0, 0.1);
      }
      &:last-child {
        &::after {
          background: none;
        }
      }
      .address-img {
        img {
          width: 0.8533rem;
          height: 0.8533rem;
        }
      }
      .address-info {
        width: 9.1467rem;
        padding-top: 0.1333rem;
        display: flex;
        .info {
          position: relative;
          width: 7.36rem;
          // height: 0.56rem;
          font-size: 0.4267rem;
          font-weight: 400;
          color: #333333;
          line-height: 0.56rem;
          display: flex;
          margin: 0 0.4267rem 0.16rem 0;
          .name {
            // max-width: 2.5867rem;
            margin-right: 0.2133rem;
          }
          .tel {
            margin-right: 0.2133rem;
          }
          .default-word {
            display: flex;
            align-items: center;
            margin-right: 0.2133rem;
            flex-shrink: 0;
            img {
              width: 0.7467rem;
              height: 0.4267rem;
            }
          }
        }
        .adress {
          width: 7.4933rem;
          // height: 1.12rem;
          font-size: 0.3733rem;
          font-weight: 400;
          color: #999;
          line-height: 0.54rem;
          word-break: break-all;
          display: flex;
          align-items: center;
          .default-word {
            width: 1.5467rem;
            height: 0.4267rem;
            margin-right: 0.2133rem;
            flex-shrink: 0;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .editAddr {
        position: relative;
        width: 1.43rem;
        display: flex;
        align-items: center;
        font-size: 0.3733rem;
        color: #666;
        padding-left: 0.2133rem;
        span {
          position: relative;
          display: inline-block;
          width: 1.64rem;
          padding-left: 0.2133rem;
          text-align: right;
          &::after {
            position: absolute;
            content: "";
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 0.0267rem;
            height: 0.48rem;
            background: #e5e5e5;
          }
        }
        img {
          width: 0.4267rem;
          height: 0.4267rem;
          margin-right: 0.0267rem;
        }
      }
    }
  }
  .address-btn-box {
    position: sticky;
    left: 0;
    bottom: 0;
    // transform: translateX(-50%);
    width: 100%;
    height: 2.8rem;
    // background: #fff;
    padding-top: 0.7rem;
  }
  .address-btn {
    width: 9.36rem;
    height: 1.2267rem;
    background: linear-gradient(90deg, #0c7de1 0%, #0065be 100%);
    border-radius: 1.3867rem;
    font-size: 0.4533rem;
    font-weight: 400;
    color: #ffffff;
    line-height: 1.2267rem;
    text-align: center;
    margin: 0 auto;
  }
}
.one-ellispsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.two-ellispsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
/deep/ .van-popup--bottom.van-popup--round {
  padding: 1.56rem 0.4267rem 0;
}
/deep/ .van-popup__close-icon--top-right {
  left: 0.32rem;
  top: 0.4267rem;
}
.agree-content {
  padding: 0 0.24rem;
  height: 1.2267rem;
  font-size: 0.4rem;
  font-weight: 400;
  color: #000000;
  line-height: 0.5667rem;
  margin-bottom: 1.0867rem;
}
.agree-btn {
  width: 9.1467rem;
  height: 1.2267rem;
  background: linear-gradient(90deg, #0c7de1 0%, #0065be 100%);
  border-radius: 1.3867rem;
  font-size: 0.4533rem;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.2267rem;
  text-align: center;
}
</style>
