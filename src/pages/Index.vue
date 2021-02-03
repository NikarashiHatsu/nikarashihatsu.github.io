<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-6">
        <NotesCard
            v-for="(notes, index) in notesData"
            :key="index"
            :noteDetail="notes" />
    </div>
</template>

<script>
    import NotesCard from './../components/NotesCard.vue'
    import notesData from './../data/notesdata'

    export default {
        name: 'Index',
        components: {
            NotesCard
        },
        data() {
            return {
                notesData: notesData
            }
        }
    }
</script>