<template>
  <div :class="className ? `top-title ${className}` : 'top-title'">
    <img src="~Assets/img/phone.png" alt="" />
    <p>手机号</p>
    <span>{{ userPhone }}</span>
  </div>
</template>
<script>
export default {
  name: "TopTitle",
  props: {
    userPhone: String,
    className: String
  }
};
</script>
<style scoped lang="less">
.top-title {
  width: 100%;
  display: flex;
  height: 1.61rem;
  align-items: center;
  padding-left: 0.87rem;
  padding-right: 0.97rem;
  box-sizing: border-box;
  font-size: 0.38rem;
  font-family: Microsoft YaHei;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  img {
    width: 0.28rem;
    height: auto;
  }
  p {
    text-indent: 8px;
  }
  span {
    flex: 1;
    text-align: right;
  }
}
</style>
