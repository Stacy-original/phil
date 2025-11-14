<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4">
    <div 
      class="flex flex-col items-center justify-center space-y-6 transition-all duration-300"
      :class="showMessage ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none h-0 overflow-hidden'"
    >
      <p class="text-4xl md:text-6xl font-bold " id="message">
        {{ message }}
      </p>
      <button 
        id="new-game"
        @click="resetGame"
        class="px-8 py-4 dark:bg-gray-800 bg-[#d9c5b2] text-xl rounded-2xl hover:bg-[#7b4b26] dark:hover:bg-gray-700 transition-colors duration-200 shadow-lg"
      >
        New Game
      </button>
    </div>
    
    <main class="text-center w-full max-w-2xl">
      <h1 class="text-4xl md:text-5xl font-bold mb-8 mt-4">
        Tic Tac Toe
      </h1>
      
      <div class="flex items-center justify-center min-h-[70vh]">
        <div class="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-md aspect-square">
          <button 
            v-for="(cell, index) in cells" 
            :key="index"
            class="cell aspect-square rounded-2xl border-none shadow-lg text-4xl md:text-6xl font-bold transition-all duration-200 flex items-center justify-center text-black"
            :class="getCellClasses(index)"
            :disabled="cell.disabled || showMessage"
            @click="handleCellClick(index)"
          >
            {{ cell.value }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'TicTacToe',
  data() {
    return {
      cells: Array(9).fill().map(() => ({ value: '', disabled: false })),
      isPlayerO: true,
      showMessage: false,
      message: '',
      winPatterns: [
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [3, 4, 5],
        [6, 7, 8]
      ]
    }
  },
  methods: {
    handleCellClick(index) {
      if (this.cells[index].value !== '' || this.showMessage) return;
      
      const newCells = [...this.cells];
      newCells[index] = {
        value: this.isPlayerO ? 'O' : 'X',
        disabled: true
      };
      
      this.cells = newCells;
      this.isPlayerO = !this.isPlayerO;
      this.checkForWinner();
    },
    getCellClasses(index) {
      const baseClasses = 'bg-yellow-200 hover:bg-orange-300';
      const disabledClasses = 'bg-yellow-100 cursor-not-allowed hover:bg-yellow-100';
      
      if (this.cells[index].disabled || this.showMessage) {
        return disabledClasses;
      }
      
      return baseClasses;
    },
    checkForWinner() {
      let winnerFound = false;
      
      for (const pattern of this.winPatterns) {
        const [a, b, c] = pattern;
        if (
          this.cells[a].value &&
          this.cells[a].value === this.cells[b].value &&
          this.cells[a].value === this.cells[c].value
        ) {
          this.displayWinner(this.cells[a].value);
          winnerFound = true;
          break;
        }
      }
      
      if (!winnerFound) {
        const allCellsFilled = this.cells.every(cell => cell.value !== '');
        if (allCellsFilled) {
          this.showMessage = true;
          this.message = 'Match Drawn!';
        }
      }
    },
    displayWinner(winner) {
      this.message = `Congratulations, Winner is ${winner}!`;
      this.showMessage = true;
      this.disableAllCells();
    },
    disableAllCells() {
      this.cells = this.cells.map(cell => ({ ...cell, disabled: true }));
    },
    resetGame() {
      this.cells = Array(9).fill().map(() => ({ value: '', disabled: false }));
      this.isPlayerO = true;
      this.showMessage = false;
      this.message = '';
    }
  }
}
</script>