<template>
  <div>
    <Scoreboard :data="data" :clock="clock" />
    <div class="mt-10 w-96">
      <fieldset class="border m-4 p-4">
        <legend>בקרי משחק</legend>

        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="startHalf(Half.First)"
        >
          התחל מחצית 1
        </button>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="startHalf(Half.Second)"
        >
          התחל מחצית 2
        </button>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="stop()"
        >
          עצור
        </button>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="clock = '00:00'"
        >
          אפס
        </button>
      </fieldset>

      <fieldset class="border m-4 p-4">
        <legend>קבוצה ביתית</legend>

        <label class="block">
          <span class="text-gray-700">שם</span>
          <input
            type="text"
            v-model="data.home_team.name"
            class="form-input mt-1 block w-full"
            :disabled="data.currentState === GameState.InProgress"
          />
        </label>
        <label class="block">
          <span class="text-gray-700">צבעים</span>
          <div class="flex">
            <input
              type="color"
              v-model="data.home_team.color_1"
              class="mt-1 block w-1/2"
              :disabled="data.currentState === GameState.InProgress"
            />
            <input
              type="color"
              v-model="data.home_team.color_2"
              class="mt-1 block w-1/2"
              :disabled="data.currentState === GameState.InProgress"
            />
          </div>
        </label>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="data.home_team.score = data.home_team.score + 1"
        >
          שער+1
        </button>
        <button
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          @click="data.home_team.score = data.home_team.score - 1"
        >
          שער-1
        </button>
      </fieldset>

      <fieldset class="border m-4 p-4">
        <legend>קבוצה אורחת</legend>

        <label class="block">
          <span class="text-gray-700">שם</span>
          <input
            type="text"
            v-model="data.away_team.name"
            class="form-input mt-1 block w-full"
            :disabled="data.currentState === GameState.InProgress"
          />
        </label>
        <label class="block">
          <span class="text-gray-700">צבעים</span>
          <div class="flex">
            <input
              type="color"
              v-model="data.away_team.color_1"
              class="mt-1 block w-1/2"
              :disabled="data.currentState === GameState.InProgress"
            />
            <input
              type="color"
              v-model="data.away_team.color_2"
              class="mt-1 block w-1/2"
              :disabled="data.currentState === GameState.InProgress"
            />
          </div>
        </label>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="data.away_team.score = data.away_team.score + 1"
        >
          שער+1
        </button>
        <button
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          @click="data.away_team.score = data.away_team.score - 1"
        >
          שער-1
        </button>
      </fieldset>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import Scoreboard from './components/Scoreboard.vue'
import dataService from './services/data'
import {onSnapshot } from "firebase/firestore";

enum GameState {
  NotStarted,
  InProgress,
  Finished
}

enum Half {
  First,
  Second
}

const data = reactive({
  home_team: {
    name: undefined,
    color_1: undefined,
    color_2: undefined,
    score: 0,
  },
  away_team: {
    name: undefined,
    color_1: undefined,
    color_2: undefined,
    score: 0,
  },
  currentHalf : Half.First,
  halfStartedTimeStamp: Date.now(),
  currentState: GameState.NotStarted,
});

const clock = ref("00:00");

onMounted(async () => {
  dataService.get().then(fsData => {
    Object.assign(data, fsData)
  })
  dataService.listen(
    fsData => {
    Object.assign(data, fsData)
  }
  );

  setInterval(() => {
    if(data.currentState === GameState.InProgress) {
    const now = Date.now();
    const diff = now - data.halfStartedTimeStamp;
    const base = data.currentHalf === Half.First ? 0 : 45;
    const minutes = (base + Math.floor(diff / 1000 / 60)).toString();
    const seconds = (Math.floor(diff / 1000) % 60).toString();
    clock.value = `${minutes.padStart(2,'0')}:${seconds.padStart(2,'0')}`;
    }
  }, 1000);
});

const startHalf = (half: Half) => {
  data.currentHalf = half;
  data.halfStartedTimeStamp = Date.now();
  data.currentState = GameState.InProgress;
}

const stop = () => {
  data.currentState = GameState.Finished;
}

watch( data, (newData, oldData) => {
  dataService.save(newData)
}, { deep: true });
</script>

<style></style>
