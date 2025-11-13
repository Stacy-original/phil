<template>
  <div class="account-page">
    <div class="account-card dark:bg-gray-950 bg-[#d9c5b2] border-[#b38b6d] dark:border-gray-600 dark:border-gray-600">
      <h1 class="text-white">My account</h1>
      
      <div class="user-info">
        <div class="avatar text-blue-200">
          <i class="fas fa-user-circle"></i>
        </div>
        <h2 class="text-white">{{ userName }}</h2>
        <p class="dark:text-blue-200 text-blue-600">{{ userEmail }}</p>
      </div>

      <div class="account-actions">
        <button @click="logout" class="logout-btn bg-[#e7d7c1] text-[#4b2e05] placeholder-[#7b4b26] border-[#b38b6d] dark:bg-blue-200 dark:border-gray-600 text-black">
          <i class="fas fa-sign-out-alt"></i> Log Out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const userName = ref('User name'); // Example data
const userEmail = ref('User@name.com'); // Example data
const router = useRouter();

const logout = () => {
  router.push('/login');
};
</script>

<style scoped>
.account-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  background: rgba(0, 0, 0, 0);
}

.account-card {
  border: 1px solid;
  border-radius: 15px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 30px;
  font-weight: 600;
}

.user-info {
  margin-bottom: 30px;
}

.avatar {
  font-size: 70px;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 15px 0;
  font-size: 1.5rem;
}

p {
  margin: 5px 0;
  font-size: 1rem;
}

.logout-btn {
  border: 1px solid;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  width: 100%;
  margin-top: 20px;
}

.logout-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.fa-sign-out-alt {
  margin-right: 10px;
}
</style>