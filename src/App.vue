<template>
  <div class="w-screen">
    <Scoreboard :data="data" :clock="clock" />
    <div class="mt-10 w-screen">
      <fieldset class="border m-4 p-4">
        <legend>בקרי משחק</legend>

        <button
          class="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="startHalf(Half.First)"
        >
          התחל
        </button>
        <button
          class="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="stop()"
        >
          עצור
        </button>
        <div class="">
          <button
            class="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            @click="reset"
          >
            אפס
          </button>
          <input
            type="number"
            min="0"
            v-model="data.baseMinute"
            step="1"
            size="3"
            class="w-16"
          />
        </div>

        <button
          class="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="startHalf(Half.First)"
        >
          התחל מחצית 1
        </button>
        <button
          class="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="startHalf(Half.Second)"
        >
          מחצית 2
        </button>
      </fieldset>
      <div class="flex w-screen">
        <fieldset class="border m-4 p-4 w-1/2">
          <legend>קבוצה אורחת</legend>

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

        <fieldset class="border m-4 p-4 w-1/2">
          <legend>קבוצה ביתית</legend>

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
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import Scoreboard from "./components/Scoreboard.vue";
import dataService from "./services/data";

enum GameState {
  NotStarted,
  InProgress,
  Finished,
  Reset,
}

enum Half {
  First,
  Second,
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
  currentHalf: Half.First,
  halfStartedTimeStamp: Date.now(),
  currentState: GameState.NotStarted,
  baseMinute: 0,
});

const clock = ref(0);
const interval = ref();

onMounted(async () => {
  dataService.get().then((fsData) => {
    Object.assign(data, fsData);
  });
  dataService.listen((fsData) => {
    Object.assign(data, fsData);
  });

  interval.value = setInterval(() => {
    if (data.currentState === GameState.InProgress) {
      const now = Date.now();
      const diff = now - data.halfStartedTimeStamp;
      clock.value = diff;
    }
    if (data.currentState === GameState.Reset) {
      clock.value = 0;
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(interval.value);
  interval.value = undefined;
});

const startHalf = (half: Half) => {
  data.currentHalf = half;
  data.baseMinute = half === Half.Second ? 45 : 0;
  data.halfStartedTimeStamp = Date.now();
  data.currentState = GameState.InProgress;
};

const stop = (): void => {
  data.currentState = GameState.Finished;
};

const reset = (): void => {
  data.currentState = GameState.Reset;
};

watch(
  data,
  (newData, oldData) => {
    dataService.save(newData);
  },
  { deep: true }
);
</script>

<style></style>
