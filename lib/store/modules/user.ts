import { Module } from 'vuex'
import { TUser } from '../../../types/user';
import api from '../../api'

export interface UsersState {
    users: TUser[]
}

const usersModule: Module<UsersState, any> = {
    namespaced: true,
    state: (): UsersState => ({
        users: [],
    }),
    getters: {
        allUsers: (state): TUser[] => state.users,
        availableUsers: (state): TUser[] =>
            state.users.filter((u) => u.is_available),
    },
    mutations: {
        setUsers(state, users: TUser[]) {
            state.users = users
        },
        updateUser(state, updatedUser: TUser) {
            const index = state.users.findIndex((u) => u.id === updatedUser.id)
            if (index !== -1) state.users[index] = updatedUser
        },
    },

    actions: {
        async fetchUsers({ commit }) {
            const { data } = await api.get<TUser[]>("/users")
            commit("setUsers", data)
        },
        async toggleAvailability({ commit }, user: TUser) {
            await api.patch<TUser>(`/users/${user.id}/toggle-availability`, {
                is_available: user.is_available,
            });
        },
    },
}

export default usersModule
