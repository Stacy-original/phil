<template>
    <div class="flex flex-row justify-center text-4xl md:text-5xl font-bold text-white mt-8">Flappy Javascript</div>
    <div class="game-container">
        <canvas 
        ref="board" 
        id="board" 
        :width="board_w" 
        :height="board_h"
        ></canvas>
    </div>
</template>

<script>
export default {
  name: 'FlappyGame',
  data() {
    return {
      // Window Setup
      board: null,
      board_w: 400,
      board_h: 600,
      context: null,

      // Images
      bg_img: null,
      player_img: null,
      ground_img: null,
      pipe_up_img: null,
      pipe_down_img: null,

      // Player
      player_w: 57,
      player_h: 58,
      player_x: 172,
      player_y: 300,
      velocity: 0,

      // Pipes
      pipe_w: 79,
      pipe_h: 360,
      pipe_x: 600,
      pipe_y: 0,
      gap: 220,
      p_velocity: -3,
      pipe_scored: false,

      // Game state
      score: 0,
      bg_x_pos: 0,
      ground_x_pos: 0,
      bg_scroll_spd: 0.5,
      ground_scroll_spd: 1,
      bg_width: 400,
      has_moved: false,

      // Player object
      player: {
        x: 172,
        y: 300,
        width: 57,
        height: 58
      }
    }
  },
  mounted() {
    this.initGame();
    this.loadAssets();
    this.setupEventListeners();
  },
  beforeUnmount() {
    this.removeEventListeners();
  },
  methods: {
    initGame() {
      this.board = this.$refs.board;
      this.context = this.board.getContext("2d");
      this.pipe_y = this.getRandomInt(30, 280);
    },

    loadAssets() {
      // Load images
      this.bg_img = new Image();
      this.bg_img.src = "/assets/background.png";

      this.player_img = new Image();
      this.player_img.src = "/assets/player.png";

      this.ground_img = new Image();
      this.ground_img.src = "/assets/ground.png";

      this.pipe_up_img = new Image();
      this.pipe_up_img.src = "/assets/pipe_up.png";

      this.pipe_down_img = new Image();
      this.pipe_down_img.src = "/assets/pipe_down.png";

      // Start game loop once images are loaded
      Promise.all([
        new Promise(resolve => this.bg_img.onload = resolve),
        new Promise(resolve => this.player_img.onload = resolve),
        new Promise(resolve => this.ground_img.onload = resolve),
        new Promise(resolve => this.pipe_up_img.onload = resolve),
        new Promise(resolve => this.pipe_down_img.onload = resolve)
      ]).then(() => {
        this.update();
      });
    },

    setupEventListeners() {
      document.addEventListener("keydown", this.jump);
      this.board.addEventListener("click", this.handleClick);
    },

    removeEventListeners() {
      document.removeEventListener("keydown", this.jump);
      this.board.removeEventListener("click", this.handleClick);
    },

    update() {
      requestAnimationFrame(this.update);

      // Background & Ground Scrolling
      this.bg_x_pos -= this.bg_scroll_spd;
      this.ground_x_pos -= this.ground_scroll_spd;

      // Reset Background & Ground's positions
      if (this.bg_x_pos <= -this.bg_width) {
        this.bg_x_pos = 0;
      }

      if (this.ground_x_pos <= -this.bg_width) {
        this.ground_x_pos = 0;
      }

      if (this.has_moved) {
        this.velocity += 0.25;
        this.player.y += this.velocity;
        
        // Move Pipes
        this.pipe_x += this.p_velocity;
      }

      if (this.pipe_x < -this.pipe_w) {
        this.pipe_respawn();
      }

      // Check if player is touching Pipe
      if (
        this.checkCollision(
          this.player.x + 3, 
          this.player.y + 3, 
          52, 52, 
          this.pipe_x, 
          this.pipe_y - 360, 
          79, 360
        ) ||
        this.checkCollision(
          this.player.x + 3, 
          this.player.y + 3, 
          52, 52, 
          this.pipe_x, 
          this.pipe_y + this.gap, 
          79, 360
        )
      ) {
        this.game_over();
      }

      // Increase Score
      if (this.pipe_scored === false && this.player.x > this.pipe_x) {
        this.score += 1;
        this.pipe_scored = true;
        this.playScoreSound();
      }

      // Clear Screen
      this.context.clearRect(0, 0, this.board.width, this.board.height);

      // Draw Background
      this.context.drawImage(this.bg_img, this.bg_x_pos, 0, 400, 600);
      this.context.drawImage(this.bg_img, this.bg_x_pos + 399, 0, 400, 600);

      // Draw Ground
      this.context.drawImage(this.ground_img, this.ground_x_pos, 536, 400, 64);
      this.context.drawImage(this.ground_img, this.ground_x_pos + 399, 536, 400, 64);

      // Draw Player
      this.context.drawImage(this.player_img, this.player.x, this.player.y, this.player.width, this.player.height);

      // Draw Pipes
      this.context.drawImage(this.pipe_down_img, this.pipe_x, 0 - this.pipe_h + this.pipe_y, this.pipe_w, this.pipe_h);
      this.context.drawImage(this.pipe_up_img, this.pipe_x, this.pipe_y + this.gap, this.pipe_w, this.pipe_h);

      // Reset Player if too high or low
      if (this.player.y < -64 || this.player.y > 536) {
        this.game_over();
      }

      // Draw Score
      this.context.fillStyle = "White";
      this.context.font = "60px Arial";
      this.context.fillText(this.score, 181, 80);
    },

    jump(key) {
      if (key.code === "Space") {
        if (this.has_moved === false) {
          this.has_moved = true;
        }
        this.velocity = -8;
        this.playWooshSound();
      }
    },

    handleClick() {
      if (this.has_moved === false) {
        this.has_moved = true;
      }
      this.velocity = -8;
      this.playWooshSound();
    },

    game_over() {
      this.player.x = 172;
      this.player.y = 300;
      this.score = 0;
      this.has_moved = false;
      this.velocity = 0;
      this.pipe_reset();
      this.playSlapSound();
    },

    pipe_respawn() {
      this.pipe_x = 400;
      this.pipe_y = this.getRandomInt(30, 280);
      this.pipe_scored = false;
    },

    pipe_reset() {
      this.pipe_x = 600;
      this.pipe_y = this.getRandomInt(30, 280);
      this.pipe_scored = false;
    },

    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
      return x1 < x2 + w2 &&
        x2 < x1 + w1 &&
        y1 < y2 + h2 &&
        y2 < y1 + h1;
    },

    playSlapSound() {
      // Simple beep sound for slap
      this.playBeep(150, 200, 0.1);
    },

    playWooshSound() {
      // Simple beep sound for woosh
      this.playBeep(300, 100, 0.1);
    },

    playScoreSound() {
      // Simple beep sound for score
      this.playBeep(800, 150, 0.1);
    },

    playBeep(frequency, duration, volume) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'Reg';
  src: url('/assets/BaiJamjuree-Bold.ttf') format("truetype");
  font-display: swap;
}

.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #111827;
}

#board {
  background-color: green;
  border: 2px solid #333;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

body {
  font-family: 'Reg', Arial, sans-serif;
  text-align: center;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>