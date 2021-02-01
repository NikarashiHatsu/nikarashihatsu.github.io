<template>
    <div>
        <div v-if="getRoute === '/works'" class="grid grid-cols-3 grid-flow-row gap-6">
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
        <router-view></router-view>
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