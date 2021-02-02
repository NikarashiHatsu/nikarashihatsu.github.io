<template>
    <div class="rounded-lg shadow-lg col-span-1
                bg-white dark:bg-gray-900">
        <div class="border-b
                    border-gray-300 dark:border-gray-700">
            <img width="450" height="450" class="w-full h-full object-cover rounded-t-lg" :src="image" alt="Itwasda Polda Kalteng Android">
        </div>
        <div class="px-4 py-3">
            <router-link class="transition duration-300 ease-in-out hover:text-blue-400" :to="`works/${this.slug}`">
                <h6 class="text-lg font-semibold line-clamp-2">
                    {{ this.title }}
                </h6>
            </router-link>
            <p class="mt-1 text-sm">
                By: {{ this.author }}
            </p>
            <p class="mt-1 text-sm">
                Date: {{ this.date }}
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'WorkCard',
        props: {
            image: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            author: {
                type: String,
                required: true
            },
            date: {
                type: String,
                required: true
            },
            slug: {
                type: String,
                required: true
            }
        },
    }
</script>