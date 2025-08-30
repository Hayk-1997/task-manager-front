<script setup lang='ts'>
import { TUser } from '../../../types/user';
import { TStatus } from '../../../types/status';
import { watchEffect } from 'vue';

const { showModal, closeModal, users, currentTask } = defineProps<{
  showModal?: boolean;
  currentTask: {
    title: string;
    description: string;
    due_date: string;
    assigned_user_id: number | string;
    status: string;
  };
  users: TUser[];
  closeModal: () => void;
  statuses: TStatus[];
  onSubmit: () => void;
  today: string;
  editMode: boolean;
}>();


watchEffect(() => {
  console.log('currentTask', currentTask);
});

</script>

<template>
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow w-96">
      <h3 class="text-xl font-bold mb-4">{{ editMode ? "Create New Task" : "Edit Task" }}</h3>
      <form @submit.prevent="onSubmit">
        <input v-model="currentTask.title" required placeholder="Title" class="w-full mb-2 p-2 border rounded" />
        <textarea v-model="currentTask.description" required placeholder="Description" class="w-full mb-2 p-2 border rounded"></textarea>
        <input v-model="currentTask.due_date" :min="today" required type="date" class="w-full mb-2 p-2 border rounded" />

        <select v-model="currentTask.assigned_user_id" required class="w-full mb-2 p-2 border rounded">
          <option disabled value="">Select User</option>
          <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
        </select>

        <select v-model="currentTask.status" required class="w-full mb-4 p-2 border rounded">
          <option disabled value="">Select Status</option>
          <option
              v-for="status in statuses"
              :key="status.id"
              :value="status.label"
          >
            {{ status.name }}
          </option>
        </select>

        <div class="flex justify-end gap-2">
          <button type="button" @click="closeModal" class="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>