<template>
    <button class="absolute bottom-0 right-0 flex items-center justify-center w-12 h-12 shadow-xl rounded-full m-4
                bg-white dark:bg-gray-900
                border dark:border-transparent" @click="toggleTheme">
        
        <!-- Dark theme -->
        <span v-if="theme === 'dark'">
            <svg class="w-6 h-6 text-yellow-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <!-- Font Awesome Free 5.15.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) -->
                <path d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z"/>
            </svg>
        </span>

        <!-- Light theme -->
        <span v-if="theme === 'light'">
            <svg class="w-6 h-6 text-gray-800 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <!-- Font Awesome Free 5.15.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) -->
                <path d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z"/>
            </svg>
        </span>
    </button>
</template>

<script>
    export default {
        name: 'ThemeToggler',
        data() {
            return {
                theme: localStorage.theme
            }
        },
        methods: {
            toggleTheme() {
                if(localStorage.theme !== 'dark') {
                    localStorage.theme = this.theme = 'dark'
                    document.documentElement.classList.add('dark')
                } else {
                    localStorage.theme = this.theme = 'light'
                    document.documentElement.classList.remove('dark')
                }
            }
        }
    }
</script>