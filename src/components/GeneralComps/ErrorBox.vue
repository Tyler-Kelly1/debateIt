<script setup lang="ts">

</script>

<template>
  <div class="flex absolute bottom-0 left-0 h-full w-full backdrop-blur-md z-20 items-center justify-center">

    <div class="w-80">

      <div class="bg-disagree p-3 border-b-2 border-black flex items-center justify-between">
        <span class="text-white font-black text-xs uppercase tracking-widest">CRITICAL_EXCEPTION</span>
        <span class="material-symbols-outlined text-white text-sm" style="font-variation-settings: 'FILL' 1;">warning</span>
      </div>

      <!-- Error Body -->
      <div class="p-8 bg-white relative">
        <!-- Glow Accent -->
        <div class="absolute inset-0 bg-error/5 pointer-events-none"></div>
        <div class="relative z-10 text-center space-y-4">
          <h2 class="text-2xl font-black text-error leading-tight uppercase tracking-tighter">
            ACCESS_DENIED // AUTHENTICATION_FAILED
          </h2>
          <p class="text-[10px] font-bold text-black uppercase tracking-[0.2em] leading-relaxed">
            <slot></slot> <br/>
            <span class="bg-black text-white px-2 py-0.5 mt-2 inline-block">ACTION_FAILED</span>
          </p>
        </div>
      </div>

      <!-- Error Footer / Interaction -->
      <div class="p-4 bg-black">
        <button @click="$emit('closeError')" class="w-full border-2 border-white py-2 text-white font-black text-[10px] uppercase tracking-widest">
          Try again
        </button>
      </div>

    </div>



  </div>
</template>

<style scoped>

</style>