<template>
  <div class="auth-wrapper">
    <div class="auth-container bg-black border-gray-600">
      <h1 class="text-white">Login in system</h1>
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label class="text-white">Login:</label>
          <input 
            v-model="login" 
            type="text" 
            placeholder="Type your login"
            required
            class="bg-blue-200 border-gray-600"
          >
        </div>
        <div class="input-group">
          <label class="text-white">Password:</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="Type your password"
            required
            class="bg-blue-200 border-gray-600"
          >
        </div>
        <button type="submit" class="bg-blue-200 border-gray-600">Sign In</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const login = ref('');
const password = ref('');

const handleSubmit = () => {
  console.log('Отправка данных:', {
    login: login.value,
    password: password.value
  });
  // Здесь будет ваша логика авторизации
};
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 300px;
  padding: 20px;
  border: 1px solid;
  border-radius: 5px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid;
  border-radius: 3px;
}

button {
  width: 100%;
  padding: 10px;
  color: black;
  border: 1px solid;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}
</style>