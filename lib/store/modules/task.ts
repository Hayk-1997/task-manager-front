import { Module } from 'vuex'
import api from '../../api'
import { TTaskData } from '../../../types/task'
import { TStatus } from '../../../types/status'

export interface TasksState {
  tasks: TTaskData
  statuses: TStatus[]
}

const task: Module<TasksState, never> = {
  namespaced: true,
  state: (): TasksState => ({
    tasks: {
      data: [],
      current_page: 1,
      per_page: 10,
      total: 0,
    },
    statuses: [],
  }),
  getters: {
    allTasks: (state) => state.tasks,
    tasksByStatus: (state) => (status: string) =>
      state.tasks.data.filter((t) => t.status === status),
    filteredTasks: (state) => (search: string, filterStatus: string) => {
      return state.tasks?.data?.filter((t) => {
        const matchesStatus = filterStatus ? t.status === filterStatus : true
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase())
        return matchesStatus && matchesSearch
      })
    },
    getStatuses: (state) => state.statuses,
  },
  mutations: {
    setTasks(state, tasks: TTaskData) {
      state.tasks = tasks
    },
    setStatuses(state, statuses: TStatus[]) {
      state.statuses = statuses
    },
  },
  actions: {
    async fetchTasks({ commit }, query) {
      const { data } = await api.get('/task/all', { params: query })
      commit('setTasks', data)
    },
    async getStatuses({ commit }) {
      const { data } = await api.get<TStatus[]>('/statuses')
      commit('setStatuses', data)
    },
    async createTask({ commit }, payload) {
      await api.post('/task/store', { ...payload })
    },
    async updateTask({ commit }, payload) {
      await api.put(`/task/${payload.id}`, { ...payload })
    },
    async deleteTask({ commit }, id: number) {
      await api.delete(`/task/${id}`)
    },
  },
}

export default task
