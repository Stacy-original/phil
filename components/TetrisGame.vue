<template>
  <div 
    class="tetris-wrapper" 
    @keydown.prevent="onKeyDown" 
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @click="onTap"
    tabindex="0" 
    ref="gameRoot"
  >
    <div class="tetris-container">
      <!-- Game Board -->
      <div class="board-wrapper">
        <div class="board" ref="boardRef">
          <div v-for="(cell, idx) in displayGrid" 
               :key="idx" 
               class="cell" 
               :class="cell ? `filled ${getCellColor(idx)}` : ''"></div>
        </div>
        
        <!-- Touch Controls Hint -->
        <div class="touch-hints max-sm:flex">
          <div class="hint-item">
            <span class="hint-icon">←→</span>
            <span class="hint-text">Swipe to move</span>
          </div>
          <div class="hint-item">
            <span class="hint-icon">Tap</span>
            <span class="hint-text">Rotate</span>
          </div>
          <div class="hint-item">
            <span class="hint-icon">Double Tap</span>
            <span class="hint-text">Hard drop</span>
          </div>
          <div class="hint-item">
            <span class="hint-icon">Hold</span>
            <span class="hint-text">Soft drop</span>
          </div>
        </div>
      </div>

      <!-- Right Sidebar with Controls -->
      <div class="right-sidebar">
        <!-- Game Controls -->
        <div class="game-controls">
          <button @click="startGame()" :disabled="running" class="control-btn start">
            {{ running ? 'Playing' : 'Start' }}
          </button>
          <button @click="restartGame()" class="control-btn restart">Restart</button>
        </div>

        <!-- Difficulty Selector -->
        <div class="info difficulty-selector">
          <h3>Difficulty</h3>
          <select v-model="selectedDifficulty" @change="changeDifficulty" class="difficulty-select">
            <option v-for="diff in difficulties" :key="diff.value" :value="diff.value">
              {{ diff.label }}
            </option>
          </select>
        </div>

        <!-- Next Piece Preview -->
        <div class="info">
          <h3>Next</h3>
          <div class="next-preview">
            <div class="next-grid">
              <div v-for="(c, i) in nextDisplay" 
                   :key="i" 
                   class="cell small" 
                   :class="c ? `filled ${getNextPieceColor()}` : ''"></div>
            </div>
          </div>
        </div>

        <div class="info">
          <h3>Score</h3>
          <div class="score">{{ score }}</div>
        </div>

        <div class="info">
          <h3>Level</h3>
          <div class="score">{{ level }}</div>
        </div>

        <!-- Control Instructions -->
        <div class="info control-instructions">
          <h3>Controls</h3>
          <div class="control-list">
            <div class="control-item">
              <span class="control-key">A / ←</span>
              <span class="control-action">Move Left</span>
            </div>
            <div class="control-item">
              <span class="control-key">D / →</span>
              <span class="control-action">Move Right</span>
            </div>
            <div class="control-item">
              <span class="control-key">W / ↑</span>
              <span class="control-action">Rotate</span>
            </div>
            <div class="control-item">
              <span class="control-key">S / ↓</span>
              <span class="control-action">Soft Drop</span>
            </div>
            <div class="control-item">
              <span class="control-key">Space</span>
              <span class="control-action">Hard Drop</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Over Screen -->
    <div v-if="gameOver" class="game-over-overlay">
      <div class="game-over-content">
        <h2 class="game-over-title">GAME OVER</h2>
        <p class="game-over-score">Final Score: {{ score }}</p>
        <p class="game-over-level">Level: {{ level }}</p>
        <button @click="restartGame()" class="control-btn restart">Play Again</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

// Game constants
const COLS = 10
const ROWS = 20
const SWIPE_THRESHOLD = 30
const TAP_THRESHOLD = 300

// Refs
const boardRef = ref(null)
const gameRoot = ref(null)
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchStartTime = ref(0)
const lastTapTime = ref(0)
const isHolding = ref(false)
const holdTimer = ref(null)

