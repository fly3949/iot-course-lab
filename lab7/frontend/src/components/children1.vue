<template>
  <div>
    <div id="title">我是第一个子组件</div>
    <div>我接受到的父组件的消息是：{{ msg }}</div>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
    },
  },
};
</script>
