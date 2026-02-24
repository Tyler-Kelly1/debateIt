<script setup lang="ts">
import { ref } from "vue";

// 1. DATA BLUEPRINT
// Even though this is the input component, we define what a 'Take' looks like
// to ensure consistency when we send it to the parent.
interface CommentData {
  id: string;
  content: string;
  votes: number;
  lit?: boolean;
}

// 2. LOCAL STATE (Internal Variables)
// 'take' stores what the user is currently typing in the textarea.
const take = ref('')

// 'side' stores the position of the toggle switch.
// false = Disagree, true = Agree.
const side = ref(false)

// 3. EMIT DEFINITION
// This defines the "megaphone" this component uses to talk to the parent.
// We are telling Vue that this component is allowed to shout an event called 'submitTake'.
const emit = defineEmits([
  'submitTake'
])

// 4. SUBMISSION LOGIC
function handleCommentSubmit() {
  // Only submit if the user has actually typed something
  if (take.value) {

    // 'emit' sends data up the chain.
    // Argument 1: The name of the event ('submitTake')
    // Argument 2: The actual data object (The "Take")
    // Argument 3: The side chosen (The boolean from our toggle)
    emit('submitTake',
        {
          // We use Date.now() to create a unique-ish ID for a beginner project
          id: Date.now().toString(),
          content: take.value,
          votes: 0,
          lit: false
        },
        side.value
    )

    // RESET: Clear the text area after submitting so the user can type a new one
    take.value = ''
  }
}
</script>

<template>
  <div class="main">
    What is your take?

    <div class="inputWrapper">
      <textarea
          maxlength="200"
          v-model="take"
          placeholder="Type your opinion here..."
      ></textarea>
    </div>

    <div class="submitButtonContainer">
      <button @click="handleCommentSubmit">
        Submit
      </button>
    </div>

    <div class="toggle-container">
      Disagree

      <label class="switch">
        <input type="checkbox" v-model="side">
        <span class="slider round"></span>
      </label>

      Agree
    </div>
  </div>
</template>

<style scoped>
/* Layout styles for the input area */
.main {
  display: flex;
  flex-direction: column;
  background: red; /* Bright colors used for structural debugging */
  width: 80%;
  height: 80%;
  margin: auto;
}

.inputWrapper {
  margin: auto auto 0;
  width: 90%;
  background: yellow;
  align-content: center;
  height: fit-content;
}

.main textarea {
  resize: none; /* Prevents the user from dragging the box to change its size */
  width: 90%;
  border: none;
  padding: 10px;
}

.submitButtonContainer {
  display: flex;
  background-color: white;
  width: 90%;
  min-height: 30%;
  margin: auto;
}

/* UI/UX for the Toggle Switch (Standard CSS Switch pattern) */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px; width: 26px;
  left: 4px; bottom: 4px;
  background-color: white;
  transition: .4s;
}

/* Change slider color when 'Agree' (checked) */
input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>