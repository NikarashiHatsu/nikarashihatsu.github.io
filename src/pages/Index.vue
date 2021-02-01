<template>
    <header class="flex flex-col items-center shadow-lg pt-4
                    bg-white dark:bg-gray-900">
        <img width="60" height="60" src="/logo.svg" alt="A Developer's Note Logo" />
        <h6 class="uppercase text-red-400 text-lg font-semibold tracking-wide my-4">A Developer's Note</h6>
        <hr class="w-full border-t
                    border-gray-200 dark:border-gray-800" />

        <nav class="flex items-center">
            <a class="transition duration-300 ease-in-out px-5 py-2 pt-3 border-b-4 uppercase text-sm font-semibold
                    border-white hover:border-blue-400 
                    dark:border-gray-900 dark:hover:border-blue-300
                    text-gray-600 hover:text-blue-500 
                    dark:text-white dark:hover:text-blue-300" href="/">
                Home
            </a>
            <a class="transition duration-300 ease-in-out px-5 py-2 pt-3 border-b-4 uppercase text-sm font-semibold
                    border-white hover:border-blue-400 
                    dark:border-gray-900 dark:hover:border-blue-300
                    text-gray-600 hover:text-blue-500 
                    dark:text-white dark:hover:text-blue-300" href="/works">
                Works
            </a>
        </nav>
    </header>
</template>

<script>
    export default {
        name: 'Index',
    }
</script>