<template>
  <div>
    <div id="title">我是第二个子组件</div>
    <div>我要发送给父组件的值：{{ msg }}</div>
    <input v-model.trim="userName" />
    <button @click="toParent">向父组件发送信息</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "我是第二组件ddddddd",
      userName: "",
    };
  },
  methods: {
    toParent() {
      this.$emit("toParent", this.userName);
    },
  },
};
</script>
