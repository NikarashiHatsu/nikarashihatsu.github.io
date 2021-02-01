import { createWebHashHistory, createRouter } from 'vue-router'
import Index from './pages/Index.vue'
import Works from './pages/Works.vue'
import ItwasdaPoldaKaltengAndroid from './pages/works/ItwasdaPoldaKaltengAndroid.vue'

const history = createWebHashHistory()
const routes = [
    {
        path: '/',
        component: Index
    },
    {
        path: '/works',
        component: Works,
        children: [
            {
                path: 'itwasda-polda-kalteng-android',
                component: ItwasdaPoldaKaltengAndroid
            }
        ]
    },
]
const router = createRouter({ history, routes })

export default router