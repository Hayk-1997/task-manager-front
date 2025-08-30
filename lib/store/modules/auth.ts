import { Module } from 'vuex'
import api from '../../api'
import { TUser } from '../../../types/user'

type TAuthState = {
  user: TUser | null
}

type TLoginPayload = {
  email: string
  password: string
}

const auth: Module<TAuthState, never> = {
  namespaced: true,

  state: (): TAuthState => ({
    user: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.user,
    getUser: (state): TUser | null => state.user,
  },

  mutations: {
    setUser(state, user: TUser) {
      state.user = user
    },
    clearUser(state) {
      state.user = null
    },
  },

  actions: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async login({ commit }, payload: TLoginPayload): Promise<boolean> {
      try {
        await api.post('/login', payload)
        return true
      } catch (err) {
        console.error(err)
        return false
      }
    },

    async fetchUser({ commit }): Promise<void> {
      try {
        const { data } = await api.get<TUser>('/me')
        commit('setUser', data)
      } catch {
        commit('clearUser')
      }
    },

    async logout({ commit }): Promise<void> {
      await api.post('/logout')
      commit('clearUser')
    },
  },
}

export default auth
