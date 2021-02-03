<template>
    <div class="w-screen h-screen flex flex-col items-center justify-center">
        <img width="75" height="75" src="/logo.svg" alt="Developer's Note Logo">
        <p class="mb-4">
            Oops, the page you are looking is not found.
        </p>
        <router-link class="transition duration-300 ease-in-out font-semibold text-blue-500 hover:text-blue-600" to="/">
            Bring me to index.
        </router-link>
    </div>
</template>

<script>
    export default {
        name: 'NotFound'
    }
</script>