// Game state
const grid = reactive(Array.from({length:ROWS},()=>Array(COLS).fill(0)))
const current = ref(null)
const next = ref(null)
const score = ref(0)
const level = ref(1)
const linesCleared = ref(0)
const running = ref(false)
const gameOver = ref(false)

// Game timers
let tickInterval = null
let hardDropTimer = null
let inputCooldown = null

// Tetromino definitions
const TETROMINO_COLORS = {
  I: 'cyan',
  J: 'blue',
  L: 'orange',
  O: 'yellow',
  S: 'green',
  T: 'purple',
  Z: 'red'
}

const TETROMINOS = {
  I: [[0,0,0,0, 1,1,1,1, 0,0,0,0, 0,0,0,0]],
  J: [[1,0,0, 1,1,1, 0,0,0]],
  L: [[0,0,1, 1,1,1, 0,0,0]],
  O: [[1,1, 1,1]],
  S: [[0,1,1, 1,1,0, 0,0,0]],
  T: [[0,1,0, 1,1,1, 0,0,0]],
  Z: [[1,1,0, 0,1,1, 0,0,0]],
}

const PIECES = Object.keys(TETROMINOS)

// Difficulty levels
const difficulties = ref([
  { label: 'Easy', value: 1, speed: 800 },
  { label: 'Medium', value: 2, speed: 500 },
  { label: 'Hard', value: 3, speed: 300 },
  { label: 'Expert', value: 4, speed: 150 }
])

const selectedDifficulty = ref(2)

// Computed properties
const displayGrid = computed(() => {
  const merged = grid.map(r => r.slice())
  if (current.value) {
    const m = current.value.matrix
    for (let r = 0; r < m.length; r++) {
      for (let c = 0; c < m[r].length; c++) {
        if (m[r][c]) {
          const gr = current.value.row + r
          const gc = current.value.col + c
          if (gr >= 0 && gr < ROWS && gc >= 0 && gc < COLS) {
            merged[gr][gc] = current.value.type
          }
        }
      }
    }
  }
  return merged.flat()
})

const nextDisplay = computed(() => {
  const size = 4
  const arr = Array(size * size).fill(0)
  if (!next.value) return arr
  const m = next.value.matrix
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m[r].length; c++) {
      if (m[r][c]) arr[(r + 1) * size + (c + 1)] = 1
    }
  }
  return arr
})

// Game functions
function randomPiece() {
  const type = PIECES[Math.floor(Math.random() * PIECES.length)]
  return makePiece(type)
}

function makePiece(type) {
  const raw = TETROMINOS[type][0]
  const size = Math.sqrt(raw.length)
  const matrix = []
  for (let r = 0; r < size; r++) {
    matrix.push(raw.slice(r * size, r * size + size))
  }
  return { type, matrix, row: 0, col: Math.floor((COLS - matrix[0].length) / 2), size }
}

function rotate(matrix) {
  const N = matrix.length
  const res = Array.from({ length: N }, () => Array(N).fill(0))
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      res[c][N - 1 - r] = matrix[r][c]
    }
  }
  return res
}

function collide(mat, row, col) {
  for (let r = 0; r < mat.length; r++) {
    for (let c = 0; c < mat[r].length; c++) {
      if (mat[r][c]) {
        const gr = row + r
        const gc = col + c
        if (gc < 0 || gc >= COLS || gr >= ROWS) return true
        if (gr >= 0 && grid[gr][gc]) return true
      }
    }
  }
  return false
}

function lockPiece() {
  const m = current.value.matrix
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m[r].length; c++) {
      if (m[r][c]) {
        const gr = current.value.row + r
        const gc = current.value.col + c
        if (gr >= 0 && gr < ROWS && gc >= 0 && gc < COLS) {
          grid[gr][gc] = current.value.type
        }
      }
    }
  }
  clearLines()
  spawn()
}

