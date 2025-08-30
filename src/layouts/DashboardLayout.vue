<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md p-4">
      <h1 class="text-xl font-bold mb-6">Admin Dashboard</h1>
      <nav class="flex flex-col space-y-2">
        <RouterLink to="/" class="hover:bg-gray-100 p-2 rounded">Task Board</RouterLink>
        <RouterLink to="/users" class="hover:bg-gray-100 p-2 rounded">Users</RouterLink>
      </nav>
      <button @click="logout" class="mt-6 bg-red-500 text-white px-4 py-2 rounded w-full">
        Logout
      </button>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const router = useRouter();

const store = useStore();

const logout = () => {
  router.push('/login');
  store.dispatch('auth/logout');
}
</script>
