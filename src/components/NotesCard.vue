<template>
    <div class="transition-shadow duration-300 ease-in-out col-span-1 rounded-lg
                shadow-lg hover:shadow-xl
                bg-white dark:bg-gray-900">
        <img width="200" height="150" class="w-full h-48 object-cover rounded-t-lg border-b border-gray-300" :src="noteDetail.thumbnail" :alt="noteDetail.title">
        <div class="px-4 py-3">
            <router-link :to="`notes/${noteDetail.slug}`">
                <h6 class="transition-colors duration-300 ease-in-out text-lg font-semibold line-clamp-2 mb-1 leading-normal
                            text-gray-700 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-400">
                    {{ noteDetail.title }}
                </h6>
            </router-link>
            <p class="text-sm 
                    text-gray-500 dark:text-gray-400">
                By: {{ noteDetail.author }}
            </p>
            <p class="text-sm mb-1 
                    text-gray-500 dark:text-gray-400">
                Date: {{ noteDetail.date }}
            </p>
            <p class="mb-2 leading-normal line-clamp-3">
                {{ noteDetail.overview }}
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'NotesCard',
        props: {
            noteDetail: {
                type: Object,
                default: {}
            }
        },
    }
</script>