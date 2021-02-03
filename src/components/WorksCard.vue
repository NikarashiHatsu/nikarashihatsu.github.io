<template>
    <div class="rounded-lg shadow-lg col-span-1
                bg-white dark:bg-gray-900">
        <div class="border-b
                    border-gray-300 dark:border-gray-700">
            <img width="450" height="450" class="w-full h-48 object-cover rounded-t-lg" :src="workData.thumbnail" alt="Itwasda Polda Kalteng Android">
        </div>
        <div class="px-4 py-3">
            <router-link class="transition-colors duration-300 ease-in-out 
                                text-blue-500 hover:text-blue-600
                                dark:text-blue-400 dark:hover:text-blue-500" :to="`works/${workData.slug}`">
                <h6 class="text-lg font-semibold line-clamp-2 mb-1">
                    {{ workData.title }}
                </h6>
            </router-link>
            <p class="mb-2 line-clamp-3">
                {{ workData.overview }}
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'WorkCard',
        props: {
            workData: {
                type: Object,
                required: true
            },
        },
    }
</script>