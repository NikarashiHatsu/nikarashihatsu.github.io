import { createWebHashHistory, createRouter } from 'vue-router'
import Index from './pages/Index.vue'
import NotesDetail from './pages/NotesDetail.vue'
import NotFound from './pages/NotFound.vue'
import WorkDetail from './pages/WorkDetail.vue'
import Works from './pages/Works.vue'

const history = createWebHashHistory()
const routes = [
    {
        path: '/',
        component: Index
    },
    {
        path: '/works',
        component: Works,
    },
    {
        path: '/works/:slug',
        component: WorkDetail
    },
    {
        path: '/notes',
        component: NotesDetail
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFound
    }
]

const router = createRouter({ history, routes })

export default router