<template>
    <div>
        
    </div>
</template>

<script>
    import NotesDB from './../data/NotesDB'
    import router from './../router'

    export default {
        name: 'NotesDetail',
        mounted() {
            let slug = router.currentRoute.value.params.slug
            let note = undefined
            
            for(let i = 0; i < NotesDB.length; i++) {
                if(NotesDB[i].slug === slug) {
                    note = NotesDB[i]
                }
            }

            if(note !== undefined) {
                this.note = note
            } else {
                router.replace('/404')
            }
        },
        data() {
            return {
                note: {}
            }
        }
    }
</script>