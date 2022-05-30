<template>
  <div>
    <div>我是父组件</div>
    <div>我发送给第一个组件的信息是:{{ msg }}</div>
    <button @click="change">change</button>
    <div>第2个组件的信息是:{{ child2Msg }}</div>
    <div>
      <div id="child1">
        <ChildOne :msg="msg" />
      </div>
      <div id="child2">
        <ChildTwo @toParent="getMag" />
      </div>
    </div>
  </div>
</template>
<script>
import ChildOne from "./components/children1";
import ChildTwo from "./components/children2";

export default {
  components: {
    ChildOne,
    ChildTwo,
  },
  data() {
    return {
      msg: "我是父组件，我给你发消息",
      child2Msg: "",
    };
  },
  methods: {
    change() {
      this.msg = "aaaa";
    },
    getMag(msg) {
      this.child2Msg = msg;
      this.msg = "resend::" + msg;
    },
  },
};
</script>
