import { createWebHashHistory, createRouter } from 'vue-router'
import Index from './pages/Index.vue'
import Works from './pages/Works.vue'

const history = createWebHashHistory()
const routes = [
    {
        path: '/',
        component: Index
    },
    {
        path: '/works',
        component: Works
    }
]
const router = createRouter({ history, routes })

export default router