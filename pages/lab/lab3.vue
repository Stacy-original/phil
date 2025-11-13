<template>
  <div class="mx-auto bg-[#f5efe6] dark:bg-gray-900 min-h-screen transition-colors duration-300">
    <!-- Rating filter bar -->
    <div class="mb-6 mx-5 mt-4 p-0.5 rounded-full bg-[#d7c2a3] dark:bg-gray-800 shadow">
      <div class="flex flex-wrap justify-center gap-4">
        <label
          v-for="rating in ratings"
          :key="rating"
          class="flex flex-row items-center space-x-2 cursor-pointer select-none rounded-lg transition-all duration-300"
          :class="{
            'bg-[#b89f80] dark:bg-gray-700 shadow-md pl-2 pr-4 my-0.5 py-3 text-white': selectedrating === rating,
            'hover:bg-[#b89f80]/60 dark:hover:bg-gray-700 hover:shadow-md pl-2 pr-4 my-1 py-3 text-[#3b2f2f] dark:text-white': selectedrating !== rating
          }"
        >
          <input type="radio" v-model="selectedrating" :value="rating" class="hidden" />
          <span v-if="rating === 'All'">{{ rating }}</span>
          <span v-else>{{ rating }}/10</span>
        </label>
      </div>
    </div>

    <!-- Movie grid -->
    <div class="px-10 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 pb-10 gap-6">
      <div
        v-for="movie in filteredmovies"
        :key="movie.id"
        class="movie-card bg-[#e9dcc5] dark:bg-gray-800 rounded-xl shadow-lg hover:scale-[1.02] overflow-hidden hover:shadow-xl transition-shadow duration-300 text-[#3b2f2f] dark:text-white"
      >
        <!-- Special Invincible card -->
        <div v-if="movie.id === 2" class="block w-full h-38 cursor-pointer">
          <div class="w-full h-38 cursor-pointer" @click="handleMovieClick(movie.id)" @mouseleave="offDescription(movie.id)">
            <div v-if="!movie.showDescription" class="image-container h-full">
              <img :src="movie.image" :alt="movie.name" class="w-full sm:h-[580px] max-sm:h-[300px] object-cover" />
            </div>

            <div v-else class="description-container h-[580px] max-sm:h-[300px] p-4 bg-[#c8b69e] dark:bg-gray-700 flex flex-col items-center justify-center relative">
              <p class="sm:text-xl max-sm:text-sm text-[#3b2f2f] dark:text-gray-300 leading-relaxed text-center mb-6">
                {{ movie.description }}
              </p>
              <NuxtLink
                to="/lab4"
                class="hover:bg-[#a3835e] bg-[#b5956d] dark:hover:bg-gray-600 dark:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Are you sure?
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Normal cards -->
        <div v-else class="w-full h-38 cursor-pointer" @click="toggleDescription(movie.id)" @mouseleave="offDescription(movie.id)">
          <div v-if="!movie.showDescription" class="h-full">
            <img :src="movie.image" :alt="movie.name" class="w-full h-[580px] max-sm:h-[300px] object-cover" />
          </div>

          <div v-else class="description-container h-[580px] max-sm:h-[300px] p-4 bg-[#c8b69e] dark:bg-gray-700 flex items-center justify-center">
            <p class="sm:text-xl max-sm:text-sm text-[#3b2f2f] dark:text-gray-300 leading-relaxed text-center">{{ movie.description }}</p>
          </div>
        </div>

        <div class="p-4">
          <h3 class="text-xl font-bold mb-2 text-[#3b2f2f] dark:text-white">{{ movie.name }}</h3>
          <div class="space-y-1 text-sm max-sm:hidden">
            <p><span class="font-semibold">Genre:</span> {{ movie.genre }}</p>
            <p><span class="font-semibold">Year:</span> {{ movie.releaseYear }}</p>
            <p><span class="font-semibold">Rating:</span> {{ movie.rating }}/10</p>
          </div>
        </div>
      </div>
    </div>

    <!-- No results -->
    <div v-if="filteredmovies.length === 0" class="text-center py-8">
      <p class="text-xl text-[#3b2f2f] dark:text-white">Movies are not found</p>
    </div>

    <audio ref="soundElement" preload="auto">
      <source src="/sound/areyousure.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>


<script setup lang="ts">
import { reactive, ref, computed } from 'vue';

const colorMode = useColorMode();

function toggleTheme() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}

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
    name: "Invincible",
    image: "/img/invincible.jpg",
    releaseYear: '2021',
    rating: '10',
    genre: 'comic',
    description: 'Are you sure?',
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
  },
  {
  id: 11,
  name: "The Boys",
  image: "/img/theboys.jpg",
  releaseYear: '2019',
  rating: '9',
  genre: 'superhero satire',
  description: 'A group of vigilantes sets out to take down corrupt superheroes who abuse their superpowers and fame for their own benefit.',
  showDescription: false
},
{
    id: 12,
    name: "House of the Dragon",
    image: "/img/houseofthedragon.jpg",
    releaseYear: '2022',
    rating: '9',
    genre: 'fantasy drama',
    description: 'The story of the Targaryen civil war that took place about 200 years before events portrayed in Game of Thrones.',
    showDescription: false
  },
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

const playSound = () => {
  const audio = new Audio('/sound/areyousure.mp3')
  audio.play().catch(error => {
    console.log('Audio play failed:', error)
  })
}

const handleMovieClick = (id: number) => {
  if (id === 2) {
    playSound()
  }
  toggleDescription(id)
}
const toggleDescription = (id: number) => {
  const movie = movies.find(m => m.id === id)
  if (movie) {
    movie.showDescription = !movie.showDescription
  }
}

const offDescription = (id: number) => {
  const movie = movies.find(m => m.id === id)
  if (movie) {
    movie.showDescription = false
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

.movie-card {
  transition: transform 0.2s ease-in-out;
}

</style>