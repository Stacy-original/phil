<template>
  <main class="p-4   min-h-screen">
    <div class="flex gap-4 mb-8 justify-center">
      <label><input class="mx-2 " type="radio" value="none" v-model="selectedpic">Univerces</label>
      <label><input class="mx-2" type="radio" value="one" v-model="selectedpic">Breaking Bad</label>
      <label><input class="mx-2" type="radio" value="two" v-model="selectedpic">Dexter</label>
      <label><input class="mx-2" type="radio" value="three" v-model="selectedpic">Game of thrones</label>
    </div>

  
    <div class="flex justify-center gap-4 mb-8" v-if="selectedpic == 'none'">
      <div class="blockcap"> 
        <img :src="pic1.image" class="w-60 h-68 pt-2">
        <p class="text-black text-xl">{{ pic1.name }}</p>
      </div>
      <div class="blockcap"> 
        <img :src="pic2.image" class="w-60 h-68 pt-2">
        <p class="text-black text-xl">{{ pic2.name }}</p>
      </div>
      <div class="blockcap"> 
        <img :src="pic3.image" class="w-60 h-68 pt-2">
        <p class="text-black text-xl">{{ pic3.name }}</p>    
      </div>

    </div>
    <div class="flex flex-wrap gap-4 justify-center" v-if="selectedpic == 'one'">
      <div class="blockfor" v-for="(pic, index) in breakingbad" :key="index">
        <img :src="pic.image" class="w-60 h-68 pt-2">
        <p class="text-black text-xl">{{ pic.name }}</p>
      </div>
    </div>

    <div class="flex flex-wrap gap-4 justify-center" v-if="selectedpic == 'two'">
      <div class="blockfor" v-for="(pic, index) in dexterr" :key="index">
        <img :src="pic.image" class="w-60 h-68 pt-2">
        <p class="text-black text-xl">{{ pic.name }}</p>
      </div>
    </div>

    <div class="flex flex-wrap gap-4 justify-center" v-if="selectedpic == 'three'">
      <div class="blockfor" v-for="(pic, index) in goth" :key="index">
        <img :src="pic.image" class="w-60 h-68 pt-2">
        <p class="text-black text-xl">{{ pic.name }}</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

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


const selectedpic = ref<string>('none')
</script>

<style scoped>
.blockcap {
  @apply flex flex-col gap-2 border-blue-500 border bg-blue-300 w-72 h-auto items-center hover:border-red-500 hover:border-4 hover:bg-red-300 rounded-xl;
}

.blockfor {
  @apply flex flex-col gap-2 border-blue-500 border bg-blue-300 w-72 h-auto items-center hover:border-yellow-500 hover:border-4 hover:bg-yellow-300 rounded-xl;
}
</style>