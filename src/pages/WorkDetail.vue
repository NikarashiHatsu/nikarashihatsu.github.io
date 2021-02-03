<template>
    <div>
        <WorksNavbar />
        <ThemeToggler />
        <component :is="component" />
    </div>
</template>

<script>
    import router from './../router'
    import WorksDB from './../data/WorksDB'

    import ThemeToggler from './../components/ThemeToggler.vue'
    import WorksNavbar from './../components/WorksNavbar.vue'

    export default {
        name: 'WorkDetail',
        components: {
            ThemeToggler,
            WorksNavbar,
        },
        created() {
            let slug = router.currentRoute.value.params.slug
            let component = undefined
            
            for(let i = 0; i < WorksDB.length; i++) {
                if(WorksDB[i].slug === slug) {
                    component = WorksDB[i].component
                }
            }

            if(component === undefined) {
                router.replace('/not-found')
            }

            this.component = component
        },
        data() {
            return {
                component: undefined
            }
        }
    }
</script>