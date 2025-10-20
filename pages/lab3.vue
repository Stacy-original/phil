<template>
  <div class="flex min-h-screen bg-gray-900">
    <!-- Sidebar - Hidden on mobile (< 480px) -->
    <div class="sidebar bg-gray-800 w-64 max-sm:hidden overflow-hidden transition-all duration-300">
      <div class="p-4 border-b border-gray-700 flex items-center">
        <h2 class="text-white text-xl font-bold">TV Shows</h2>
      </div>
      
      <div class="py-4">
        <div 
          class="sidebar-item" 
          :class="{ 'active': selectedpic === 'one' }"
          @click="selectedpic = 'one'"
        >
          <div class="flex items-center">
            <div class="w-6 h-6 flex items-center justify-center mr-3">
              <div v-if="selectedpic === 'one'" class="w-3 h-3 bg-red-400 rounded-full"></div>
            </div>
            <span>Breaking Bad</span>
          </div>
        </div>
        
        <div 
          class="sidebar-item" 
          :class="{ 'active': selectedpic === 'two' }"
          @click="selectedpic = 'two'"
        >
          <div class="flex items-center">
            <div class="w-6 h-6 flex items-center justify-center mr-3">
              <div v-if="selectedpic === 'two'" class="w-3 h-3 bg-red-400 rounded-full"></div>
            </div>
            <span>Dexter</span>
          </div>
        </div>
        
        <div 
          class="sidebar-item" 
          :class="{ 'active': selectedpic === 'three' }"
          @click="selectedpic = 'three'"
        >
          <div class="flex items-center">
            <div class="w-6 h-6 flex items-center justify-center mr-3">
              <div v-if="selectedpic === 'three'" class="w-3 h-3 bg-red-400 rounded-full"></div>
            </div>
            <span>Game of Thrones</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 p-4 sm:p-8 overflow-auto">
      <!-- Mobile Radio Buttons - Only show on mobile (< 480px) -->
      <div class="flex flex-col gap-4 mb-8 justify-center items-center sm:hidden" v-if="isMobileView">
        <label class="flex items-center">
          <input class="mx-2 w-5 h-5 text-blue-600" type="radio" value="one" v-model="selectedpic">
          Breaking Bad
        </label>
        <label class="flex items-center">
          <input class="mx-2 w-5 h-5 text-blue-600" type="radio" value="two" v-model="selectedpic">
          Dexter
        </label>
        <label class="flex items-center">
          <input class="mx-2 w-5 h-5 text-blue-600" type="radio" value="three" v-model="selectedpic">
          Game of thrones
        </label>
      </div>

      
      <!-- Default View (No Selection) -->
      <div class="flex flex-col max-sm:gap-6 sm:flex-row justify-center gap-4 mb-8" v-if="!['one','two','three'].includes(selectedpic)">
        <div class="blockcap max-sm:w-full" @click="selectedpic = 'one'"> 
          <img :src="pic1.image" class="w-full max-w-60 h-auto pt-2">
          <p class="text-xl text-center text-white">{{ pic1.name }}</p>
        </div>
        <div class="blockcap max-sm:w-full" @click="selectedpic = 'two'"> 
          <img :src="pic2.image" class="w-full max-w-60 h-auto pt-2">
          <p class="text-xl text-center text-white">{{ pic2.name }}</p>
        </div>
        <div class="blockcap max-sm:w-full" @click="selectedpic = 'three'"> 
          <img :src="pic3.image" class="w-full max-w-60 h-auto pt-2">
          <p class="text-xl text-center text-white">{{ pic3.name }}</p>    
        </div>
      </div>
      
      <!-- Show Details -->
      <div class="flex flex-col max-sm:gap-6 sm:flex-row sm:flex-wrap gap-4 justify-center" v-if="selectedpic == 'one'">
        <div class="blockfor max-sm:w-full" v-for="(pic, index) in breakingbad" :key="index">
          <img :src="pic.image" class="w-full max-w-60 h-auto pt-2">
          <p class="text-xl text-center text-white">{{ pic.name }}</p>
        </div>
      </div>

      <div class="flex flex-col max-sm:gap-6 sm:flex-row sm:flex-wrap gap-4 justify-center" v-if="selectedpic == 'two'">
        <div class="blockfor max-sm:w-full" v-for="(pic, index) in dexterr" :key="index">
          <img :src="pic.image" class="w-full max-w-60 h-auto pt-2">
          <p class="text-xl text-center text-white">{{ pic.name }}</p>
        </div>
      </div>

      <div class="flex flex-col max-sm:gap-6 sm:flex-row sm:flex-wrap gap-4 justify-center" v-if="selectedpic == 'three'">
        <div class="blockfor max-sm:w-full" v-for="(pic, index) in goth" :key="index">
          <img :src="pic.image" class="w-full max-w-60 rounded-xl h-auto pt-2">
          <p class="text-xl text-center text-white">{{ pic.name }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from 'vue';

interface stking {
  name: string,
  image: string
}

const pic1 = reactive<stking>({
  name: 'Breaking Bad',
  image: "/img/bb0.jpg"
})

const pic2 = reactive<stking>({
  name: 'Dexter',
  image: '/img/d0.jpg'
})

const pic3 = reactive<stking>({
  name: 'Game Of Thrones',
  image: '/img/got0.jpg'
})

const breakingbad = reactive<stking[]>([
  {name: 'Breaking Bad', image: "/img/bb0.jpg"},
  {name: 'El Camino', image: "/img/bb2.jpg"},
  {name: 'Better Call Saul', image: "/img/bb1.jpg"},
])

const dexterr = reactive<stking[]>([
  {name: 'Dexter', image: "/img/d0.jpg"},
  {name: 'Dexter New blood', image: "/img/d1.jpg"},
  {name: 'Dexter Ressurection', image: "/img/d2.jpg"},
])

const goth = reactive<stking[]>([
  {name: 'Game Of Thrones', image: "/img/got0.jpg"},
  {name: 'House Of The Dragon', image: "/img/got1.jpg"},
  {name: 'A Knight Of The Seven Kingdoms', image: "/img/got2.jpg"},
])

const selectedpic = ref<string>('')
const isMobileView = ref<boolean>(false)

const checkScreenSize = () => {
  isMobileView.value = window.innerWidth < 480
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
.sidebar {
  @apply flex flex-col;
}

.sidebar-item {
  @apply w-full p-4 text-white cursor-pointer transition-all duration-300;
}

.sidebar-item:hover {
  @apply bg-blue-700;
}

.sidebar-item.active {
  @apply bg-blue-600 border-r-4 border-yellow-400;
}

.blockcap {
  @apply flex flex-col gap-4 border-gray-600 border-2 transition-all duration-300 text-white hover:text-black bg-black w-72 max-sm:w-full max-sm:max-w-[480px] h-auto items-center hover:border-blue-300 hover:border-4 hover:bg-blue-200 rounded-xl cursor-pointer;
}

.blockfor {
  @apply flex flex-col gap-4 border-gray-300 border transition-all duration-300 text-white hover:text-black bg-gray-800 w-72 max-sm:w-full max-sm:max-w-[480px] h-auto items-center hover:border-blue-300 hover:border-4 hover:bg-blue-400 rounded-xl;
}
</style>