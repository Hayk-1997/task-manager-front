<template>
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded-2xl shadow w-96">
      <h2 class="text-xl font-bold mb-4">Login</h2>
      <form @submit.prevent="login">
        <input
          v-model="email"
          type="email"
          required
          placeholder="Email"
          class="w-full mb-3 p-2 border rounded"
        />
        <input
          v-model="password"
          type="password"
          required
          placeholder="Password"
          class="w-full mb-3 p-2 border rounded"
        />
        <button class="bg-blue-500 text-white w-full py-2 rounded">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useToast } from 'vue-toast-notification'

const $toast = useToast()
const email = ref('')
const password = ref('')
const router = useRouter()
const store = useStore()

const login = async () => {
  console.log('email', email)
  const success = await store.dispatch('auth/login', {
    email: email.value,
    password: password.value,
  })
  if (success) router.push('/')
  else
    $toast.open({
      message: 'Something went wrong. Please try again.',
      type: 'error',
      duration: 1000,
    })
}
</script>
