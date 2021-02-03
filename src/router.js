import { createWebHashHistory, createRouter } from 'vue-router'
import Page404 from './pages/Page404.vue'
import Index from './pages/Index.vue'
import Works from './pages/Works.vue'
import NotesDetail from './pages/NotesDetail.vue'
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
    {
        path: '/notes/:slug',
        component: NotesDetail
    },
    {
        path: '/404',
        component: Page404
    }
]
const router = createRouter({ history, routes })

export default router