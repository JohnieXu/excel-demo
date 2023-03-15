"use strict";

import axios from "axios";
import store from "Store";
import {
  SET_NET_ERROR,
  SET_AUTHORIZATION,
  SET_OVERLAY
} from "Store/mutation-types";
import { removeStore } from "../utils/sessionstore";
import { getStore } from "../utils/localstore";
import { appParams, merNoNo } from "./appconfig";
import { signCreater, getMsgId } from "./requestconfigfunction";
import { Toast } from "vant";
import { createContent, resolveContent } from "./tripledes3";
const is_encript = process.env.VUE_APP_IS_ENCRIPT === "1";
axios.defaults.timeout = 30000;
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

function handleParams(data = {}) {
  const body = is_encript ? createContent(data) : { ...data };
  const msgId = getMsgId();
  const authorization = store.state.authorization;
  let params = { ...appParams, merNoNo, authorization, msgId, body };
  is_encript && (params = { ...params, encodeMethod: "1", signMethod: "1" });
  const sign = signCreater(params);
  return {
    ...params,
    sign
  };
}

axios.interceptors.request.use(
  config => {
    console.log(config);
    const data = handleParams(config.data);
    config.data = data;
    if (!store.state.showOverlay) {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 请求网络失败 回调先走拦截器 => 再走 post.catch => 再走页面的 try-catch
// 请求返回code不对 进拦截器response后=> 直接走 post.catch => 再走页面的 try-catch
// 错误提示 统一处理 不需要 页面进行额外处理 包括token失效,断网

axios.interceptors.response.use(
  response => {
    store.commit(SET_NET_ERROR, false);
    Toast.clear();
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      // 只要有返回 就做解密
      const data = is_encript
        ? {
            ...response.data,
            body: response.data.body
              ? resolveContent(response.data.body)
              : response.data.body
          }
        : response.data;
      if (data.returnCode === "INVALIDTOKEN") {
        // 失效重走流程
        store.commit(SET_AUTHORIZATION, null);
        removeStore("authorization");
        if (getStore("fromUrl")) {
          location.href = getStore("fromUrl");
        } else {
          Toast.fail("token失效，请重新进入页面");
        }
      }
      return data.returnCode === "SUCCESS"
        ? Promise.resolve({ data })
        : Promise.reject({ data });
    } else {
      return Promise.reject(response);
    }
  },
  // 网络请求失败会走这里
  error => {
    console.log("error:", error);
    store.commit(SET_NET_ERROR, true);
    Toast.fail("网络异常，请重试");
    return Promise.reject({
      data: { returnCode: "NETERROR", returnDes: "网络异常，请重试" }
    });
  }
);

export default {
  post(url, params) {
    return new Promise(resolve => {
      axios
        .post(url, params)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          store.commit(SET_OVERLAY, false);
          if (
            err.data.returnDes == null ||
            err.data.returnDes.length == 0 ||
            err.data.returnDes.length > 50
          ) {
            Toast.fail("服务器处理失败");
          } else {
            Toast.fail(err.data.returnDes);
          }
          // Toast.fail(err.data.returnDes);
          resolve(err.data);
        });
    });
  },
  get(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: params
        })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          // Toast.fail(err.data.returnDes);
          if (
            err.data.returnDes == null ||
            err.data.returnDes.length == 0 ||
            err.data.returnDes.length > 50
          ) {
            Toast.fail("服务器处理失败");
          } else {
            Toast.fail(err.data.returnDes);
          }
          reject(err.data);
        });
    });
  }
};
