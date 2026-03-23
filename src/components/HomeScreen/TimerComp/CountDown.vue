<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const timeRemaining = ref("");
const hourGlass = ref("hourglass_bottom")

const updateTimer = () => {
  const now = new Date();

  // 1. Get current time in Arkansas (Central Time)
  const centralTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false
  }).formatToParts(now);

  // 2. Calculate hours/mins/secs until midnight
  const h = parseInt(centralTime.find(p => p.type === 'hour').value);
  const m = parseInt(centralTime.find(p => p.type === 'minute').value);
  const s = parseInt(centralTime.find(p => p.type === 'second').value);

  // Total seconds in a day (86400) minus seconds passed today
  let diff = 86400 - (h * 3600 + m * 60 + s);

  let hours = Math.floor(diff / 3600);
  let minutes = Math.floor((diff % 3600) / 60);
  let seconds = diff % 60;

  // 3. Format with leading zeros

  if(hours < 10){
    hours = `0${hours}`
  }
  if(minutes < 10){
    minutes = `0${minutes}`
  }
  if(seconds < 10){
    seconds = `0${seconds}`
  }

  timeRemaining.value = `${hours}:${minutes}:${seconds}`;

  // 4. Update hour glass
  if(hourGlass.value === "hourglass_top"){
    hourGlass.value = "hourglass_bottom";
  }
  else{
    hourGlass.value = "hourglass_top";
  }
};

let timerInterval;
onMounted(() => {
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
});

onUnmounted(() => clearInterval(timerInterval));
</script>

<template>
  <header class="timer w-full flex flex-col gap-2">
    <div class="flex items-center justify-between border-b-3 border-on-background pb-2">
      <div class="flex items-center gap-2">
      </div>
    </div>
    <div class="bg-black text-white p-4 flex items-center justify-center">
      <h1 class="text-3xl font-black tracking-tighter font-headline mr-3">{{timeRemaining}}</h1>
      <span class="text-5xl material-symbols-outlined white">{{hourGlass}}</span>
    </div>
  </header>
</template>

<style scoped>

.timer {
  font-family: 'Space Grotesk', sans-serif;
  -webkit-font-smoothing: antialiased;
}

</style>