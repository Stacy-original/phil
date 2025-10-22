<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Top Navigation Bar -->
    <nav class="bg-gray-800 py-4 px-6 shadow-lg">
      <div class="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
        <h1 class="text-white text-xl font-bold mb-2 sm:mb-0">TV Shows</h1>
        <div class="flex flex-wrap justify-center gap-2 sm:gap-4">
          <button 
            class="nav-btn" 
            :class="{ 'active': selectedShow === '' }"
            @click="selectedShow = ''"
          >
            All Shows
          </button>
          <button 
            class="nav-btn" 
            :class="{ 'active': selectedShow === 'breakingbad' }"
            @click="selectedShow = 'breakingbad'"
          >
            Breaking Bad
          </button>
          <button 
            class="nav-btn" 
            :class="{ 'active': selectedShow === 'dexter' }"
            @click="selectedShow = 'dexter'"
          >
            Dexter
          </button>
          <button 
            class="nav-btn" 
            :class="{ 'active': selectedShow === 'got' }"
            @click="selectedShow = 'got'"
          >
            Game of Thrones
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="p-4 sm:p-8 overflow-auto">
      <!-- Default View (All Shows) -->
      <div v-if="selectedShow === ''" class="flex flex-col max-sm:gap-6 sm:flex-row justify-center gap-4 mb-8">
        <div 
          v-for="show in allShows" 
          :key="show.id"
          class="show-card"
          @click="selectedShow = show.id"
        > 
          <img :src="show.image" :alt="show.name" class="show-image">
          <p class="text-xl text-center text-white mt-2">{{ show.name }}</p>
        </div>
      </div>
      
      <!-- Show Details -->
      <transition name="fade" mode="out-in">
        <div v-if="selectedShow === 'breakingbad'" class="show-details">
          <h2 class="text-2xl font-bold text-white mb-6 text-center">Breaking Bad Universe</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            <div 
              v-for="(item, index) in breakingbad" 
              :key="index"
              class="show-item"
            >
              <img :src="item.image" :alt="item.name" class="show-image">
              <p class="text-xl text-center text-white mt-2">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </transition>

      <transition name="fade" mode="out-in">
        <div v-if="selectedShow === 'dexter'" class="show-details">
          <h2 class="text-2xl font-bold text-white mb-6 text-center">Dexter Universe</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            <div 
              v-for="(item, index) in dexter" 
              :key="index"
              class="show-item"
            >
              <img :src="item.image" :alt="item.name" class="show-image">
              <p class="text-xl text-center text-white mt-2">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </transition>

      <transition name="fade" mode="out-in">
        <div v-if="selectedShow === 'got'" class="show-details">
          <h2 class="text-2xl font-bold text-white mb-6 text-center">Game of Thrones Universe</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            <div 
              v-for="(item, index) in got" 
              :key="index"
              class="show-item"
            >
              <img :src="item.image" :alt="item.name" class="show-image rounded-xl">
              <p class="text-xl text-center text-white mt-2">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup>
// Define reactive data
const selectedShow = ref('')

// Define show data
const allShows = [
  { id: 'breakingbad', name: 'Breaking Bad', image: '/img/bb0.jpg' },
  { id: 'dexter', name: 'Dexter', image: '/img/d0.jpg' },
  { id: 'got', name: 'Game of Thrones', image: '/img/got0.jpg' }
]

const breakingbad = [
  { name: 'Breaking Bad', image: '/img/bb0.jpg' },
  { name: 'El Camino', image: '/img/bb2.jpg' },
  { name: 'Better Call Saul', image: '/img/bb1.jpg' }
]

const dexter = [
  { name: 'Dexter', image: '/img/d0.jpg' },
  { name: 'Dexter New Blood', image: '/img/d1.jpg' },
  { name: 'Dexter Resurrection', image: '/img/d2.jpg' }
]

const got = [
  { name: 'Game of Thrones', image: '/img/got0.jpg' },
  { name: 'House of the Dragon', image: '/img/got1.jpg' },
  { name: 'A Knight of the Seven Kingdoms', image: '/img/got2.jpg' }
]
</script>

<style scoped>
.nav-btn {
  @apply px-4 py-2 rounded-lg text-white font-medium transition-all duration-300;
  background-color: #374151; /* gray-700 */
}

.nav-btn:hover {
  @apply bg-blue-600 transform scale-105;
}

.nav-btn.active {
  @apply bg-blue-500 text-white shadow-lg;
}

.show-card {
  @apply flex flex-col border-2 border-gray-600 transition-all duration-300 text-white bg-black w-72 max-sm:w-full max-sm:max-w-[480px] h-auto items-center hover:border-blue-300 hover:border-4 hover:bg-blue-200 rounded-xl cursor-pointer;
}

.show-card:hover p {
  @apply text-black;
}

.show-item {
  @apply flex flex-col border border-gray-300 transition-all duration-300 text-white bg-gray-800 w-72 max-sm:w-full max-sm:max-w-[480px] h-auto items-center hover:border-blue-300 hover:border-4 hover:bg-blue-400 rounded-xl;
}

.show-item:hover p {
  @apply text-black;
}

.show-image {
  @apply w-full max-w-60 h-auto pt-2;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.show-details {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>