<template>
  <main class="">
  <div class="lab-container bg-gray-900">
    <h1 class="page-title">Tetris Game</h1>
    <p class="page-description">Classic Tetris with touch controls</p>
    
    <div class="game-wrapper">
      <TetrisGame />
    </div>
    
    
  </div>
  </main>
</template>

<script setup>
import TetrisGame from '../components/TetrisGame.vue'
</script>

<style scoped>
.lab-container {
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.page-title {
  text-align: center;
  color: white;
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.page-description {
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.game-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.instructions {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.instructions h3 {
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.instructions p {
  color: #555;
  margin-bottom: 10px;
  line-height: 1.5;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .lab-container {
    padding: 10px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .instructions {
    margin: 0 10px;
    padding: 15px;
  }
}
</style>