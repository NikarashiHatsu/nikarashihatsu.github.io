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
        slug: undefined,
        url: 'https://play.google.com/store/apps/details?id=com.bengkelweb.pnpsi',
        thumbnail: staticImages.pnpsi,
        title: 'Padepokan Pencak Silat TMII',
        overview: 'A hotel and convention booking mobile application for Padepokan Pencak Silat Taman Mini Indonesia Indah.',
        component: undefined,
        featured: false,
    },
    {
        slug: undefined,
        url: 'https://play.google.com/store/apps/details?id=com.bengkelweb.personalcare',
        thumbnail: staticImages.personnalCare,
        title: 'Personnal Care Polda Aceh',
        overview: 'A mobile application designed for Personnels in Polda Aceh',
        component: undefined,
        featured: false,
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