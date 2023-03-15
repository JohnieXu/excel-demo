/* eslint-disable */
import Vue from 'vue'

export const priceFilter = value => {
    if (typeof value === 'undefined') { return null }
    value = Number(value)
    if (Number.isNaN(value)) { return null }
    return (value / 100).toFixed(2)
}

export const priceFilterInt = value => {
  if (typeof value === 'undefined') { return null }
    value = Number(value)
    if (Number.isNaN(value)) { return null }
    return (value / 100).toFixed(0)
}

/**
 * 计算商品实际价格（优惠后价格）
 * @param {Object} skuInfo SKU详情
 * @param {Number} goodsPrice goodsPrice
 */
export const getGoodsPrice = (skuInfo, goodsPrice) => {
    if (!skuInfo) { return Number(goodsPrice || 0) }
    if (skuInfo.skuPrice) {
        return Number(skuInfo.skuPrice)
    } else if (skuInfo.skuFavorablPrice) {
        return Number(skuInfo.skuFavorablPrice)
    } else {
        return Number(goodsPrice || 0)
    }
}

Vue.filter('priceFilter', priceFilter)
Vue.filter('priceFilterInt', priceFilterInt)