function clearLines() {
  let cleared = 0
  for (let r = ROWS - 1; r >= 0; r--) {
    if (grid[r].every(c => c !== 0)) {
      grid.splice(r, 1)
      grid.unshift(Array(COLS).fill(0))
      cleared++
      r++
    }
  }
  if (cleared > 0) {
    linesCleared.value += cleared
    const pts = { 1: 40, 2: 100, 3: 300, 4: 1200 }
    score.value += (pts[cleared] || cleared * 100) * level.value
    const newLvl = Math.floor(linesCleared.value / 10) + 1
    if (newLvl !== level.value) level.value = newLvl
  }
}

function spawn() {
  current.value = next.value
  current.value.row = 0
  current.value.col = Math.floor((COLS - current.value.matrix[0].length) / 2)
  next.value = randomPiece()
  
  if (inputCooldown) {
    clearTimeout(inputCooldown)
  }
  inputCooldown = setTimeout(() => {
    inputCooldown = null
  }, 50)
  
  if (collide(current.value.matrix, current.value.row, current.value.col)) {
    gameOver.value = true
    running.value = false
    stopTick()
  }
}

function softDrop() {
  if (!current.value || gameOver.value) return
  if (!collide(current.value.matrix, current.value.row + 1, current.value.col)) {
    current.value.row++
  } else {
    lockPiece()
  }
}

function hardDropSlow() {
  if (!current.value || hardDropTimer || gameOver.value) return
  hardDropTimer = setInterval(() => {
    if (!running.value || !current.value || gameOver.value) {
      clearInterval(hardDropTimer)
      hardDropTimer = null
      return
    }
    if (collide(current.value.matrix, current.value.row + 1, current.value.col)) {
      lockPiece()
      clearInterval(hardDropTimer)
      hardDropTimer = null
      return
    } else {
      current.value.row++
    }
  }, 40)
}

function move(dir) {
  if (!current.value || gameOver.value) return
  const newCol = current.value.col + dir
  if (!collide(current.value.matrix, current.value.row, newCol)) current.value.col = newCol
}

function rotateCurrent() {
  if (!current.value || gameOver.value) return
  const rotated = rotate(current.value.matrix)
  const kicks = [0, -1, 1, -2, 2]
  for (const k of kicks) {
    if (!collide(rotated, current.value.row, current.value.col + k)) {
      current.value.matrix = rotated
      current.value.col += k
      return
    }
  }
}

function gameTick() {
  if (!running.value || gameOver.value) return
  softDrop()
}

function startTick() {
  stopTick()
  const baseSpeed = difficulties.value.find(d => d.value === selectedDifficulty.value)?.speed || 500
  const levelSpeed = Math.max(baseSpeed - (level.value - 1) * 50, 100)
  tickInterval = setInterval(gameTick, levelSpeed)
}

function stopTick() {
  if (tickInterval) {
    clearInterval(tickInterval)
    tickInterval = null
  }
}

function changeDifficulty() {
  if (running.value) {
    startTick()
  }
}

function startGame() {
  if (running.value) return
  if (gameOver.value) resetGrid()
  running.value = true
  gameOver.value = false
  if (!current.value) {
    next.value = randomPiece()
    spawn()
  }
  startTick()
}

function restartGame() {
  resetGrid()
  next.value = randomPiece()
  spawn()
  score.value = 0
  level.value = 1
  linesCleared.value = 0
  running.value = true
  gameOver.value = false
  if (inputCooldown) {
    clearTimeout(inputCooldown)
    inputCooldown = null
  }
  startTick()
}

function resetGrid() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      grid[r][c] = 0
    }
  }
  current.value = null
}

// Input handlers
function onTouchStart(event) {
  if (!running.value || gameOver.value) return
  
  const touch = event.touches[0]
  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY
  touchStartTime.value = Date.now()
  
  isHolding.value = true
  holdTimer.value = setTimeout(() => {
    if (isHolding.value && running.value && !gameOver.value) {
      softDrop()
    }
  }, 200)
}

function onTouchMove(event) {
  if (!isHolding.value || !running.value || gameOver.value) return
  event.preventDefault()
}

