<template>
    <header class="flex flex-col items-center shadow-lg pt-4
                    bg-white dark:bg-gray-900">
        <img width="60" height="60" src="/logo.svg" alt="A Developer's Note Logo" />
        <h6 class="uppercase text-red-600 text-lg font-semibold tracking-wide my-4">A Developer's Note</h6>
        <hr class="w-full border-t
                    border-gray-200 dark:border-gray-800" />

        <nav class="flex items-center">
            <router-link class="transition-colors duration-300 ease-in-out px-5 py-2 pt-3 border-b-4 uppercase text-sm font-semibold
                            border-transparent hover:border-blue-400 
                            dark:border-transparent dark:hover:border-blue-300
                            text-gray-600 hover:text-blue-600 
                            dark:text-white dark:hover:text-blue-300"
                        :class="currentRoute === '/' ? 'text-blue-600 dark:text-blue-300 border-blue-400 dark:border-blue-300' : ''" to="/">
                Home
            </router-link>
            <router-link class="transition-colors duration-300 ease-in-out px-5 py-2 pt-3 border-b-4 uppercase text-sm font-semibold
                                border-transparent hover:border-blue-400 
                                dark:border-transparent dark:hover:border-blue-300
                                text-gray-600 hover:text-blue-600 
                                dark:text-white dark:hover:text-blue-300"
                        :class="currentRoute === '/works' ? 'text-blue-600 dark:text-blue-300 border-blue-400 dark:border-blue-300' : ''" to="/works">
                            Works
            </router-link>
        </nav>
    </header>
</template>

<script>
    import router from '../router'

    export default {
        name: 'Navbar',
        computed: {
            currentRoute() {
                return router.currentRoute.value.path
            }
        }
    }
</script>