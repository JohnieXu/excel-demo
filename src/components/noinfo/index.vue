<template>
  <div :class="className ? `no-info ${className}` : 'no-info'">
    <div>
      <img src="~Assets/img2/empty.png" alt="" />
      <p>{{ tipInfo ? tipInfo : "暂无更多信息" }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "NoInfo",
  props: {
    userPhone: String,
    tipInfo: String,
    className: String
  }
};
</script>
<style scoped lang="less">
.no-info {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 3rem;
    img {
      width: 4rem;
      height: auto;
      margin-bottom: 1.32rem;
    }
    p {
      font-size: 0.33rem;
      font-family: Source Han Sans CN;
      font-weight: 400;
    }
  }
}
</style>
