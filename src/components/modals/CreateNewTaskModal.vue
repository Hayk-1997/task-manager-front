<script setup lang="ts">
import { TUser } from '../../../types/user'
import { TStatus } from '../../../types/status'
import { TCurrentTask } from '../../../types/task'

const { showModal, closeModal, users, currentTask } = defineProps<{
  showModal?: boolean
  currentTask: {
    title: string
    description: string
    due_date: string
    assigned_user_id: string | null
    status: string
  }
  users: TUser[]
  closeModal: () => void
  statuses: TStatus[]
  onSubmit: () => void
  today: string
  editMode: boolean
}>()

const emit = defineEmits<{
  (e: 'update:currentTask', value: TCurrentTask): void
}>()
</script>

<template>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white p-6 rounded shadow w-96">
      <h3 class="text-xl font-bold mb-4">{{ editMode ? 'Create New Task' : 'Edit Task' }}</h3>
      <form @submit.prevent="onSubmit">
        <input
          required
          placeholder="Title"
          class="w-full mb-2 p-2 border rounded"
          :value="currentTask.title"
          @input="
            emit('update:currentTask', {
              ...currentTask,
              title: ($event.target as HTMLInputElement).value,
            })
          "
        />
        <textarea
          required
          placeholder="Description"
          class="w-full mb-2 p-2 border rounded"
          :value="currentTask.description"
          @input="
            emit('update:currentTask', {
              ...currentTask,
              description: ($event.target as HTMLTextAreaElement).value,
            })
          "
        />
        <input
          :min="today"
          required
          type="date"
          class="w-full mb-2 p-2 border rounded"
          :value="currentTask.due_date"
          @input="
            emit('update:currentTask', {
              ...currentTask,
              due_date: ($event.target as HTMLInputElement).value,
            })
          "
        />

        <select
          required
          class="w-full mb-2 p-2 border rounded"
          :value="currentTask.assigned_user_id"
          @input="
            emit('update:currentTask', {
              ...currentTask,
              assigned_user_id: String(($event.target as HTMLInputElement).value),
            })
          "
        >
          <option disabled value="">Select User</option>
          <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
        </select>

        <select
          required
          class="w-full mb-4 p-2 border rounded"
          :value="currentTask.status"
          @input="
            emit('update:currentTask', {
              ...currentTask,
              status: String(($event.target as HTMLSelectElement).value),
            })
          "
        >
          <option disabled value="">Select Status</option>
          <option v-for="status in statuses" :key="status.id" :value="status.label">
            {{ status.name }}
          </option>
        </select>

        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 border rounded" @click="closeModal">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>
