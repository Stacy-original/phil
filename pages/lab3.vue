<template>
  <div class="mx-auto bg-gray-900 min-h-screen">
    <div class="mb-6 mx-5 mt-4 p-0.5 rounded-full bg-gray-800 shadow">
      <div class="flex flex-wrap justify-center gap-4">
        <label v-for="rating in ratings" :key="rating" class="flex flex-row items-center space-x-2 cursor-pointer select-none pl-2 pr-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-600 hover:shadow-md" role="button">
          <input 
            type="radio" 
            v-model="selectedrating" 
            :value="rating"
            class="text-blue-600 focus:ring-blue-500 hidden"
          >
          <span class="text-white" v-if="rating=='All'">{{ rating }}</span>
          <span class="text-white" v-if="rating !=='All'">{{ rating }}/10</span>
        </label>
      </div>
    </div>

    <div class="px-10 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 pb-10 gap-6">
      <div 
        v-for="movie in filteredmovies" 
        :key="movie.id"
        class="game-card bg-gray-800 rounded-xl shadow-lg hover:scale-[1.02] overflow-hidden hover:shadow-xl transition-shadow duration-300">

        <div class="w-full h-38 cursor-pointer" @click="toggleDescription(movie.id)">

          <div v-if="!movie.showDescription" class="image-container h-full">
            <img 
              :src="movie.image" 
              :alt="movie.name"
              class="w-full h-full object-cover">
          </div>
          
          <div v-else class="description-container h-full p-4 bg-gray-700 flex items-center justify-center">
            <p class="text-sm text-gray-300 leading-relaxed text-center">{{ movie.description }}</p>
          </div>
        </div>

        <div class="p-4">
          <h3 class="text-xl font-bold mb-2">{{ movie.name }}</h3>
          <div class="space-y-1 text-sm">
            <p><span class="font-semibold">Genre:</span> {{ movie.genre }}</p>
            <p><span class="font-semibold">Year:</span> {{ movie.releaseYear }}</p>
            <p><span class="font-semibold">Rating:</span> {{ movie.rating }}/10</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredmovies.length === 0" class="text-center py-8">
      <p class="text-xl text-white">Movies are not found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';

const movies = reactive([
  {
    id: 1,
    name: "The Sopranos",
    image: "/img/sopranos.jpg",
    releaseYear: '1999',
    rating: '10',
    genre: 'crime drama',
    description: 'New Jersey mob boss Tony Soprano deals with personal and professional issues in his home and business life that affect his mental state, leading him to seek professional psychiatric counseling.',
    showDescription: false
  },
  {
    id: 2,
    name: "House of the Dragon",
    image: "/img/houseofthedragon.jpg",
    releaseYear: '2022',
    rating: '9',
    genre: 'fantasy drama',
    description: 'The story of the Targaryen civil war that took place about 200 years before events portrayed in Game of Thrones.',
    showDescription: false
  },
  {
    id: 3,
    name: "The Walking Dead",
    image: "/img/twd.jpg",
    releaseYear: '2010',
    rating: '9',
    genre: 'horror drama',
    description: 'Sheriff Deputy Rick Grimes wakes up from a coma to learn the world is in ruins and must lead a group of survivors to stay alive in a world overrun by the dead.',
    showDescription: false
  },
  {
    id: 4,
    name: "Dexter: Resurrection",
    image: "/img/dexterressurection.jpg",
    releaseYear: '2021',
    rating: '9',
    genre: 'crime thriller',
    description: 'Dexter Morgan returns to face his past and confront new challenges in this revival of the series about a blood spatter analyst who leads a secret life as a vigilante serial killer.',
    showDescription: false
  },
  {
    id: 5,
    name: "Game of Thrones",
    image: "/img/gamofthrones.jpg",
    releaseYear: '2011',
    rating: '10',
    genre: 'fantasy drama',
    description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    showDescription: false
  },
  {
    id: 6,
    name: "Dexter",
    image: "/img/dexter.jpg",
    releaseYear: '2006',
    rating: '10',
    genre: 'crime thriller',
    description: 'By day, mild-mannered Dexter is a blood-spatter analyst for the Miami police. But at night, he is a serial killer who only targets other murderers.',
    showDescription: false
  },
  {
    id: 7,
    name: "El Camino",
    image: "/img/elcamino.jpg",
    releaseYear: '2019',
    rating: '8',
    genre: 'crime drama',
    description: 'After the dramatic events of Breaking Bad, Jesse Pinkman flees from the law and his captors as he tries to make a new life for himself.',
    showDescription: false
  },
  {
    id: 8,
    name: "Dexter: New Blood",
    image: "/img/dexternewblood.jpg",
    releaseYear: '2021',
    rating: '8',
    genre: 'crime thriller',
    description: 'Dexter Morgan is living under an assumed name in a small town, but his Dark Passenger beckons when a new threat emerges in his new community.',
    showDescription: false
  },
  {
    id: 9,
    name: "Better Call Saul",
    image: "/img/bettercallsaul.jpg",
    releaseYear: '2015',
    rating: '10',
    genre: 'crime drama',
    description: 'The trials and tribulations of criminal lawyer Jimmy McGill in the years leading up to his fateful run-in with Walter White and Jesse Pinkman.',
    showDescription: false
  },
  {
    id: 10,
    name: "Breaking Bad",
    image: "/img/breakingbad.jpg",
    releaseYear: '2008',
    rating: '10',
    genre: 'crime drama',
    description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family future.',
    showDescription: false
  }
])

const selectedGenre = ref('All')
const selectedrating = ref('All')

const ratings = computed(() => {
  const uniqueRatings = [...new Set(movies.map(movie => movie.rating))]
  return ['All', ...uniqueRatings]
})

const genres = computed(() => {
  const uniqueGenres = [...new Set(movies.map(movie => movie.genre))]
  return ['All', ...uniqueGenres]
})

const filteredmovies = computed(() => {
  return movies.filter(movie => {
    const genreMatch = selectedGenre.value === 'All' || movie.genre === selectedGenre.value
    const ratingMatch = selectedrating.value === 'All' || movie.rating === selectedrating.value
    return genreMatch && ratingMatch
  })
})

// Toggle description view
const toggleDescription = (id: number) => {
  const movie = movies.find(m => m.id === id)
  if (movie) {
    movie.showDescription = !movie.showDescription
  }
}
</script>

<style scoped>
.blockcap {
  @apply flex flex-col gap-2 border-blue-500 border bg-blue-300 w-72 h-auto items-center hover:border-red-500 hover:border-4 hover:bg-red-300 rounded-xl;
}

.blockfor {
  @apply flex flex-col gap-2 border-blue-500 border bg-blue-300 w-72 h-auto items-center hover:border-yellow-500 hover:border-4 hover:bg-yellow-300 rounded-xl;
}

.game-card {
  transition: transform 0.2s ease-in-out;
}

.game-card:hover {
  transform: translateY(-5px);
}

input[type="radio"] {
  @apply w-4 h-4;
}
</style>