import staticImages from './StaticImages'

import ItwasdaPoldaKaltengAndroid from './../pages/works/ItwasdaPoldaKaltengAndroid.vue'

let WorksDB = [
    {
        slug: undefined,
        url: 'https://4reality.id',
        thumbnail: staticImages.fourReality,
        title: '4 Reality Team Company Profile',
        overview: 'A company profile for 4 Reality Vtuber Team.',
        component: undefined,
        featured: true,
    },
    {
        slug: 'itwasda-polda-kalteng-android',
        url: undefined,
        thumbnail: staticImages.itwasdaPoldaKaltengAndroid,
        title: 'Itwasda Polda Kalteng Android Dashboard',
        overview: 'A dashboard view used for Itwasda Polda Kalimantan Tengah.',
        component: ItwasdaPoldaKaltengAndroid,
        featured: false,
    },
]

export default WorksDB