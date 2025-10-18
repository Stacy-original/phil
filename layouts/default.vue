<template>
    <body class="overscroll-none bg-black"></body>
    <header class="flex flex-row w-full relative bg-black border-b-2  border-gray-600 max-sm:justify-between max-sm:relative " >
        <div class="basis-1/4 items-center justify-start px-8 min-w-40 max-sm:basis-auto select-none">
            <img src="assets\images\kasyakbg.png" class="w-32 h-16 transparent ">
        </div>
        <div class="basis-1/4 max-sm:basis-auto">
        </div>


        <!-- burger -->
        <nav :class="{'basis-1/2 flex flex-row items-center justify-end px-8 gap-4': true,
        'max-sm:basis-auto max-sm:absolute max-sm:top-full max-sm:w-full max-sm:justify-center max-sm:flex-col max-sm:gap-0 max-sm:bg-black max-sm:px-0 max-sm:border-2 border-gray-600': burger,  
        'max-sm:hidden': !burger}" class="bg-black text-white select-none">

        <NuxtLink to="/" @click="burger = false" class="my-auto p-2 hover:bg-blue-200 hover:text-black rounded-lg max-sm:rounded-none transition-all 
        duration-300 max-sm:w-full max-sm:border-b-2 max-sm:border-gray-600 max-sm:text-center cursor-pointer select-none"> Home </NuxtLink>  
            
            <div class="relative my-auto p-2 hover:bg-blue-200 hover:text-black  rounded-lg max-sm:rounded-none transition-all duration-300 max-sm:w-full 
            max-sm:text-center max-sm:border-b-2 max-sm:border-gray-600 cursor-pointer select-none"
            :class="{'hover:bg-blue-200 hover:text-black  hover:rounded-lg max-sm:hover:rounded-none': true,'bg-gray-600 text-white rounded-lg max-sm:rounded-none': submenu}
            "@click="switch_submenu" @mouseleave="closeWithDelay"  @mouseenter="cancelClose" role="button" tabindex="0">Labs
            
                <div v-show="submenu" class="flex flex-col absolute top-full bg-black text-white w-56 mt-3 text-center border-2 border-gray-600 shadow-lg
                 max-sm:relative max-sm:w-full max-sm:text-white max-sm:border-t max-sm:border-black">

                <NuxtLink to="/lab3" @click="burger = false" class="relative group p-2 overflow-hidden transition-all sm:border-b-2 sm:border-gray-600 max-sm:border-b-2 max-sm:border-gray-600 duration-500 text-white hover:text-black"><span class="relative z-10">Lab 3</span> 
                <span class="absolute inset-0 bg-blue-200 scale-x-0 origin-center transition-transform duration-500 ease-out group-hover:scale-x-100"></span>
                </NuxtLink>
                <NuxtLink to="/lab4" @click="burger = false" class="relative group p-2 overflow-hidden transition-all sm:border-b-2 sm:border-gray-600 max-sm:border-b-2 max-sm:border-gray-600 duration-500 text-white hover:text-black"><span class="relative z-10">Lab 4</span> 
                <span class="absolute inset-0 bg-blue-200 scale-x-0 origin-center transition-transform duration-500 ease-out group-hover:scale-x-100"></span>
                </NuxtLink>
                <NuxtLink to="/lab5" @click="burger = false" class="relative group p-2 overflow-hidden transition-all sm:border-b-2 sm:border-gray-600 max-sm:border-b-2 max-sm:border-gray-600 duration-500 text-white hover:text-black"><span class="relative z-10">Lab 5</span> 
                <span class="absolute inset-0 bg-blue-200 scale-x-0 origin-center transition-transform duration-500 ease-out group-hover:scale-x-100"></span>
                </NuxtLink>
                <NuxtLink to="/lab6" @click="burger = false" class="relative group p-2 overflow-hidden transition-all duration-500 text-white hover:text-black"><span class="relative z-10">Lab 6</span> 
                <span class="absolute inset-0 bg-blue-200 scale-x-0 origin-center transition-transform duration-500 ease-out group-hover:scale-x-100"></span>
                </NuxtLink>

                </div>

            </div>

        <NuxtLink to="/login" @click="burger = false" class="my-auto p-2 hover:bg-blue-200 hover:text-black rounded-lg max-sm:rounded-none
         transition-all duration-300 max-sm:w-full max-sm:border-b-2 max-sm:border-gray-600 max-sm:text-center cursor-pointer select-none">Log in</NuxtLink>

        <NuxtLink to="/logout" @click="burger = false" class="my-auto p-2 hover:bg-blue-200 hover:text-black rounded-lg max-sm:rounded-none
         transition-all duration-300 max-sm:w-full  max-sm:text-center cursor-pointer select-none">Log out</NuxtLink> 

        </nav>




        <div v-if="!burger" @click="switch_burger" class=" max-sm:flex max-sm:flex-col max-sm:mr-8 max-sm:justify-between max-sm:items-center max-sm:w-8 max-sm:h-6 self-center">
            <span class="h-[3px] w-full bg-white"></span>
            <span class="h-[3px] w-full bg-white"></span>
            <span class="h-[3px] w-full bg-white"></span>
        </div>
        <div v-else class=" max-sm:flex max-sm:flex-col max-sm:mr-8 max-sm:justify-between max-sm:items-center max-sm:w-8 max-sm:h-6 self-center" @click="switch_burger">
            <span class="h-[3px] w-full bg-white rotate-45 relative top-[9px]"></span>
            <span class="h-[3px] w-full bg-white opacity-0"></span>
            <span class="h-[3px] w-full bg-white relative bottom-3 rotate-[-45deg]"></span>
        </div>
    </header>

    <main class="p-5 flex bg-gradient-to-tr from-gray-600 justify-center to-blue-200 min-h-screen">
        <slot/>
    </main>

    <footer class="flex flex-row w-full bg-black border-t-2 border-gray-600 items-center justify-center px-4 py-2 gap-4">
        <a href="https://github.com/"><img src="assets/images/github.png" class="w-8 h-8"></a>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><img src="assets/images/youtube.png" class="w-8 h-8"></a>
        <a href="https://www.facebook.com/"><img src="assets/images/facebook.png" class="w-8 h-8"></a>
    </footer>
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


const burger = ref<boolean>(false);
const submenu = ref<boolean>(false);

const switch_burger = () => {burger.value = !burger.value;};
const switch_submenu = () => {submenu.value = !submenu.value;};

let closeTimeout: ReturnType<typeof setTimeout> | null = null;
const closeWithDelay = () => {closeTimeout = setTimeout(() => {submenu.value = false; }, 400);}; // delay in ms
const cancelClose = () => {if (closeTimeout) {clearTimeout(closeTimeout);closeTimeout = null;}};
</script>
