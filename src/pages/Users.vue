<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Users</h2>
    <div v-for="user in users" :key="user.id" class="flex justify-between items-center border-b p-2">
      <span>{{ user.name }}</span>
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" v-model="user.is_available" @change="toggle(user)" class="hidden" />
        <div class="w-12 h-6 bg-gray-300 rounded-full relative">
          <div :class="['w-6 h-6 rounded-full absolute top-0 transition',
            user.is_available ? 'left-6 bg-green-500' : 'left-0 bg-red-500']"></div>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex';
import { useToast } from 'vue-toast-notification';

const store = useStore();
const $toast = useToast();

onMounted(() => {
  store.dispatch('user/fetchUsers');
})

const users = computed(() => store.getters['user/allUsers']);

const toggle = (user) => {
  store.dispatch('user/toggleAvailability', user).then(() => {
    $toast.open({
      message: "User availability updated successfully.",
      type: "success",
      duration: 1000,
      dismissible: true
    });
  }).catch(() => {
    $toast.open({
      message: "User availability update failed.",
      type: "error",
      duration: 1000,
    });
  });
}
</script>
