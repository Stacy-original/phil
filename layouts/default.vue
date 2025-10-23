<template>
  <body class="overscroll-none bg-gray-900"></body>
  <header class="bg-gray-950 sm:fixed border-gray-100 flex flex-row w-full border-b max-sm:justify-between max-sm:relative overscroll-none z-50">
    <!-- Sidebar Starts -->

    <!-- sidebar button -->
    <div class="self-center rounded-full hover:bg-gray-500 w-14 ml-3 h-12 hover:bg-opacity-20 transition-colors duration-200 flex items-center justify-center select-none max-sm:z-50" role="button" tabindex="0" @click="switch_sidebar">
        <div class="flex flex-col justify-between items-center w-6 h-4">
          <span class="h-[2px] w-full bg-white transition-all duration-300" :class="{'rotate-45 translate-y-[7px]': sidebar}"></span>
          <span class="h-[2px] w-full bg-white transition-all duration-300" :class="{'opacity-0': sidebar}"></span>
          <span class="h-[2px] w-full bg-white transition-all duration-300" :class="{' -rotate-45 -translate-y-[7px]': sidebar}"></span>
        </div>
    </div>
      
      <!-- Sidebar guts -->
      <div v-show="sidebar" class="flex flex-col min-h-[calc(100vh-64px)] top-16 left-0 bg-gray-800 border-gray-100s text-white border-t w-64 sm:fixed text-center transition-all duration-300 ease-in-out max-sm:absolute max-sm:top-16 max-sm:left-0 max-sm:w-full max-sm:h-[calc(100vh-64px)] max-sm:z-40 shadow-xl">
        <!-- Search Bar - Mobile Version -->
        <div class="p-4 border-b border-gray-700 max-sm:block hidden">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              class="w-full px-4 py-2 pl-10 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-transparent"
            >
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
        
        <div class="pt-2 border-gray-700"></div>

        <!-- Home menu -->
        <NuxtLink to="/" @click="sidebar = false" class="side-butt side-butt-mobile flex items-center justify-start gap-3 px-4 py-3 mx-3 mt-3 rounded-xl transition-all duration-300 group hover:bg-blue-600 hover:shadow-lg hover:scale-[1.02] border-l-4 border-transparent hover:border-blue-400 max-sm:border-b max-sm:border-gray-600 max-sm:rounded-none max-sm:mx-0">
        <svg class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <span class="font-medium transition-all duration-300 group-hover:translate-x-1">Home</span>
      </NuxtLink>

      <!-- Lab menu -->
        <div class="side-butt-mobile mt-2 rounded-xl overflow-hidden max-sm:mx-0">

          <div class="relative side-butt flex items-center justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer select-none max-sm:rounded-none max-sm:border-b max-sm:border-gray-600"
              :class="{'bg-blue-600 shadow-lg scale-[1.02] border-l-4 border-blue-400': submenu, 'hover:bg-gray-800 hover:scale-[1.02] border-l-4 border-transparent': !submenu}"
              @click="switch_submenu" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" role="button" tabindex="0">
            <svg class="w-5 h-5 transition-transform duration-300" :class="{'rotate-90 scale-110': submenu, 'group-hover:scale-110': !submenu}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <span class="font-medium transition-all duration-300" :class="{'translate-x-1': submenu, 'group-hover:translate-x-1': !submenu}">Labs</span>
            <svg class="w-4 h-4 ml-auto transition-transform duration-300" :class="{'rotate-180': submenu}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
          
          <!-- submenu -->
          <div class="transition-all duration-500 ease-out overflow-hidden bg-gray-900 bg-opacity-50 select-none"
              :class="{'max-h-0': !submenu, 'max-h-64': submenu}" @mouseleave="closeWithDelay" @mouseenter="cancelClose" >
            <div class="flex flex-col bg-gray-900 border-gray-600 text-center space-y-1 py-2 px-3" >
              <NuxtLink to="/lab3" @click="sidebar = false; burger = false" 
                        class="relative group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-blue-500 hover:shadow-md hover:scale-[1.02] hover:translate-x-2 border-l-2 border-transparent hover:border-blue-300">
                <div class="w-2 h-2 bg-blue-400 rounded-full transition-transform duration-300 group-hover:scale-150"></div>
                <span class="font-medium">Lab 3</span>
                <span class="nav-span rounded-lg"></span>
              </NuxtLink>
              <NuxtLink to="/lab4" @click="sidebar = false; burger = false" 
                        class="relative group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-blue-500 hover:shadow-md hover:scale-[1.02] hover:translate-x-2 border-l-2 border-transparent hover:border-blue-300">
                <div class="w-2 h-2 bg-blue-400 rounded-full transition-transform duration-300 group-hover:scale-150"></div>
                <span class="font-medium">Lab 4</span>
                <span class="nav-span rounded-lg"></span>
              </NuxtLink>
              <NuxtLink to="/lab5" @click="sidebar = false; burger = false" 
                        class="relative group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-blue-500 hover:shadow-md hover:scale-[1.02] hover:translate-x-2 border-l-2 border-transparent hover:border-blue-300">
                <div class="w-2 h-2 bg-blue-400 rounded-full transition-transform duration-300 group-hover:scale-150"></div>
                <span class="font-medium">Lab 5</span>
                <span class="nav-span rounded-lg"></span>
              </NuxtLink>
              <NuxtLink to="/lab6" @click="sidebar = false; burger = false" 
                        class="relative group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-blue-500 hover:shadow-md hover:scale-[1.02] hover:translate-x-2 border-l-2 border-transparent hover:border-blue-300">
                <div class="w-2 h-2 bg-blue-400 rounded-full transition-transform duration-300 group-hover:scale-150"></div>
                <span class="font-medium">Lab4</span>
                <span class="nav-span rounded-lg"></span>
              </NuxtLink>
            </div>
          </div>
        </div>
        <!-- Login -->
        <div class="transition-all duration-500 ease-out overflow-hidden mt-2 max-sm:mx-0"
            :class="{'max-h-0': submenu, 'max-h-40': !submenu}">
          <NuxtLink to="/login" @click="sidebar = false" 
                    class="side-butt side-butt-mobile flex items-center justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-300 group hover:bg-green-600 hover:shadow-lg hover:scale-[1.02] border-l-4 border-transparent hover:border-green-400 max-sm:border-b max-sm:border-gray-600 max-sm:rounded-none">
            <svg class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
            <span class="font-medium transition-all duration-300 group-hover:translate-x-1">Log in</span>
          </NuxtLink>
          <!-- logout -->
          <NuxtLink to="/logout" @click="sidebar = false" 
                    class="side-butt side-butt-mobile flex items-center justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-300 group hover:bg-red-600 hover:shadow-lg hover:scale-[1.02] border-l-4 border-transparent hover:border-red-400 max-sm:border-b max-sm:border-gray-600 max-sm:rounded-none mt-2">
            <svg class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span class="font-medium transition-all duration-300 group-hover:translate-x-1">Log out</span>
          </NuxtLink>
        </div>

        <div class="mt-auto py-6 border-t-2 border-gray-700 bg-gray-900 bg-opacity-50 max-sm:border-t max-sm:border-gray-600">
          <div class="text-sm text-gray-400 flex flex-col items-center gap-1">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span>© 2025 KASYAK</span>
            </div>
            <div class="text-xs text-gray-500">All rights reserved</div>
            <footer class="flex flex-row mt-2 w-full items-center justify-center px-4 gap-4">
                <a href="https://github.com/"><img src="assets/images/github.png" class="w-8 h-8"></a>
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><img src="assets/images/youtube.png" class="w-8 h-8"></a>
                <a href="https://www.facebook.com/"><img src="assets/images/facebook.png" class="w-8 h-8"></a>
            </footer>
          </div>
        </div>
      </div>
      <!-- Sidebar ENDS -->


            <!-- Logo Section - Adjusted for better spacing -->
      <div class="flex-1 flex items-center justify-start px-8 max-sm:px-4 max-sm:flex-initial select-none">
          <NuxtLink to="/"><img src="assets\images\kasyakbg.png" class="w-32 h-16 transparent "></NuxtLink>
      </div>
      
      <!-- Search Bar Desktop  -->
      <div class="flex-1 mt-2.5 flex justify-center max-sm:hidden">
        <div class="max-w-md w-full">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              class="w-full px-4 py-2 pl-10 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-transparent"
            >
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Account Button  -->
      <div class="flex-1 flex mr-5 justify-end items-center pr-4 max-sm:pr-2 relative" @mouseleave="closeWithDelayacc" @mouseenter="cancelClose">
        <div class="self-center rounded-full hover:bg-gray-500 w-12 h-12 hover:bg-opacity-20 transition-colors duration-200 flex items-center justify-center select-none" role="button" tabindex="0" @click="switch_accountmenu">
          <img src="assets/images/user.png" class="w-8 h-8 rounded-full" alt="Account">
        </div>

        <!-- Account Menu -->
        <div v-show="accountmenu" class="absolute top-16 mt-0.5 right-4 side-color text-white w-64 rounded-lg shadow-xl z-50 border border-gray-600">
          <div class="p-4 border-b border-gray-700">
            <div class="flex items-center gap-3">
              <img src="assets/images/user.png" class="w-10 h-10 rounded-full" alt="User">
              <div class="flex-1 min-w-0">
                <p class="font-medium truncate">Guest User</p>
                <p class="text-sm text-gray-400 truncate">Not logged in</p>
              </div>
            </div>
          </div>
          
          <div class="p-2">
            <NuxtLink to="/login" @click="accountmenu = false" 
                      class="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-gray-600 hover:shadow-md group">
              <svg class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              <span class="font-medium">Log in</span>
            </NuxtLink>
            
            <NuxtLink to="/logout" @click="accountmenu = false" 
                      class="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-gray-600 hover:shadow-md group mt-1">
              <svg class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span class="font-medium">Log out</span>
            </NuxtLink>
          </div>
          
          <div class="p-3 border-t border-gray-700 bg-gray-900 bg-opacity-50">
            <div class="text-xs text-gray-400 text-center">
              <p>Account Settings</p>
            </div>
          </div>
        </div>
      </div>
  </header>

  <!-- Mobile overlay when sidebar is open -->
  <div v-if="sidebar" class="fixed inset-0 bg-black bg-opacity-50 z-30 max-sm:block hidden" @click="sidebar = false"></div>

  <main class="text-white bg-gray-900 justify-center max-sm:duration-300 max-sm:transition-all min-h-screen transition-all duration-300 max-sm:pt-2 sm:pt-16" :class="{'ml-64  ': sidebar, 'max-sm:overflow-hidden max-sm:h-screen': sidebar && isMobile}">
    <div class=" mx-auto">
      <slot/>
    </div>
  </main>

  <footer class="flex flex-row w-full bg-gray-900 items-center justify-center px-4 py-2 gap-4" v-show="!sidebar">
      <a href="https://github.com/"><img src="assets/images/github.png" class="w-8 h-8"></a>
      <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><img src="assets/images/youtube.png" class="w-8 h-8"></a>
      <a href="https://www.facebook.com/"><img src="assets/images/facebook.png" class="w-8 h-8"></a>
  </footer>
