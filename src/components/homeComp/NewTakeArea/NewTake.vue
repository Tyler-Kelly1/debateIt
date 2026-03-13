<script setup lang="ts">
import { ref } from "vue";

// 1. DATA BLUEPRINT
// Even though this is the input component, we define what a 'Take' looks like
// to ensure consistency when we send it to the parent.
interface CommentData {
  id: string;
  content: string;
  votes: number;
}

const props = defineProps({

  debateTopic: {
    type: String,
    required: true,
  }
})

// 2. LOCAL STATE (Internal Variables)
// 'take' stores what the user is currently typing in the textarea.
const take = ref('')

// 3. EMIT DEFINITION
// This defines the "megaphone" this component uses to talk to the parent.
// We are telling Vue that this component is allowed to shout an event called 'submitTake'.
const emit = defineEmits([
  'submitTake'
])

// 4. SUBMISSION LOGIC
function handleTakeSubmit() {
  // Only submit if the user has actually typed something
  if (take.value) {

    // 'emit' sends data up the chain.
    // Argument 1: The name of the event ('submitTake')
    // Argument 2: The actual data object (The "Take")
    // Argument 3: The side chosen (The boolean from our toggle)

    emit('submitTake',
        {
          message: take.value,
        }
    )

    // RESET: Clear the text area after submitting so the user can type a new one
    take.value = ''
  }
}
</script>

<template>
  <div class="main">
    <h3 v-if="props.debateTopic">{{props.debateTopic}}</h3>
    <h3 v-else>FAILED TO LOAD TOPIC</h3>

    <div class="inputWrapper">
      <textarea
          maxlength="200"
          v-model="take"
          placeholder="Type your opinion here..."
      ></textarea>
    </div>

    <div class="submitButtonContainer">
      <button @click="handleTakeSubmit">
        Submit
      </button>
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

</style>