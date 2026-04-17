<script setup lang="js">
import { ref, computed } from "vue";


const props = defineProps({

  topic:{
    type: String
  }

})

const emit = defineEmits(["onSwipe"]);

const swipeCard = ref(null);
const glowLeft = ref(null);
const glowRight = ref(null);

// State
const startX = ref(0);
const currentX = ref(0);
const isDragging = ref(false);
const isFlying = ref(false);
const isResetting = ref(false);
const threshold = 120;

// Computed style for the card
const cardStyle = computed(() => {

  if (isFlying.value) {
    const flyDirection = currentX.value > 0 ? 1 : -1;

    return {
      transform: `translateX(${flyDirection * 1000}px) rotate(${flyDirection * 90}deg)`,
      opacity: 0,
      transition: 'transform 0.8s ease, opacity 0.3s'
    };

  }
  return {
    transform: `translateX(${currentX.value}px) rotate(${currentX.value / 25}deg)`,
    transition: isResetting.value ? 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none'
  };

});

function onStart(e) {
  if (isFlying.value) return;
  isDragging.value = true;
  isResetting.value = false;
  startX.value = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
}

function onMove(e) {
  if (!isDragging.value) return;
  const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  currentX.value = x - startX.value;

  // Handle Glow Opacity
  const intensity = Math.min(Math.abs(currentX.value) / threshold, 1.0);
  if (currentX.value < 0) {
    glowLeft.value.style.opacity = intensity;
    glowRight.value.style.opacity = 0;
  } else {
    glowRight.value.style.opacity = intensity;
    glowLeft.value.style.opacity = 0;
  }
}

function onEnd() {
  if (!isDragging.value) return;
  isDragging.value = false;

  if (Math.abs(currentX.value) > threshold) {
    isFlying.value = true;

    if(currentX.value > 0) {
      emit("onSwipe", true);
    }
    else{
      emit("onSwipe", false);
    }

  } else {
    isResetting.value = true;
    currentX.value = 0;
    glowLeft.value.style.opacity = 0;
    glowRight.value.style.opacity = 0;
  }
}
</script>

<template>

  <div class="main-wrapper md:m-0" @mousemove="onMove" @mouseup="onEnd" @touchmove="onMove" @touchend="onEnd">

    <div class="edge-glow glow-left" ref="glowLeft"></div>
    <div class="edge-glow glow-right" ref="glowRight"></div>

    <!-- Interaction Area -->
    <section class="perspective-container relative w-full flex flex-col items-center justify-center">

      <!-- Central Swipe Card Container -->
        <div class="swipable-card-container relative w-full max-w-[300px] md:max-w-sm aspect-[3/4.2]">




          <!-- Main Interactive Card -->
          <div ref="swipeCard" :style="cardStyle" @mousedown="onStart" @touchstart="onStart" class="swipable-card relative w-full h-full bg-brutalist-white shadow-brutal-lg flex flex-col overflow-hidden border-2 border-brutalist-black cursor-grab active:cursor-grabbing" >
            <div class="flex-grow p-8 md:p-12 flex flex-col justify-center text-center">

              <section class="w-full text-center md:mt-2 mt-w mb-10 [@media(max-height:680px)]:mb-3 [@media(max-height:680px)]:mt-5">
                <div class="max-w-4xl mx-auto">
                  <h1 class="text-2xl md:text-6xl font-black uppercase leading-[0.9] tracking-tighter mb-4">
                    "{{topic}}"
                  </h1>
                </div>
              </section>

              <div class="mb-8 md:mb-12 inline-flex mx-auto items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-primary/5 text-primary border-2 border-primary">
                <span class="material-symbols-outlined text-3xl md:text-4xl" data-icon="touch_app">touch_app</span>
              </div>
              <h2 class="text-2xl md:text-3xl font-brutal-bold uppercase mb-4 md:mb-6 leading-tight tracking-tight font-industrial"></h2>
              <p class="text-brutalist-gray-600 text-base md:text-lg font-semibold leading-snug">
                Swipe <span class="text-red-700">Left</span> to disagree, or <span class="text-green-700">Right</span> to agree.
              </p>
            </div>
            <!-- Card Footer -->
            <div class="py-6 md:py-8 bg-brutalist-black text-brutalist-white border-t border-brutalist-black flex justify-center mt-auto">
              <div class="flex items-center gap-4 md:gap-6">
                <span class="material-symbols-outlined text-lg md:text-xl animate-pulse" data-icon="chevron_left">chevron_left</span>
                <span class="dystopian-text text-[10px] md:text-[11px] font-industrial">Swipe to Decide</span>
                <span class="material-symbols-outlined text-lg md:text-xl animate-pulse" data-icon="chevron_right">chevron_right</span>
              </div>
            </div>
          </div>
        </div>

    </section>

  </div>

</template>

<style scoped>

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
body {
  font-family: 'Space Grotesk', sans-serif;
  background-color: #ffffff;
  overflow: hidden;
  touch-action: none;
  letter-spacing: -0.02em;
}
.perspective-container {
  perspective: 1200px;
}
.swipable-card-container {
  user-select: none;
  touch-action: none;
}
.swipable-card {
  transition: transform 0.1s ease-out, opacity 0.3s ease;
  transform-origin: center bottom;
}
.swipable-card.resetting {
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.swipable-card.flying {
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease;
}

.edge-glow {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 120px;
  pointer-events: none;
  transition: opacity 0.2s ease, filter 0.2s ease;
  opacity: 0;
  z-index: 10;
}
.glow-left {
  left: 0;
  background: linear-gradient(to right, rgba(255, 0, 0, 0.25), transparent);
}
.glow-right {
  right: 0;
  background: linear-gradient(to left, rgba(8, 204, 75, 0.25), transparent);
}
</style>