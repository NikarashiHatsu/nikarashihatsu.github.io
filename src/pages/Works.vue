<template>
    <div id="index">
        <Navbar />
        
        <div class="max-w-7xl w-full mx-auto px-6">
            <div class="grid grid-cols-12 grid-flow-row gap-6 py-6">
                <div class="col-span-12 md:col-span-9 lg:col-span-8">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-6">
                        <WorksCard
                            v-for="(work, index) in WorksDB"
                            :key="index"
                            :workData="work" />
                    </div>
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
    import Navbar from './../components/Navbar.vue'
    import WorksCard from './../components/WorksCard.vue'
    import Profile from './../components/Profile.vue'
    import ThemeToggler from './../components/ThemeToggler.vue'
    import WorksDB from './../data/WorksDB'

    export default {
        name: 'Index',
        components: {
            Navbar,
            Profile,
            WorksCard,
            ThemeToggler
        },
        data() {
            return {
                WorksDB: WorksDB
            }
        }
    }
</script>