function onTouchEnd(event) {
  if (!running.value || gameOver.value) return
  
  const touch = event.changedTouches[0]
  const deltaX = touch.clientX - touchStartX.value
  const deltaY = touch.clientY - touchStartY.value
  const elapsedTime = Date.now() - touchStartTime.value
  
  isHolding.value = false
  if (holdTimer.value) {
    clearTimeout(holdTimer.value)
    holdTimer.value = null
  }
  
  if (Math.abs(deltaX) > SWIPE_THRESHOLD && elapsedTime < TAP_THRESHOLD) {
    if (deltaX > 0) {
      move(1)
    } else {
      move(-1)
    }
    event.preventDefault()
  }
}

function onTap(event) {
  if (!running.value || gameOver.value) return
  
  const currentTime = Date.now()
  const timeSinceLastTap = currentTime - lastTapTime.value
  
  if (timeSinceLastTap < 300) {
    hardDropSlow()
    lastTapTime.value = 0
  } else {
    rotateCurrent()
    lastTapTime.value = currentTime
  }
}

function onKeyDown(e) {
  if (gameOver.value) return
  e.preventDefault()
  const key = e.key.toLowerCase()
  if (!running.value && key === ' ') {
    startGame()
    return
  }

  switch (key) {
    case 'a':
    case 'arrowleft':
      move(-1); break
    case 'd':
    case 'arrowright':
      move(1); break
    case 'r':
    case 'w':
    case 'arrowup':
      rotateCurrent(); break
    case 's':
    case 'arrowdown':
      softDrop(); break
    case ' ':
      hardDropSlow(); break
  }
}

// Utility functions
function getCellColor(idx) {
  const row = Math.floor(idx / COLS)
  const col = idx % COLS
  const cellType = grid[row][col]
  return TETROMINO_COLORS[cellType] || 'blue'
}

function getNextPieceColor() {
  return next.value ? TETROMINO_COLORS[next.value.type] : 'blue'
}

// Lifecycle
onMounted(async () => {
  await nextTick()
  if (gameRoot.value) gameRoot.value.focus()
  resetGrid()
  next.value = randomPiece()
  spawn()
})

onBeforeUnmount(() => {
  stopTick()
  clearInterval(hardDropTimer)
  if (inputCooldown) {
    clearTimeout(inputCooldown)
  }
})

// Watchers
watch(level, () => {
  if (running.value) startTick()
})
</script>

<style scoped>
.tetris-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  width: 100%;
  outline: none;
  background: transparent;
  padding: 20px;
  box-sizing: border-box;
  touch-action: pan-y;
  -webkit-user-select: none;
  user-select: none;
  margin-left: 2rem;
}

.tetris-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 30px;
  flex-wrap: wrap;
  max-width: 100%;
  margin: 0 auto;
}

/* Right Sidebar */
.right-sidebar {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 200px;
  color: #000000;
}

/* Board Styles */
.board-wrapper {
  position: relative;
  aspect-ratio: 10/20;
  width: min(100%, 300px);
}

.board {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(20, 1fr);
  gap: 1px;
  background: #f8f9fa;
  padding: 2px;
  border-radius: 4px;
  border: 2px solid #e5e7eb;
}

.cell { 
  width: 100%; 
  height: 100%; 
  background: #ffffff; 
  border-radius: 1px;
  border: 1px solid #f1f5f9;
}

.cell.filled { 
  border: none;
}

