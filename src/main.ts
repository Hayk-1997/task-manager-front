import { createApp } from 'vue'
import router from './router'
import store from '../lib/store'
import VueAwesomePaginate from 'vue-awesome-paginate'
import ToastPlugin from 'vue-toast-notification'

import 'vue-awesome-paginate/dist/style.css'
import 'vue-toast-notification/dist/theme-bootstrap.css'
import './assets/main.css'

import App from './App.vue'

createApp(App).use(router).use(VueAwesomePaginate).use(ToastPlugin).use(store).mount('#app')
