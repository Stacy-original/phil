<template>
  <div class="overscroll-none font-sans transition-colors duration-300">
    <!-- HEADER -->
    <header class="sm:fixed flex flex-row w-full max-sm:justify-between max-sm:relative overscroll-none z-50 dark:bg-gray-950 bg-[#d9c5b2] border-b border-[#b38b6d] dark:border-gray-800">
      <!-- Sidebar Component -->
      <DefaultSidebar :sidebar="sidebar" @update:sidebar="sidebar = $event" @close-sidebar="sidebar = false"/>

      <!-- Logo -->
      <div class="flex-1 flex items-center justify-start px-8 max-sm:px-4 max-sm:flex-initial select-none">
        <NuxtLink to="/"><img src="/assets/images/kasyakbg.png" class="w-32 h-16" /></NuxtLink>
      </div>

      <!-- Search Bar Desktop -->
      <div class="flex-1 mt-2.5 flex justify-center max-sm:hidden">
        <div class="max-w-md w-full">
          <div class="relative">
            <input type="text" placeholder="Search..."
              class="w-full px-4 py-2 pl-10 rounded-lg border focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-700 focus:ring-gray-200 bg-[#e7d7c1] text-[#4b2e05] placeholder-[#7b4b26] border-[#b38b6d]"/>
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Account Button + Menu -->
      <div class="flex-1 flex mr-5 justify-end items-center pr-4 max-sm:pr-2 relative gap-2" @mouseleave="closeWithDelayacc" @mouseenter="cancelClose">
        <!-- Account Button -->
        <div class="self-center rounded-full hover:bg-gray-500 w-12 h-12 hover:bg-opacity-20 transition-colors duration-200 flex items-center justify-center select-none" role="button" tabindex="0" @click="switch_accountmenu">
          <img src="/assets/images/user.png" class="w-8 h-8 rounded-full" alt="Account" />
        </div>

        <!-- Account Menu -->
        <div v-show="accountmenu" class="absolute top-16 mt-0.5 right-4 w-64 rounded-lg shadow-xl z-50 border dark:bg-gray-800 dark:border-gray-700 dark:text-white bg-[#f2e6d8] border-[#b38b6d] text-[#3a2a1a]">
          <div class="p-4 font-medium border-b dark:border-gray-700 border-[#b38b6d]">
            Account Menu
          </div>
          <ul>
            <li class="px-4 py-2 hover:bg-[#e7d7c1] dark:hover:bg-gray-700 cursor-pointer">Profile</li>
            <li class="px-4 py-2 hover:bg-[#e7d7c1] dark:hover:bg-gray-700 cursor-pointer">Settings</li>
            <li class="px-4 py-2 hover:bg-[#e7d7c1] dark:hover:bg-gray-700 cursor-pointer">Logout</li>

            <!-- Theme Toggle (moved here) -->
            <li class="px-4 py-2 flex items-center justify-between hover:bg-[#e7d7c1] dark:hover:bg-gray-700 cursor-pointer border-t dark:border-gray-700 border-[#b38b6d]" @click="toggleTheme">
              <span>Theme</span>
              <span class="text-xl">
                <span v-if="colorMode.value === 'dark'">☀️</span>
                <span v-else>🌙</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </header>

    <div
      v-if="sidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 max-sm:block hidden"
      @click="sidebar = false"
    ></div>

    <!-- MAIN -->
    <main
      class="min-h-screen transition-all duration-300
      dark:bg-gray-900 dark:text-white
      bg-[#fff8f0] text-[#3a2a1a]
      max-sm:pt-2 sm:pt-16"
      :class="{ 'ml-64 max-sm:overflow-hidden max-sm:h-screen max-sm:hidden': sidebar }"
    >
      <div class="mx-auto">
        <slot />
      </div>
    </main>

    <!-- FOOTER -->
    <footer
      class="flex flex-row w-full items-center justify-center px-4 py-2 gap-4
      dark:bg-gray-900 bg-[#c4a484]"
      v-show="!sidebar"
    >
      <a href="https://github.com/"><img src="/assets/images/github.png" class="w-8 h-8" /></a>
      <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><img src="/assets/images/youtube.png" class="w-8 h-8" /></a>
      <a href="https://www.facebook.com/"><img src="/assets/images/facebook.png" class="w-8 h-8" /></a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useHead } from "#app";
import { ref } from "vue";

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

const colorMode = useColorMode();

function toggleTheme() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}

const sidebar = ref<boolean>(false);
const accountmenu = ref<boolean>(false);

const switch_accountmenu = () => {
  accountmenu.value = !accountmenu.value;
};

let closeTimeout: ReturnType<typeof setTimeout> | null = null;
const closeWithDelayacc = () => {
  closeTimeout = setTimeout(() => {
    accountmenu.value = false;
  }, 400);
};

const cancelClose = () => {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }
};
</script>