/* Tetromino Colors */
.cell.filled.cyan { background: #06b6d4; }
.cell.filled.blue { background: #3b82f6; }
.cell.filled.orange { background: #f97316; }
.cell.filled.yellow { background: #eab308; }
.cell.filled.green { background: #22c55e; }
.cell.filled.purple { background: #a855f7; }
.cell.filled.red { background: #ef4444; }

/* Game Controls */
.game-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-btn {
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #3b82f6;
  color: white;
  font-size: 14px;
  text-align: center;
}

.control-btn:hover:not(:disabled) {
  background: #2563eb;
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.control-btn.restart {
  background: #ef4444;
}

.control-btn.restart:hover:not(:disabled) {
  background: #dc2626;
}

/* Difficulty Selector */
.difficulty-selector {
  margin-bottom: 0;
}

.difficulty-select {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #000000;
  font-size: 14px;
}

.info { 
  padding: 15px;
  border-radius: 8px;
  background: rgba(248, 249, 250, 0.9);
  border: 1px solid #e5e7eb;
}

.info h3 {
  color: #000000;
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

/* Next Preview */
.next-preview {
  padding: 15px;
  margin-top: 8px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.next-grid { 
  display: grid; 
  grid-template-columns: repeat(4, 20px); 
  grid-template-rows: repeat(4, 20px); 
  gap: 3px; 
  justify-content: center;
  margin: 0 auto;
}

.cell.small { 
  width: 20px; 
  height: 20px; 
  background: #f1f5f9;
  border-radius: 2px;
  border: 1px solid #e5e7eb;
}

.cell.small.filled {
  border: none;
}

.score { 
  font-weight: 700; 
  font-size: 20px; 
  text-align: center; 
  color: #000000; 
}

/* Control Instructions */
.control-instructions {
  margin-top: 10px;
}

.control-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #e5e7eb;
}

.control-item:last-child {
  border-bottom: none;
}

.control-key {
  background: #3b82f6;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  min-width: 50px;
  text-align: center;
}

.control-action {
  font-size: 12px;
  color: #374151;
  font-weight: 500;
}

/* Touch Hints */
.touch-hints {
  display: none;
  flex-direction: column;
  gap: 8px;
  margin-top: 15px;
  padding: 12px;
  background: rgba(248, 249, 250, 0.9);
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.hint-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}

.hint-icon {
  background: #3b82f6;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  min-width: 60px;
  text-align: center;
}

.hint-text {
  color: #000000;
  font-weight: 500;
}

/* Game Over Screen */
.game-over-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.game-over-content {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  border: 2px solid #ef4444;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  width: 300px;
}

.game-over-title {
  font-size: 1.8em;
  color: #ef4444;
  margin-bottom: 12px;
  font-weight: 700;
}

.game-over-score {
  font-size: 1.1em;
  color: #000000;
  margin-bottom: 6px;
}

.game-over-level {
  font-size: 1em;
  color: #6b7280;
  margin-bottom: 16px;
}

/* Mobile Responsive Styles */
@media (max-width: 480px) {
  .tetris-wrapper {
    padding: 10px;
    min-height: 100vh;
    align-items: flex-start;
    justify-content: center;
    margin-left: 0;
  }

  .tetris-container {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
    justify-content: center;
  }

  .right-sidebar {
    width: 100%;
    max-width: 300px;
    order: 1;
  }

  .board-wrapper {
    width: 100%;
    max-width: 300px;
    order: 0;
  }

  .game-controls {
    flex-direction: row;
  }

  .touch-hints {
    display: flex;
  }

  .info {
    padding: 12px;
  }

  .next-grid {
    grid-template-columns: repeat(4, 18px);
    grid-template-rows: repeat(4, 18px);
  }

  .cell.small {
    width: 18px;
    height: 18px;
  }

  .control-btn {
    flex: 1;
    padding: 10px;
    font-size: 13px;
  }

  .control-instructions {
    display: none;
  }
}

/* Small mobile devices */
@media (max-width: 360px) {
  .board-wrapper {
    max-width: 280px;
  }

  .right-sidebar {
    max-width: 280px;
  }

  .touch-hints {
    font-size: 11px;
  }

  .hint-icon {
    min-width: 55px;
    font-size: 11px;
  }
}

/* Desktop layout */
@media (min-width: 481px) {
  .tetris-container {
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .right-sidebar {
    order: 1;
  }

  .board-wrapper {
    order: 0;
  }
}

/* When sidebar is active, adjust positioning */
@media (min-width: 1024px) {
  .tetris-wrapper {
    margin-left: 4rem;
  }
}
</style>