<template>
  <main>
    <GameOverPopup
      @restart="handleRestart"
    />
    <div class="info-container">
      <div class="timer">{{ time }}s</div>
      <div class="score">Score: {{ playerStatus.score }}</div>
    </div>
    <div class="type-container">
      <div class="phrase-display">
        <span v-for="(char, index) in currentPhrase.split('')" 
              :key="index"
              :class="{ correct: isCorrect(index) }">
          {{ char }}
        </span>
      </div>
      <textarea type="text" @input="handleInput" />
    </div>
  </main>
</template>

<script setup lang="ts">
import type {PlayerStatus} from "@/interfaces";

const playerStatus = useState<PlayerStatus>("playerStatus", () => ({ "score": 0, "isGameOver": false }));

const phraseList = await getPhrases()
const currentPhrase = ref('')
const time = ref(60)
const correctChars = ref(Array(currentPhrase.value.length).fill(false))

async function getPhrases() {
  const phrase = await $fetch("/api/phrase")
  return phrase.map((x) => x.kr)
}

function handleRestart() {
  time.value = 60
  playerStatus.value = { "score": 0, "isGameOver": false };
  generatePhrase()
  const timerInterval = setInterval(() => {
    if (time.value > 0) {  
      time.value--
    } else {
      clearInterval(timerInterval)      
      playerStatus.value = { ...playerStatus.value, "isGameOver": true } // Show the popup
    }
  }, 1000) 
}

function generatePhrase() {
  currentPhrase.value = phraseList[Math.floor(Math.random() * phraseList.length)]
}

function handleInput(event) {
  const input = event.target.value
  for (let i = 0; i < input.length; i++) {
    correctChars.value[i] = input[i] === currentPhrase.value[i]  
  }
  if (event.target.value === currentPhrase.value) {
    playerStatus.value = { ...playerStatus.value, "score": playerStatus.value.score + 1 }
    generatePhrase()
    event.target.value = ''
    correctChars.value = Array(currentPhrase.value.length).fill(false)
  } 
}

function isCorrect(index) {
  return correctChars.value[index]
}

onMounted(() => { // Use onMounted lifecycle hook
  const timerInterval = setInterval(() => {
    if (time.value > 0) {  
      time.value--
    } else {
      clearInterval(timerInterval)      
      playerStatus.value = { ...playerStatus.value, "isGameOver": true } // Show the popup
    }
  }, 1000) 
}) 

generatePhrase() 
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR&display=swap')
</style>

<style>
html {
     font-family: "Noto Serif KR", serif;
     font-weight: 400;
     font-style: normal;
     font-size: 50px;
}

main {
}

.info-container {
   height: 100px;
}

.timer {
     position: absolute;
     left: 50%;
     transform: translate(-50%, 0);
}

.score {
     display: inline-block;
     position: relative;
     left: 100%;
     transform: translateX(-100%);
     font-size: 30px;
}

.type-container {
  display: flex;
  border: 2px solid lightgray;
  background: lightgray;
  border-radius: 25px;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.phrase-display {
  width: 90%;
}

.type-container textarea {
  background: lightgray;
  width: 90%;
  height: 200px;
  box-sizing: border-box;
  font-size: 30px;
  resize: none;
}

.type-container textarea:focus {
  border-color: black;
}

.correct {
  color: darkgreen;
}

</style>