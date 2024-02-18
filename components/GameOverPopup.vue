<template>
  <div class="popup-overlay" v-if="playerStatus.isGameOver">
    <div class="popup">
      <h2>Time's Up!</h2>
      <p>Final score: {{ playerStatus.score }}</p>
      <button @click="restartGame">Play Again</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {PlayerStatus} from "@/interfaces";
const playerStatus = useState<PlayerStatus>("playerStatus");
const emit = defineEmits(['restart']) // Declare ability to emit

function restartGame() {
  playerStatus.value = { ...playerStatus.value, "isGameOver": false }
  emit('restart') // Emit the restart event
}
</script>

<style scoped>
.popup-overlay {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  border: 2px solid lightblue;
  background: lightblue;
  border-radius: 25px;
  padding: 20px;
}

.popup-overlay button {
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
  height: 40px;
  width: 50%;
  top: 15%;
}

</style>