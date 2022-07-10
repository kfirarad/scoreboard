<template>
  <div
    class="border-8 border-gray-200 00 flex text-xl leading-10 font-Open-Sans rounded-sm"
    style="width: 560px"
  >
    <div
      class="w-48 text-center text-bold"
      :style="{
        background: data.home_team.color_1,
        color: data.home_team.color_2,
      }"
    >
      {{ data.home_team.name }}
    </div>
    <div class="bg-black text-white w-12 text-center">
      {{ data.home_team.score }}
    </div>
    <div class="bg-white w-1"></div>
    <div class="bg-black text-white w-12 text-center">
      {{ data.away_team.score }}
    </div>
    <div
      class="w-48 text-center"
      :style="{
        background: data.away_team.color_1,
        color: data.away_team.color_2,
      }"
    >
      {{ data.away_team.name }}
    </div>
    <div class="text-center w-20 bg-white">{{ clock }}</div>
  </div>
</template>

<script setup lang="ts">
import { def } from "@vue/shared";
import { defineProps } from "vue";

const { data, clock } = defineProps(["data", "clock"]);
</script>
