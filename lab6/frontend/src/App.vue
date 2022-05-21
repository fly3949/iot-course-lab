<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column prop="random" label="随机数" />
    </el-table>
    <el-button type="primary" @click="insertOne">Insert One</el-button>
    <el-button type="primary" @click="startAutoInsert">Start Auto Insert</el-button>
    <div id="chart" style="height: 300px; width: 600px" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import * as echarts from "echarts";

const tableData = ref([]);

async function refresh() {
  const { data } = await axios.get("/api/user");

  tableData.value = data.data;
  await updateChart();
}

refresh();

async function insertOne() {
  const random = Math.round(Math.random() * 10000);
  await axios.post("/api/user", {
    name: `用户${random}`,
    createdAt: Date.now(),
    random,
  });
  await refresh();
}

function startAutoInsert() {
  setInterval(() => {
    insertOne();
  }, 3000);
}

function updateChart() {
  const chart = echarts.init(document.getElementById("chart"));
  const option = {
    xAxis: {
      type: "category",
      data: [...Array(tableData.value.length).keys()],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: tableData.value.map((e) => e.random),
        type: "line",
      },
    ],
  };
  chart.setOption(option);
}
</script>
