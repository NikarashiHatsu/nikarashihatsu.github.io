<template>
    <div>
        
    </div>
</template>

<script>
    import notesData from './../data/notesdata'
    import router from './../router'

    export default {
        name: 'NotesDetail',
        mounted() {
            let slug = router.currentRoute.value.params.slug
            let note = undefined
            
            for(let i = 0; i < notesData.length; i++) {
                if(notesData[i].slug === slug) {
                    note = notesData[i]
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