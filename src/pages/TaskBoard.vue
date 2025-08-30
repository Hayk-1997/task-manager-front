<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue'
import { useStore } from 'vuex'
import CreateNewTaskModal from '@/components/modals/CreateNewTaskModal.vue'
import { VueAwesomePaginate } from 'vue-awesome-paginate'
import { TCurrentTask, TTask } from '../../types/task'
import { TStatus } from '../../types/status'
import { useToast } from 'vue-toast-notification'

const store = useStore()
const $toast = useToast()

const search = ref('')
const filterStatus = ref('')
const filterUser = ref('')
const showModal = ref(false)
const currentPage = ref(1)
const editMode = ref(false)

const tasks = computed(() => store.getters['task/allTasks'])
const statuses = computed(() => store.getters['task/getStatuses'])
const users = computed(() => store.getters['user/allUsers'])
const today = new Date().toISOString().split('T')[0]

const task = ref<TCurrentTask>({
  id: null,
  title: '',
  description: '',
  due_date: today,
  assigned_user_id: '',
  status: '',
})

onMounted(() => {
  store.dispatch('task/fetchTasks', { page: 1, search: search.value, status: filterStatus.value })
  store.dispatch('task/getStatuses')
  store.dispatch('user/fetchUsers')
})

watchEffect(() => {
  filterStatus.value = statuses.value.length ? statuses.value[0].label : ''
})

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editMode.value = false
  task.value = {
    title: '',
    description: '',
    due_date: '',
    assigned_user_id: null,
    status: '',
    id: null,
  }
}

const onSubmit = async () => {
  try {
    if (editMode.value === true) {
      await store.dispatch('task/updateTask', task.value)
    } else {
      await store.dispatch('task/createTask', task.value)
    }
    $toast.open({
      message: 'Form submitted successfully.',
      type: 'success',
      duration: 1000,
      dismissible: true,
    })
    await store.dispatch('task/fetchTasks')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    $toast.open({
      message: 'Something went wrong. Please try again.',
      type: 'error',
      duration: 1000,
    })
  }
  closeModal()
}

const onPageChange = (page: number) => {
  store.dispatch('task/fetchTasks', {
    page: page,
    search: search.value,
    status: filterStatus.value,
  })
}

const handleSearch = () => {
  store.dispatch('task/fetchTasks', {
    page: 1,
    search: search.value,
    status: filterStatus.value,
    assignee: filterUser.value,
  })
}

const handleClearSearch = () => {
  search.value = ''
  filterStatus.value = ''
  filterUser.value = ''
  store.dispatch('task/fetchTasks', { page: 1, search: search.value, status: filterStatus.value })
}

const handleEditTask = (currentTask: TTask) => {
  task.value = {
    id: currentTask.id,
    title: currentTask.title,
    description: currentTask.description,
    due_date: new Date(currentTask.due_date).toISOString().split('T')[0],
    assigned_user_id: String(currentTask.assigned_user_id),
    status: currentTask.status,
  }
  editMode.value = true
  openModal()
}

const handleRemoveTask = async (task: TTask) => {
  try {
    await store.dispatch('task/deleteTask', task.id)
    $toast.open({
      message: 'Task removed successfully.',
      type: 'success',
      duration: 1000,
      dismissible: true,
    })
    await store.dispatch('task/fetchTasks')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    $toast.open({
      message: 'Something went wrong. Please try again.',
      type: 'error',
      duration: 1000,
    })
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Task Board</h2>
    <button class="bg-blue-500 text-white px-4 py-2 rounded mb-4" @click="openModal">
      + Create Task
    </button>

    <CreateNewTaskModal
      v-model:current-task="task"
      :show-modal="showModal"
      :users="users"
      :close-modal="closeModal"
      :statuses="statuses"
      :on-submit="onSubmit"
      :today="today"
      :edit-mode="editMode"
    />

    <!-- Search + Filter -->
    <div class="flex gap-4 mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Search tasks..."
        class="border p-2 rounded w-1/3"
      />
      <select v-model="filterStatus" class="border p-2 rounded">
        <option v-for="status in statuses" :key="status.id" :value="status.label">
          {{ status.name }}
        </option>
      </select>
      <select v-model="filterUser" required class="border p-2 rounded">
        <option disabled value="">Select User</option>
        <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
      </select>
      <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="handleSearch">Search</button>
      <button class="bg-red-500 text-white px-4 py-2 rounded" @click="handleClearSearch">
        Clear All
      </button>
    </div>

    <div class="space-y-2">
      <div
        v-for="task in tasks.data"
        :key="task.id"
        class="border p-2 rounded bg-white shadow flex justify-between items-start"
      >
        <div>
          <h3 class="font-bold">{{ task.title }}</h3>
          <p>{{ task.description }}</p>
          <p class="text-sm text-gray-500">Due: {{ task.due_date }}</p>
          <p class="text-sm text-gray-500">Assigned User: {{ task.assigned_user.name }}</p>
          <p class="text-sm text-gray-500">
            Status: {{ statuses.find((item: TStatus) => item.label === task.status)?.name }}
          </p>
        </div>

        <!-- Edit Button -->
        <div class="gap-4 flex">
          <button
            class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            @click="handleEditTask(task)"
          >
            Edit
          </button>
          <button
            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            @click="handleRemoveTask(task)"
          >
            Remove
          </button>
        </div>
      </div>
    </div>

    <div class="example-one mt-3">
      <vue-awesome-paginate
        v-if="tasks.total"
        v-model="currentPage"
        :total-items="tasks.total"
        :items-per-page="tasks.per_page"
        :max-pages-shown="5"
        @click="onPageChange"
      />
    </div>
  </div>
</template>

<style>
.example-one .pagination-container {
  column-gap: 10px;
}
.example-one .paginate-buttons {
  height: 40px;
  width: 40px;
  border-radius: 20px;
  cursor: pointer;
  background-color: rgb(242, 242, 242);
  border: 1px solid rgb(217, 217, 217);
  color: black;
}
.example-one .paginate-buttons:hover {
  background-color: #d8d8d8;
}
.example-one .active-page {
  background-color: #3498db;
  border: 1px solid #3498db;
  color: white;
}
.example-one .active-page:hover {
  background-color: #2988c8;
}
.example-one .back-button:active,
.example-one .next-button:active {
  background-color: #c4c4c4;
}
</style>
