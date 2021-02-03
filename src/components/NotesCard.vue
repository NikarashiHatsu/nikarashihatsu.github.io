<template>
    <div class="transition-shadow duration-300 ease-in-out col-span-1 rounded-lg
                shadow-lg hover:shadow-xl
                bg-white dark:bg-gray-900">
        <img width="450" height="450" class="w-full h-48 object-cover rounded-t-lg border-b border-gray-300" :src="noteDetail.thumbnail" :alt="noteDetail.title">
        <div class="px-4 py-3">
            <router-link :to="`notes/${noteDetail.slug}`">
                <h6 class="transition-colors duration-300 ease-in-out text-lg font-semibold line-clamp-2 mb-1
                            text-blue-500 hover:text-blue-600 
                            dark:text-blue-400 dark:hover:text-blue-500">
                    {{ noteDetail.title }}
                </h6>
            </router-link>
            <p class="mb-2 line-clamp-3">
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