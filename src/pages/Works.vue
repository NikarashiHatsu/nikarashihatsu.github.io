<template>
    <div>
        <div v-if="getRoute === '/works'" class="grid sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-6">
            <WorkCard 
                v-for="(work, index) in workData" 
                :key="index"
                :author="work.author"
                :date="work.date"
                :image="work.image"
                :title="work.title"
                :slug="work.slug">
            </WorkCard>
        </div>
        <div v-else class="px-4">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import router from './../router'
    import works from './../data/workdata'
    import WorkCard from './../components/WorkCard.vue'

    export default {
        name: 'Works',
        data() {
            return {
                workData: works
            }
        },
        components: {
            WorkCard
        },
        computed: {
            getRoute() {
                return router.currentRoute.value.path
            }
        }
    }
</script>