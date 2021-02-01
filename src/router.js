import { createWebHistory, createRouter } from 'vue-router'
import Index from './pages/Index.vue'

const history = createWebHistory()
const routes = [
    {
        path: '/',
        component: Index
    },
]
const router = createRouter({ history, routes })

export default router