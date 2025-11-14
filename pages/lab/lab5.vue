<template>
  <main class="flex h-screen">
    <div class="flex flex-col m-auto gap-2">
      <p class="text-[50px] flex justify-center mb-5">Antarctica</p>
      <img src="/img/pinguins.jpg" class="w-86 h-80 rounded-xl">
      <p>T in degree: {{ temp }}</p>
      <p>Hum in degree: {{ hum }}</p>
      <p>Wind speed in ms: {{ wind }}</p>
      
      <!-- Debug Button -->
      <button 
        @click="showDebug = !showDebug" 
        class="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors mt-4"
      >
        {{ showDebug ? 'Hide Debug' : 'Show Debug' }}
      </button>

      <!-- Debug-->
      <div v-if="showDebug && debugInfo" class="mt-4 p-4 bg-gray-700 rounded-lg">
        <h3 class="font-bold mb-2 text-lg">Debug Information:</h3>
        <div class="text-sm">
          <p><strong>Status:</strong> {{ debugInfo.status }}</p>
          <p><strong>Last Updated:</strong> {{ debugInfo.lastUpdate }}</p>
          <p v-if="debugInfo.error" class="text-red-400"><strong>Error:</strong> {{ debugInfo.error }}</p>
          <div v-if="debugInfo.responseData" class="mt-2">
            <strong>Full Response:</strong>
            <pre class="bg-gray-900 p-2 rounded border border-gray-600 overflow-auto max-h-40 text-green-400">{{ JSON.stringify(debugInfo.responseData, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <audio controls>
        <source src="/sound/kawa.mp3">
      </audio>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const temp = ref<string>('');
const hum = ref<string>('');
const wind = ref<string>('');
const debugInfo = ref<any>(null);
const showDebug = ref<boolean>(false); 

const fetching = async (): Promise<void> => {
  try {
    debugInfo.value = {
      status: 'Fetching...',
      lastUpdate: new Date().toLocaleTimeString(),
      error: null,
      responseData: null
    };

    let response;
    try {
      response = await axios.get(
        'https://api.open-meteo.com/v1/forecast?latitude=-75.250973&longitude=-0.071389&current=temperature_2m,relative_humidity_2m,wind_speed_10m',
        {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
          }
        }
      );
    } catch (firstError) {
      console.log('Error is:', firstError);
      
      response = await axios.get(
        'https://94.130.142.35/v1/forecast?latitude=-75.250973&longitude=-0.071389&current=temperature_2m,relative_humidity_2m,wind_speed_10m',
        {
          timeout: 10000,
          headers: {
            'Host': 'api.open-meteo.com',
            'Accept': 'application/json',
          },
        }
      );
    }

    const data = response.data;
    
    if (data.current) {
      temp.value = data.current.temperature_2m;
      hum.value = data.current.relative_humidity_2m;
      wind.value = data.current.wind_speed_10m;
    }

    debugInfo.value = {
      status: 'Success',
      lastUpdate: new Date().toLocaleTimeString(),
      error: null,
      responseData: data
    };

  } catch (error: any) {
    console.error('Error fetching weather data:', error);
    
    debugInfo.value = {
      status: 'Error',
      lastUpdate: new Date().toLocaleTimeString(),
      error: error.message || 'Unknown error occurred',
      responseData: error.response ? error.response.data : null
    };

    temp.value = 'N/A';
    hum.value = 'N/A';
    wind.value = 'N/A';
  }
}

onMounted(() => {
  console.log('Component mounted, starting weather data fetch...');
  fetching();
  
  setInterval(fetching, 5000);
});
</script>