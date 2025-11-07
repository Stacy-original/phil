<template>
  <div class="container">
    <div class="heading">
      <h1 class="title">2048</h1>
      <div class="scores-container">
        <div class="score-container">{{ score }}</div>
        <div class="best-container">{{ bestScore }}</div>
      </div>
    </div>

    <div class="above-game">
      <p class="game-intro">Join the numbers and get to the <strong>2048 tile!</strong></p>
      <a class="restart-button" @click="restart">New Game</a>
    </div>

    <div class="game-container" ref="gameContainer">
      <div class="game-message" :class="{ 'game-won': hasWon, 'game-over': isGameOver }">
        <p v-if="hasWon">You win!</p>
        <p v-else-if="isGameOver">Game over!</p>
        <div class="lower">
          <a v-if="hasWon" class="keep-playing-button" @click="keepPlaying">Keep going</a>
          <a class="retry-button" @click="restart">Try again</a>
        </div>
      </div>

      <div class="grid-container">
        <div v-for="(row, rowIndex) in gridSize" :key="rowIndex" class="grid-row">
          <div 
            v-for="(cell, cellIndex) in gridSize" 
            :key="cellIndex" 
            class="grid-cell"
          ></div>
        </div>
      </div>

      <div class="tile-container">
        <div 
          v-for="tile in tiles" 
          :key="tile.id"
          :class="getTileClasses(tile)"
        >
          <div class="tile-inner">{{ tile.value }}</div>
        </div>
      </div>
    </div>

    <p class="game-explanation">
      <strong class="important">How to play:</strong> Use your <strong>arrow keys</strong> to move the tiles. When two tiles with the same number touch, they <strong>merge into one!</strong>
    </p>
  </div>
</template>

<script>
// Local Storage Manager
class LocalStorageManager {
  constructor() {
    this.bestScoreKey = "bestScore";
    this.gameStateKey = "gameState2048";
    this.storage = this.localStorageSupported() ? window.localStorage : this.fakeStorage;
  }

  fakeStorage = {
    _data: {},
    setItem: function (id, val) {
      return this._data[id] = String(val);
    },
    getItem: function (id) {
      return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
    },
    removeItem: function (id) {
      return delete this._data[id];
    },
    clear: function () {
      return this._data = {};
    }
  };

  localStorageSupported() {
    const testKey = "test";
    try {
      const storage = window.localStorage;
      storage.setItem(testKey, "1");
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  getBestScore() {
    return parseInt(this.storage.getItem(this.bestScoreKey)) || 0;
  }

  setBestScore(score) {
    this.storage.setItem(this.bestScoreKey, score.toString());
  }

  getGameState() {
    const stateJSON = this.storage.getItem(this.gameStateKey);
    return stateJSON ? JSON.parse(stateJSON) : null;
  }

  setGameState(gameState) {
    this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
  }

  clearGameState() {
    this.storage.removeItem(this.gameStateKey);
  }
}

// Tile Class
class Tile {
  constructor(position, value) {
    this.x = position.x;
    this.y = position.y;
    this.value = value || 2;
    this.previousPosition = null;
    this.mergedFrom = null;
    this.id = Math.random().toString(36).substr(2, 9);
  }

  savePosition() {
    this.previousPosition = { x: this.x, y: this.y };
  }

  updatePosition(position) {
    this.x = position.x;
    this.y = position.y;
  }

  serialize() {
    return {
      position: {
        x: this.x,
        y: this.y
      },
      value: this.value
    };
  }
}

// Grid Class
class Grid {
  constructor(size, previousState = null) {
    this.size = size;
    this.cells = previousState ? this.fromState(previousState) : this.empty();
  }

  empty() {
    const cells = [];
    for (let x = 0; x < this.size; x++) {
      const row = cells[x] = [];
      for (let y = 0; y < this.size; y++) {
        row.push(null);
      }
    }
    return cells;
  }

  fromState(state) {
    const cells = [];
    for (let x = 0; x < this.size; x++) {
      const row = cells[x] = [];
      for (let y = 0; y < this.size; y++) {
        const tile = state[x][y];
        row.push(tile ? new Tile(tile.position, tile.value) : null);
      }
    }
    return cells;
  }

  randomAvailableCell() {
    const cells = this.availableCells();
    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)];
    }
  }

  availableCells() {
    const cells = [];
    this.eachCell((x, y, tile) => {
      if (!tile) {
        cells.push({ x, y });
      }
    });
    return cells;
  }

  eachCell(callback) {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        callback(x, y, this.cells[x][y]);
      }
    }
  }

  cellsAvailable() {
    return !!this.availableCells().length;
  }

  cellAvailable(cell) {
    return !this.cellOccupied(cell);
  }

  cellOccupied(cell) {
    return !!this.cellContent(cell);
  }

  cellContent(cell) {
    if (this.withinBounds(cell)) {
      return this.cells[cell.x][cell.y];
    } else {
      return null;
    }
  }

  insertTile(tile) {
    this.cells[tile.x][tile.y] = tile;
  }

  removeTile(tile) {
    this.cells[tile.x][tile.y] = null;
  }

  withinBounds(position) {
    return position.x >= 0 && position.x < this.size &&
           position.y >= 0 && position.y < this.size;
  }

  serialize() {
    const cellState = [];
    for (let x = 0; x < this.size; x++) {
      const row = cellState[x] = [];
      for (let y = 0; y < this.size; y++) {
        row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
      }
    }
    return {
      size: this.size,
      cells: cellState
    };
  }
}

