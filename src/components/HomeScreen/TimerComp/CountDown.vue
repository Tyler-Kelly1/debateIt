<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const timeRemaining = ref("");

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

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  // 3. Format with leading zeros
  timeRemaining.value = `${hours}h ${minutes}m ${seconds}s`;
};

let timerInterval;
onMounted(() => {
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
});

onUnmounted(() => clearInterval(timerInterval));
</script>

<template>
  <div class="countdown-container">
    <span class="label">NEXT TOPIC IN:</span>
    <span class="timer">{{ timeRemaining }}</span>
  </div>
</template>

<style scoped>
.countdown-container {
  padding: 10px;
  background: #1e1e1e;
  color: #10c84f; /* Match your green theme */
  font-family: 'Courier New', Courier, monospace;
  border-radius: 8px;
  text-align: center;
}
.timer {
  font-weight: bold;
  font-size: 1.2rem;
  display: block;
}
</style>