</template>
  

<script setup lang="ts">
import { useHead } from "#app";
import { ref, onMounted, onUnmounted } from "vue";

useHead({
  script: [
    {
      async: true,
      src: "https://www.googletagmanager.com/gtag/js?id=G-1KQZZ47Z6Q",
    },
    {
      innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1KQZZ47Z6Q');            
            `,
      type: "text/javascript",
    },
  ],
  _dangerouslyDisableSanitizersByTagID: {
    gtag: ["innerHTML"],
  },
});


const burger = ref<boolean>(false);
const submenu = ref<boolean>(false);
const sidebar = ref<boolean>(false);
const accountmenu = ref<boolean>(false);
const isMobile = ref<boolean>(false);

const switch_burger = () => {burger.value = !burger.value;};
const switch_submenu = () => {submenu.value = !submenu.value;};
const switch_sidebar = () => {sidebar.value =!sidebar.value};
const switch_accountmenu = () => {accountmenu.value=!accountmenu.value}

// Check if mobile on mount and resize
const checkMobile = () => {
  isMobile.value = window.innerWidth < 640; // 640px is Tailwind's 'sm' breakpoint
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

let closeTimeout: ReturnType<typeof setTimeout> | null = null;
const closeWithDelayacc = () => {closeTimeout = setTimeout(() => {accountmenu.value = false; }, 400);}; // delay in ms
const closeWithDelay = () => {closeTimeout = setTimeout(() => {submenu.value = false; }, 350);};
const closeWithDelay2 = () => {closeTimeout = setTimeout(() => {submenu.value = false; }, 100);};
const cancelClose = () => {if (closeTimeout) {clearTimeout(closeTimeout);closeTimeout = null;}};


let openTimeout: ReturnType<typeof setTimeout> | null = null;
const openWithDelay = () => {openTimeout = setTimeout(() => {submenu.value = true; }, 150);};
const cancelOpen = () => {if (openTimeout) {clearTimeout(openTimeout);openTimeout = null;}};

const handleMouseLeave = () => {if (submenu.value) {closeWithDelay();} else {cancelOpen();}};
const handleMouseEnter = () => {cancelClose();openWithDelay();};

</script>
<style scoped>
  .nav-color{
    @apply bg-gray-950 border-gray-100;
  }
  .side-color{
    @apply bg-gray-800 border-gray-600
  }
  .nav-submenu {
    @apply p-2 overflow-hidden transition-all border-gray-600 duration-500 text-white hover:text-black ;
  }
  .nav-butt {
    @apply  my-auto p-2 hover:bg-blue-200 hover:text-black rounded-lg transition-all duration-300 border-gray-600  cursor-pointer select-none;
  }
  .nav-butt-mobile {
    @apply max-sm:border-b-2 max-sm:border-r-2 max-sm:border-l-2 max-sm:w-full max-sm:text-center ;
  }

  .side-butt {
    @apply  ml-2 mr-2 h-12 text-center text-xl pt-2 p-2 hover:bg-gray-500 hover:bg-opacity-50 hover:text-white rounded-lg transition-all duration-300 border-gray-600  cursor-pointer select-none;
  }
  .side-butt-mobile {
    @apply  max-sm:text-center;
  }
  .nav-span {
    @apply absolute inset-0 bg-blue-200 scale-x-0 origin-center transition-transform duration-500 ease-out group-hover:scale-x-100;
  }
  .account-menu-enter-active,
  .account-menu-leave-active {
    transition: all 0.3s ease;
  }

  .account-menu-enter-from,
  .account-menu-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
</style>