export default {
  name: 'Game2048',
  data() {
    return {
      gridSize: 4,
      grid: null,
      tiles: [],
      score: 0,
      bestScore: 0,
      hasWon: false,
      isGameOver: false,
      keepPlaying: false,
      storageManager: null,
      startTiles: 2,
      touchCleanup: null
    }
  },
  mounted() {
    this.storageManager = new LocalStorageManager();
    this.setup();
    this.setupEventListeners();
  },
  beforeUnmount() {
    this.removeEventListeners();
    if (this.touchCleanup) {
      this.touchCleanup();
    }
  },
  methods: {
    setup() {
      const previousState = this.storageManager.getGameState();
      this.bestScore = this.storageManager.getBestScore();

      if (previousState) {
        this.grid = new Grid(previousState.grid.size, previousState.grid.cells);
        this.score = previousState.score;
        this.isGameOver = previousState.over;
        this.hasWon = previousState.won;
        this.keepPlaying = previousState.keepPlaying;
      } else {
        this.grid = new Grid(this.gridSize);
        this.score = 0;
        this.isGameOver = false;
        this.hasWon = false;
        this.keepPlaying = false;
        this.addStartTiles();
      }

      this.updateActuator();
    },

    addStartTiles() {
      for (let i = 0; i < this.startTiles; i++) {
        this.addRandomTile();
      }
    },

    addRandomTile() {
      if (this.grid.cellsAvailable()) {
        const value = Math.random() < 0.9 ? 2 : 4;
        const cell = this.grid.randomAvailableCell();
        if (cell) {
          const tile = new Tile(cell, value);
          this.grid.insertTile(tile);
        }
      }
    },

    updateActuator() {
      if (this.storageManager.getBestScore() < this.score) {
        this.storageManager.setBestScore(this.score);
        this.bestScore = this.score;
      }

      if (this.isGameOver) {
        this.storageManager.clearGameState();
      } else {
        this.storageManager.setGameState(this.serialize());
      }

      this.updateTiles();
    },

    serialize() {
      return {
        grid: this.grid.serialize(),
        score: this.score,
        over: this.isGameOver,
        won: this.hasWon,
        keepPlaying: this.keepPlaying
      };
    },

    updateTiles() {
      const tiles = [];
      this.grid.eachCell((x, y, tile) => {
        if (tile) {
          tiles.push(tile);
        }
      });
      this.tiles = tiles;
    },

    isGameTerminated() {
      return this.isGameOver || (this.hasWon && !this.keepPlaying);
    },

    setupEventListeners() {
      document.addEventListener('keydown', this.handleKeyDown);
      this.setupTouchEvents();
    },

    removeEventListeners() {
      document.removeEventListener('keydown', this.handleKeyDown);
    },

    handleKeyDown(event) {
      if (this.isGameTerminated()) return;

      const map = {
        38: 0, // Up
        39: 1, // Right
        40: 2, // Down
        37: 3, // Left
        75: 0, // Vim up
        76: 1, // Vim right
        74: 2, // Vim down
        72: 3, // Vim left
        87: 0, // W
        68: 1, // D
        83: 2, // S
        65: 3  // A
      };

      const modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
      const mapped = map[event.which];

      if (!modifiers) {
        if (mapped !== undefined) {
          event.preventDefault();
          this.move(mapped);
        }

        // R key restarts
        if (event.which === 82) {
          event.preventDefault();
          this.restart();
        }
      }
    },

    setupTouchEvents() {
      let touchStartClientX, touchStartClientY;
      const gameContainer = this.$refs.gameContainer;

      if (!gameContainer) return;

      const handleTouchStart = (event) => {
        if (event.touches.length > 1) return;

        touchStartClientX = event.touches[0].clientX;
        touchStartClientY = event.touches[0].clientY;
        event.preventDefault();
      };

      const handleTouchEnd = (event) => {
        if (event.touches.length > 0) return;

        const touchEndClientX = event.changedTouches[0].clientX;
        const touchEndClientY = event.changedTouches[0].clientY;

        const dx = touchEndClientX - touchStartClientX;
        const absDx = Math.abs(dx);
        const dy = touchEndClientY - touchStartClientY;
        const absDy = Math.abs(dy);

        if (Math.max(absDx, absDy) > 10) {
          this.move(absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
        }
      };

      gameContainer.addEventListener('touchstart', handleTouchStart);
      gameContainer.addEventListener('touchend', handleTouchEnd);

      // Store cleanup function
      this.touchCleanup = () => {
        gameContainer.removeEventListener('touchstart', handleTouchStart);
        gameContainer.removeEventListener('touchend', handleTouchEnd);
      };
    },

    move(direction) {
      if (this.isGameTerminated()) return;

      const vector = this.getVector(direction);
      const traversals = this.buildTraversals(vector);
      let moved = false;

      this.prepareTiles();

      traversals.x.forEach(x => {
        traversals.y.forEach(y => {
          const cell = { x, y };
          const tile = this.grid.cellContent(cell);

          if (tile) {
            const positions = this.findFarthestPosition(cell, vector);
            const next = this.grid.cellContent(positions.next);

            if (next && next.value === tile.value && !next.mergedFrom) {
              const merged = new Tile(positions.next, tile.value * 2);
              merged.mergedFrom = [tile, next];

              this.grid.insertTile(merged);
              this.grid.removeTile(tile);

              tile.updatePosition(positions.next);

              this.score += merged.value;

              if (merged.value === 2048) this.hasWon = true;
            } else {
              this.moveTile(tile, positions.farthest);
            }

            if (!this.positionsEqual(cell, tile)) {
              moved = true;
            }
          }
        });
      });

      if (moved) {
        this.addRandomTile();

        if (!this.movesAvailable()) {
          this.isGameOver = true;
        }

        this.updateActuator();
      }
    },

    prepareTiles() {
      this.grid.eachCell((x, y, tile) => {
        if (tile) {
          tile.mergedFrom = null;
          tile.savePosition();
        }
      });
    },

    moveTile(tile, cell) {
      this.grid.cells[tile.x][tile.y] = null;
      this.grid.cells[cell.x][cell.y] = tile;
      tile.updatePosition(cell);
    },

    getVector(direction) {
      const map = {
        0: { x: 0, y: -1 }, // Up
        1: { x: 1, y: 0 },  // Right
        2: { x: 0, y: 1 },  // Down
        3: { x: -1, y: 0 }   // Left
      };
      return map[direction];
    },

    buildTraversals(vector) {
      const traversals = { x: [], y: [] };

      for (let pos = 0; pos < this.gridSize; pos++) {
        traversals.x.push(pos);
        traversals.y.push(pos);
      }

      if (vector.x === 1) traversals.x = traversals.x.reverse();
      if (vector.y === 1) traversals.y = traversals.y.reverse();

      return traversals;
    },

    findFarthestPosition(cell, vector) {
      let previous;
      let current = { ...cell };

      do {
        previous = current;
        current = {
          x: previous.x + vector.x,
          y: previous.y + vector.y
        };
      } while (this.grid.withinBounds(current) && this.grid.cellAvailable(current));

      return {
        farthest: previous,
        next: current
      };
    },

    movesAvailable() {
      return this.grid.cellsAvailable() || this.tileMatchesAvailable();
    },

    tileMatchesAvailable() {
      for (let x = 0; x < this.gridSize; x++) {
        for (let y = 0; y < this.gridSize; y++) {
          const tile = this.grid.cellContent({ x, y });

          if (tile) {
            for (let direction = 0; direction < 4; direction++) {
              const vector = this.getVector(direction);
              const cell = {
                x: x + vector.x,
                y: y + vector.y
              };

              const other = this.grid.cellContent(cell);
              if (other && other.value === tile.value) {
                return true;
              }
            }
          }
        }
      }
      return false;
    },

    positionsEqual(first, second) {
      return first.x === second.x && first.y === second.y;
    },

    getTileClasses(tile) {
      const classes = ['tile', `tile-${tile.value}`];
      
      // Use exact pixel positioning like the original
      const positionClass = `tile-position-${tile.x + 1}-${tile.y + 1}`;
      classes.push(positionClass);

      if (tile.value > 2048) classes.push('tile-super');
      
      // Handle animation states
      if (tile.previousPosition) {
        // Tile moved - the CSS transition will handle the animation
      } else if (tile.mergedFrom) {
        classes.push('tile-merged');
      } else {
        classes.push('tile-new');
      }

      return classes;
    },

    restart() {
      this.storageManager.clearGameState();
      this.continueGame();
      this.setup();
    },

    keepPlaying() {
      this.keepPlaying = true;
      this.continueGame();
    },

    continueGame() {
      this.hasWon = false;
      this.isGameOver = false;
    }
  }
}
</script>

<style scoped>
/* Font imports - only need WOFF for modern browsers */
@font-face {
    font-family: "Clear Sans";
    src: url("/fonts/ClearSans-Light-webfont.woff") format("woff");
    font-weight: 200;
    font-style: normal;
}

@font-face {
    font-family: "Clear Sans";
    src: url("/fonts/ClearSans-Regular-webfont.woff") format("woff");
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: "Clear Sans";
    src: url("/fonts/ClearSans-Bold-webfont.woff") format("woff");
    font-weight: 700;
    font-style: normal;
}

html, body {
  margin: 0;
  padding: 0;
  background: #faf8ef;
  color: #776e65;
  font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
  font-size: 18px;
}

body {
  margin: 80px 0;
}

.heading:after {
  content: "";
  display: block;
  clear: both;
}

h1.title {
  font-size: 80px;
  font-weight: bold;
  margin: 0;
  display: block;
  float: left;
}

@-webkit-keyframes move-up {
  0% {
    top: 25px;
    opacity: 1;
  }
  100% {
    top: -50px;
    opacity: 0;
  }
}
@-moz-keyframes move-up {
  0% {
    top: 25px;
    opacity: 1;
  }
  100% {
    top: -50px;
    opacity: 0;
  }
}
@keyframes move-up {
  0% {
    top: 25px;
    opacity: 1;
  }
  100% {
    top: -50px;
    opacity: 0;
  }
}

.scores-container {
  float: right;
  text-align: right;
}

.score-container, .best-container {
  position: relative;
  display: inline-block;
  background: #8f7a66;
  padding: 15px 25px;
  font-size: 25px;
  height: 25px;
  line-height: 47px;
  font-weight: bold;
  border-radius: 3px;
  color: white;
  margin-top: 8px;
  text-align: center;
}
.score-container:after, .best-container:after {
  position: absolute;
  width: 100%;
  top: 10px;
  left: 0;
  text-transform: uppercase;
  font-size: 13px;
  line-height: 13px;
  text-align: center;
  color: #eee4da;
}
.score-container .score-addition, .best-container .score-addition {
  position: absolute;
  right: 30px;
  color: red;
  font-size: 25px;
  line-height: 25px;
  font-weight: bold;
  color: rgba(119, 110, 101, 0.9);
  z-index: 100;
  -webkit-animation: move-up 600ms ease-in;
  -moz-animation: move-up 600ms ease-in;
  animation: move-up 600ms ease-in;
  -webkit-animation-fill-mode: both;
  -moz-animation-fill-mode: both;
  animation-fill-mode: both;
}

.score-container:after {
  content: "Score";
}

.best-container:after {
  content: "Best";
}

p {
  margin-top: 0;
  margin-bottom: 10px;
  line-height: 1.65;
}

a {
  color: #776e65;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
}

strong.important {
  text-transform: uppercase;
}

hr {
  border: none;
  border-bottom: 1px solid #d8d4d0;
  margin-top: 20px;
  margin-bottom: 30px;
}

.container {
  width: 500px;
  margin: 0 auto;
}

@-webkit-keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-moz-keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.game-container {
  margin-top: 40px;
  position: relative;
  padding: 15px;
  cursor: default;
  -webkit-touch-callout: none;
  -ms-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -ms-touch-action: none;
  touch-action: none;
  background: #bbada0;
  border-radius: 6px;
  width: 500px;
  height: 500px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.game-container .game-message {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(238, 228, 218, 0.5);
  z-index: 100;
  text-align: center;
  -webkit-animation: fade-in 800ms ease 1200ms;
  -moz-animation: fade-in 800ms ease 1200ms;
  animation: fade-in 800ms ease 1200ms;
  -webkit-animation-fill-mode: both;
  -moz-animation-fill-mode: both;
  animation-fill-mode: both;
}
.game-container .game-message p {
  font-size: 60px;
  font-weight: bold;
  height: 60px;
  line-height: 60px;
  margin-top: 222px;
}
.game-container .game-message .lower {
  display: block;
  margin-top: 59px;
}
.game-container .game-message a {
  display: inline-block;
  background: #8f7a66;
  border-radius: 3px;
  padding: 0 20px;
  text-decoration: none;
  color: #f9f6f2;
  height: 40px;
  line-height: 42px;
  margin-left: 9px;
  cursor: pointer;
}
.game-container .game-message a.keep-playing-button {
  display: none;
}
.game-container .game-message.game-won {
  background: rgba(237, 194, 46, 0.5);
  color: #f9f6f2;
}
.game-container .game-message.game-won a.keep-playing-button {
  display: inline-block;
}
.game-container .game-message.game-won, .game-container .game-message.game-over {
  display: block;
}

.grid-container {
  position: absolute;
  z-index: 1;
}

.grid-row {
  margin-bottom: 15px;
}
.grid-row:last-child {
  margin-bottom: 0;
}
.grid-row:after {
  content: "";
  display: block;
  clear: both;
}

.grid-cell {
  width: 106.25px;
  height: 106.25px;
  margin-right: 15px;
  float: left;
  border-radius: 3px;
  background: rgba(238, 228, 218, 0.35);
}
.grid-cell:last-child {
  margin-right: 0;
}

.tile-container {
  position: absolute;
  z-index: 2;
}

.tile, .tile .tile-inner {
  width: 107px;
  height: 107px;
  line-height: 107px;
}

/* Exact pixel positions for smooth animations */
.tile.tile-position-1-1 {
  -webkit-transform: translate(0px, 0px);
  -moz-transform: translate(0px, 0px);
  -ms-transform: translate(0px, 0px);
  transform: translate(0px, 0px);
}
.tile.tile-position-1-2 {
  -webkit-transform: translate(0px, 121px);
  -moz-transform: translate(0px, 121px);
  -ms-transform: translate(0px, 121px);
  transform: translate(0px, 121px);
}
.tile.tile-position-1-3 {
  -webkit-transform: translate(0px, 242px);
  -moz-transform: translate(0px, 242px);
  -ms-transform: translate(0px, 242px);
  transform: translate(0px, 242px);
}
.tile.tile-position-1-4 {
  -webkit-transform: translate(0px, 363px);
  -moz-transform: translate(0px, 363px);
  -ms-transform: translate(0px, 363px);
  transform: translate(0px, 363px);
}
.tile.tile-position-2-1 {
  -webkit-transform: translate(121px, 0px);
  -moz-transform: translate(121px, 0px);
  -ms-transform: translate(121px, 0px);
  transform: translate(121px, 0px);
}
.tile.tile-position-2-2 {
  -webkit-transform: translate(121px, 121px);
  -moz-transform: translate(121px, 121px);
  -ms-transform: translate(121px, 121px);
  transform: translate(121px, 121px);
}
.tile.tile-position-2-3 {
  -webkit-transform: translate(121px, 242px);
  -moz-transform: translate(121px, 242px);
  -ms-transform: translate(121px, 242px);
  transform: translate(121px, 242px);
}
.tile.tile-position-2-4 {
  -webkit-transform: translate(121px, 363px);
  -moz-transform: translate(121px, 363px);
  -ms-transform: translate(121px, 363px);
  transform: translate(121px, 363px);
}
.tile.tile-position-3-1 {
  -webkit-transform: translate(242px, 0px);
  -moz-transform: translate(242px, 0px);
  -ms-transform: translate(242px, 0px);
  transform: translate(242px, 0px);
}
.tile.tile-position-3-2 {
  -webkit-transform: translate(242px, 121px);
  -moz-transform: translate(242px, 121px);
  -ms-transform: translate(242px, 121px);
  transform: translate(242px, 121px);
}
.tile.tile-position-3-3 {
  -webkit-transform: translate(242px, 242px);
  -moz-transform: translate(242px, 242px);
  -ms-transform: translate(242px, 242px);
  transform: translate(242px, 242px);
}
.tile.tile-position-3-4 {
  -webkit-transform: translate(242px, 363px);
  -moz-transform: translate(242px, 363px);
  -ms-transform: translate(242px, 363px);
  transform: translate(242px, 363px);
}
.tile.tile-position-4-1 {
  -webkit-transform: translate(363px, 0px);
  -moz-transform: translate(363px, 0px);
  -ms-transform: translate(363px, 0px);
  transform: translate(363px, 0px);
}
.tile.tile-position-4-2 {
  -webkit-transform: translate(363px, 121px);
  -moz-transform: translate(363px, 121px);
  -ms-transform: translate(363px, 121px);
  transform: translate(363px, 121px);
}
.tile.tile-position-4-3 {
  -webkit-transform: translate(363px, 242px);
  -moz-transform: translate(363px, 242px);
  -ms-transform: translate(363px, 242px);
  transform: translate(363px, 242px);
}
.tile.tile-position-4-4 {
  -webkit-transform: translate(363px, 363px);
  -moz-transform: translate(363px, 363px);
  -ms-transform: translate(363px, 363px);
  transform: translate(363px, 363px);
}

.tile {
  position: absolute;
  -webkit-transition: 120ms ease-in-out;
  -moz-transition: 120ms ease-in-out;
  transition: 120ms ease-in-out;
  -webkit-transition-property: -webkit-transform;
  -moz-transition-property: -moz-transform;
  transition-property: transform;
}
.tile .tile-inner {
  border-radius: 3px;
  background: #eee4da;
  text-align: center;
  font-weight: bold;
  z-index: 10;
  font-size: 55px;
}
.tile.tile-2 .tile-inner {
  background: #eee4da;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0), inset 0 0 0 1px rgba(255, 255, 255, 0);
}
.tile.tile-4 .tile-inner {
  background: #ede0c8;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0), inset 0 0 0 1px rgba(255, 255, 255, 0);
}
.tile.tile-8 .tile-inner {
  color: #f9f6f2;
  background: #f2b179;
}
.tile.tile-16 .tile-inner {
  color: #f9f6f2;
  background: #f59563;
}
.tile.tile-32 .tile-inner {
  color: #f9f6f2;
  background: #f67c5f;
}
.tile.tile-64 .tile-inner {
  color: #f9f6f2;
  background: #f65e3b;
}
.tile.tile-128 .tile-inner {
  color: #f9f6f2;
  background: #edcf72;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.2381), inset 0 0 0 1px rgba(255, 255, 255, 0.14286);
  font-size: 45px;
}
.tile.tile-256 .tile-inner {
  color: #f9f6f2;
  background: #edcc61;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.31746), inset 0 0 0 1px rgba(255, 255, 255, 0.19048);
  font-size: 45px;
}
.tile.tile-512 .tile-inner {
  color: #f9f6f2;
  background: #edc850;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.39683), inset 0 0 0 1px rgba(255, 255, 255, 0.2381);
  font-size: 45px;
}
.tile.tile-1024 .tile-inner {
  color: #f9f6f2;
  background: #edc53f;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.47619), inset 0 0 0 1px rgba(255, 255, 255, 0.28571);
  font-size: 35px;
}
.tile.tile-2048 .tile-inner {
  color: #f9f6f2;
  background: #edc22e;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.55556), inset 0 0 0 1px rgba(255, 255, 255, 0.33333);
  font-size: 35px;
}
.tile.tile-super .tile-inner {
  color: #f9f6f2;
  background: #3c3a32;
  font-size: 30px;
}

@-webkit-keyframes appear {
  0% {
    opacity: 0;
    -webkit-transform: scale(0);
    -moz-transform: scale(0);
    -ms-transform: scale(0);
    transform: scale(0);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }
}
@-moz-keyframes appear {
  0% {
    opacity: 0;
    -webkit-transform: scale(0);
    -moz-transform: scale(0);
    -ms-transform: scale(0);
    transform: scale(0);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }
}
@keyframes appear {
  0% {
    opacity: 0;
    -webkit-transform: scale(0);
    -moz-transform: scale(0);
    -ms-transform: scale(0);
    transform: scale(0);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }
}

.tile-new .tile-inner {
  -webkit-animation: appear 200ms ease 100ms;
  -moz-animation: appear 200ms ease 100ms;
  animation: appear 200ms ease 100ms;
  -webkit-animation-fill-mode: backwards;
  -moz-animation-fill-mode: backwards;
  animation-fill-mode: backwards;
}

@-webkit-keyframes pop {
  0% {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }
  50% {
    -webkit-transform: scale(1.2);
    -moz-transform: scale(1.2);
    -ms-transform: scale(1.2);
    transform: scale(1.2);
  }
  100% {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }
}
@-moz-keyframes pop {
  0% {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }
  50% {
    -webkit-transform: scale(1.2);
    -moz-transform: scale(1.2);
    -ms-transform: scale(1.2);
    transform: scale(1.2);
  }
  100% {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }
}
@keyframes pop {
  0% {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }
  50% {
    -webkit-transform: scale(1.2);
    -moz-transform: scale(1.2);
    -ms-transform: scale(1.2);
    transform: scale(1.2);
  }
  100% {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }
}

.tile-merged .tile-inner {
  z-index: 20;
  -webkit-animation: pop 300ms ease 50ms;
  -moz-animation: pop 300ms ease 50ms;
  animation: pop 300ms ease 50ms;
  -webkit-animation-fill-mode: both;
  -moz-animation-fill-mode: both;
  animation-fill-mode: both;
}

.above-game:after {
  content: "";
  display: block;
  clear: both;
}

.game-intro {
  float: left;
  line-height: 42px;
  margin-bottom: 0;
}

.restart-button {
  display: inline-block;
  background: #8f7a66;
  border-radius: 3px;
  padding: 0 20px;
  text-decoration: none;
  color: #f9f6f2;
  height: 40px;
  line-height: 42px;
  display: block;
  text-align: center;
  float: right;
  cursor: pointer;
}

.game-explanation {
  margin-top: 50px;
}

/* Mobile styles */
@media screen and (max-width: 520px) {
  html, body {
    font-size: 15px;
  }

  body {
    margin: 20px 0;
    padding: 0 20px;
  }

  h1.title {
    font-size: 27px;
    margin-top: 15px;
  }

  .container {
    width: 280px;
    margin: 0 auto;
  }

  .score-container, .best-container {
    margin-top: 0;
    padding: 15px 10px;
    min-width: 40px;
  }

  .heading {
    margin-bottom: 10px;
  }

  .game-intro {
    width: 55%;
    display: block;
    box-sizing: border-box;
    line-height: 1.65;
  }

  .restart-button {
    width: 42%;
    padding: 0;
    display: block;
    box-sizing: border-box;
    margin-top: 2px;
  }

  .game-container {
    margin-top: 17px;
    position: relative;
    padding: 10px;
    cursor: default;
    -webkit-touch-callout: none;
    -ms-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -ms-touch-action: none;
    touch-action: none;
    background: #bbada0;
    border-radius: 6px;
    width: 280px;
    height: 280px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .grid-cell {
    width: 57.5px;
    height: 57.5px;
    margin-right: 10px;
    float: left;
    border-radius: 3px;
    background: rgba(238, 228, 218, 0.35);
  }
  .grid-cell:last-child {
    margin-right: 0;
  }

  .tile, .tile .tile-inner {
    width: 58px;
    height: 58px;
    line-height: 58px;
  }

  /* Mobile exact pixel positions */
  .tile.tile-position-1-1 {
    -webkit-transform: translate(0px, 0px);
    -moz-transform: translate(0px, 0px);
    -ms-transform: translate(0px, 0px);
    transform: translate(0px, 0px);
  }
  .tile.tile-position-1-2 {
    -webkit-transform: translate(0px, 67px);
    -moz-transform: translate(0px, 67px);
    -ms-transform: translate(0px, 67px);
    transform: translate(0px, 67px);
  }
  .tile.tile-position-1-3 {
    -webkit-transform: translate(0px, 135px);
    -moz-transform: translate(0px, 135px);
    -ms-transform: translate(0px, 135px);
    transform: translate(0px, 135px);
  }
  .tile.tile-position-1-4 {
    -webkit-transform: translate(0px, 202px);
    -moz-transform: translate(0px, 202px);
    -ms-transform: translate(0px, 202px);
    transform: translate(0px, 202px);
  }
  .tile.tile-position-2-1 {
    -webkit-transform: translate(67px, 0px);
    -moz-transform: translate(67px, 0px);
    -ms-transform: translate(67px, 0px);
    transform: translate(67px, 0px);
  }
  .tile.tile-position-2-2 {
    -webkit-transform: translate(67px, 67px);
    -moz-transform: translate(67px, 67px);
    -ms-transform: translate(67px, 67px);
    transform: translate(67px, 67px);
  }
  .tile.tile-position-2-3 {
    -webkit-transform: translate(67px, 135px);
    -moz-transform: translate(67px, 135px);
    -ms-transform: translate(67px, 135px);
    transform: translate(67px, 135px);
  }
  .tile.tile-position-2-4 {
    -webkit-transform: translate(67px, 202px);
    -moz-transform: translate(67px, 202px);
    -ms-transform: translate(67px, 202px);
    transform: translate(67px, 202px);
  }
  .tile.tile-position-3-1 {
    -webkit-transform: translate(135px, 0px);
    -moz-transform: translate(135px, 0px);
    -ms-transform: translate(135px, 0px);
    transform: translate(135px, 0px);
  }
  .tile.tile-position-3-2 {
    -webkit-transform: translate(135px, 67px);
    -moz-transform: translate(135px, 67px);
    -ms-transform: translate(135px, 67px);
    transform: translate(135px, 67px);
  }
  .tile.tile-position-3-3 {
    -webkit-transform: translate(135px, 135px);
    -moz-transform: translate(135px, 135px);
    -ms-transform: translate(135px, 135px);
    transform: translate(135px, 135px);
  }
  .tile.tile-position-3-4 {
    -webkit-transform: translate(135px, 202px);
    -moz-transform: translate(135px, 202px);
    -ms-transform: translate(135px, 202px);
    transform: translate(135px, 202px);
  }
  .tile.tile-position-4-1 {
    -webkit-transform: translate(202px, 0px);
    -moz-transform: translate(202px, 0px);
    -ms-transform: translate(202px, 0px);
    transform: translate(202px, 0px);
  }
  .tile.tile-position-4-2 {
    -webkit-transform: translate(202px, 67px);
    -moz-transform: translate(202px, 67px);
    -ms-transform: translate(202px, 67px);
    transform: translate(202px, 67px);
  }
  .tile.tile-position-4-3 {
    -webkit-transform: translate(202px, 135px);
    -moz-transform: translate(202px, 135px);
    -ms-transform: translate(202px, 135px);
    transform: translate(202px, 135px);
  }
  .tile.tile-position-4-4 {
    -webkit-transform: translate(202px, 202px);
    -moz-transform: translate(202px, 202px);
    -ms-transform: translate(202px, 202px);
    transform: translate(202px, 202px);
  }

  .tile .tile-inner {
    font-size: 35px;
  }

  .tile.tile-128 .tile-inner,
  .tile.tile-256 .tile-inner,
  .tile.tile-512 .tile-inner {
    font-size: 25px;
  }

  .tile.tile-1024 .tile-inner,
  .tile.tile-2048 .tile-inner {
    font-size: 15px;
  }

  .tile.tile-super .tile-inner {
    font-size: 10px;
  }

  .game-message p {
    font-size: 30px !important;
    height: 30px !important;
    line-height: 30px !important;
    margin-top: 90px !important;
  }
  .game-message .lower {
    margin-top: 30px !important;
  }
}
</style>