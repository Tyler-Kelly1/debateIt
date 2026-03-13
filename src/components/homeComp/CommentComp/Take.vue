<script setup lang="js">


//Props of the comment comp
const props = defineProps({

  take_id:{
    type: String,
    required: true
  },
  message:{
    type:String,
    required: true
  },
  user_id:{
    type:String,
    default:0,
    required:true
  },
  reactions:{
    type:Object,
    default: [],
    required: true
  },
  side:{
    type:Boolean,
    default:false
  }

})

const emit = defineEmits(["newReaction"])

//Reaction handler
function handleReaction(status){

  emit("newReaction", {type: status, takeSide: props.side})

}

</script>

<template>
  <div class="comment">
    <h4>ID: {{props.take_id}}</h4>
    <p>{{props.message}}</p>
    <div
        class = "vote-box"
    >
      <div
          @click="handleReaction('Like')"
      >
        ^ {{}}
      </div>

      <div
          @click="handleReaction('Dislike')"
      >
        v {{}}
      </div>

    </div>
  </div>
</template>

<style scoped>

.comment{
  display: block;
  border: 1px solid #ccc;
}

.comment h4{
  font-size: 0.5rem;
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
  border: #00d9ff solid 1px;
}

.comment p{
  margin-top: 0;
  margin-bottom: 0.2rem;
}

.vote-box {
  margin-left: auto;
  width: fit-content;
  padding: 4px 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  background: #ff0000; /* Default (Unlit) */
  display: flex;
}

.like-box{
  background-color: green;
}

.dislike-box{
  background-color: darkred;
}

.like-box-lit{
  background-color: lightgreen;
}

.dislike-box-lit{
  background-color: lightcoral;
}


</style>