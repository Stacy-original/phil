<template>
  <div
    class="mx-auto min-h-screen transition-colors duration-300
    dark:bg-gray-900 dark:text-white
    bg-[#fff8f0] text-[#3a2a1a]"
  >
    <!-- Title -->
    <h1 class="text-3xl font-bold text-center mb-6 pt-4">GAMES</h1>

    <!-- Games Grid -->
    <div class="px-10 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 pb-10 gap-6">
      <div
        v-for="game in games"
        :key="game.id"
        class="game-card rounded-xl shadow-lg hover:scale-[1.02] overflow-hidden hover:shadow-xl transition-all duration-300
        dark:bg-gray-800 bg-[#e7d7c1] border dark:border-gray-700 border-[#b38b6d]"
      >
        <!-- Game Image -->
        <NuxtLink :to="game.link" class="block w-full h-38 cursor-pointer">
          <img
            :src="game.image"
            :alt="game.name"
            class="w-full h-[580px] max-sm:h-[300px] object-cover"
          />
        </NuxtLink>

        <!-- Game Info -->
        <div class="p-4">
          <h3
            class="text-xl font-bold mb-2 cursor-pointer transition-colors duration-200
            hover:text-[#7b4b26] dark:hover:text-gray-300"
            @click="toggleDescription(game.id)"
          >
            {{ game.name }}
          </h3>

          <!-- Description -->
          <div
            v-if="game.showDescription"
            class="mt-3 p-3 rounded-lg transition-colors duration-300
            dark:bg-gray-700 bg-[#d9c5b2] text-center"
          >
            <p class="leading-relaxed dark:text-gray-300 text-[#3a2a1a]">
              {{ game.description }}
            </p>
          </div>

          <!-- Info (default) -->
          <div v-else class="space-y-1 text-sm max-sm:hidden">
            <p>
              <span class="font-semibold">Genre:</span> {{ game.genre }}
            </p>
            <p>
              <span class="font-semibold">Release Year:</span> {{ game.releaseYear }}
            </p>
            <p>
              <span class="font-semibold">Platform:</span> {{ game.platform }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- No Games -->
    <div v-if="games.length === 0" class="text-center py-8">
      <p class="text-xl">No games found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const games = reactive([
  {
    id: 1,
    name: '2048',
    image: '/img/2048.jpg',
    releaseYear: '2014',
    genre: 'Puzzle',
    platform: 'Web, Mobile',
    description:
      'A sliding tile puzzle game where you combine numbered tiles to reach the 2048 tile. Use arrow keys to move all tiles in one direction, merging identical numbers to double their value.',
    link: '/games/2048',
    showDescription: false,
  },
  {
    id: 2,
    name: 'Flappy Bird',
    image: '/img/flappybird.jpg',
    releaseYear: '2013',
    genre: 'Arcade',
    platform: 'Mobile, Web',
    description:
      'A side-scrolling game where you control a bird, attempting to fly between columns of green pipes without hitting them. Tap to flap and navigate through the obstacles.',
    link: '/games/flappybird',
    showDescription: false,
  },
  {
    id: 3,
    name: 'Tic Tac Toe',
    image: '/img/ttt.jpg',
    releaseYear: 'Ancient',
    genre: 'Strategy',
    platform: 'All Platforms',
    description:
      'The classic paper-and-pencil game for two players. Take turns placing X and O marks in a 3x3 grid, trying to get three in a row horizontally, vertically, or diagonally.',
    link: '/games/ttt',
    showDescription: false,
  },
])

const toggleDescription = (id: number) => {
  const game = games.find((g) => g.id === id)
  if (game) game.showDescription = !game.showDescription
}
</script>

<style scoped>
.game-card {
  transition: transform 0.2s ease-in-out;
}
</style>
