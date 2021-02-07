<template>
    <div id="notesDetail">
        <Navbar />
        
        <div class="max-w-7xl w-full mx-auto px-6">
            <div class="grid grid-cols-12 grid-flow-row gap-6 py-6">
                <div class="col-span-12 md:col-span-9 lg:col-span-8">
                    <component :is="component" />
                </div>
                <div class="col-span-12 md:col-span-3 lg:col-span-4">
                    <Profile />
                </div>
            </div>
        </div>

        <ThemeToggler />
    </div>
</template>

<script>
    import NotesDB from './../data/NotesDB'
    import router from './../router'

    import Navbar from './../components/Navbar.vue'
    import Profile from './../components/Profile.vue'
    import ThemeToggler from './../components/ThemeToggler.vue'

    export default {
        name: 'NotesDetail',
        components: {
            Navbar,
            Profile,
            ThemeToggler
        },
        mounted() {
            let slug = router.currentRoute.value.params.slug
            let component = undefined
            
            for(let i = 0; i < NotesDB.length; i++) {
                if(NotesDB[i].slug === slug) {
                    component = NotesDB[i].component
                }
            }

            if(component === undefined) {
                router.replace('/404')
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