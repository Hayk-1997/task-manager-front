import { createStore } from 'vuex';
import auth from './modules/auth';
import task from "./modules/task";
import user from "./modules/user";

export default createStore({
    modules: {
        auth,
        task,
        user,
    }
})
